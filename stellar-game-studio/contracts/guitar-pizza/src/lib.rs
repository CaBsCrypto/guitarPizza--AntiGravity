#![no_std]

//! # Guitar Pizza -- ZK-Verified Rhythm Game Contract
//! Single-player rhythm game with Stellar Game Hub integration.
//! Uses RISC Zero receipt/journal pattern for off-chain score verification.
//!
//! ## Game Hub player1 / player2 Pattern
//! In the hackathon convention for single-player games:
//!   player1 = La Casa (admin/house) — the "opponent" set at `start_game`
//!   player2 = the human player
//! A `score_goal` is set when the session is opened.
//! In `end_game`, `player1_won=false` means **player2 (human) wins**.
//!   → score >= score_goal  → human wins (player1_won = false)
//!   → score <  score_goal  → La Casa wins (player1_won = true)
//!
//! Flow:
//! 1. Player calls start_game -> creates session, calls GameHub::start_game.
//! 2. Player plays off-chain, generates a RISC Zero receipt.
//! 3. Player calls submit_score -> contract verifies receipt, emits verified_score,
//!    calls GameHub::end_game with result based on score vs goal.
//!
//! Journal layout (big-endian, concatenated bytes):
//!   [0..4]    level_id         u32
//!   [4..8]    score            u32
//!   [8..40]   song_hash        [u8; 32]
//!   [40..44]  perfect_hits     u32
//!   [44..48]  total_hits       u32
//!   [48..52]  traps_avoided    u32
//!   [52..56]  total_traps      u32
//!   [56..60]  fever_seconds    u32
//!   [60..64]  pizzas_completed u32
//!   [64..96]  player_addr_hash [u8; 32] (keccak256 of player address string)
//!   [96..100] session_id       u32
//! Receipt bytes = journal_bytes ++ seal_bytes; min RECEIPT_MIN_LEN = 164.
//!
//! TODO: Replace verify_risc0_receipt placeholder with real verifier call:
//!   https://github.com/NethermindEth/stellar-risc0-verifier/

use soroban_sdk::{
    contract, contractclient, contracterror, contractimpl, contracttype,
    Address, Bytes, BytesN, Env, IntoVal, Symbol, vec,
};

const GAME_TTL_LEDGERS: u32 = 518_400;
const GAME_TTL_THRESHOLD: u32 = 120_960;
const RECEIPT_MIN_LEN: u32 = 164;
const JOURNAL_LEN: usize = 100;

/// Default score goal when caller doesn't supply one.
/// Equivalent to ~50 % of a typical 10 000-pt song.
const DEFAULT_SCORE_GOAL: u32 = 5_000;

#[contractclient(name = "GameHubClient")]
pub trait GameHub {
    fn start_game(env: Env, game_id: Address, session_id: u32,
        player1: Address, player2: Address,
        player1_points: i128, player2_points: i128);
    fn end_game(env: Env, session_id: u32, player1_won: bool);
}

/// External interface for the $SLICE token contract.
/// guitar-pizza is the sole authorized minter.
#[contractclient(name = "SliceTokenClient")]
pub trait SliceToken {
    fn mint(env: Env, to: Address, amount_slice: i128);
}

/// External interface for Nethermind's Groth16/risc0 verifier.
#[contractclient(name = "VerifierClient")]
pub trait Verifier {
    fn verify(env: Env, journal: Bytes, image_id: BytesN<32>, seal: Bytes);
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotPlayer = 1,
    SessionNotFound = 2,
    SessionAlreadyEnded = 3,
    ActiveSessionExists = 4,
    ReceiptTooShort = 5,
    InvalidReceipt = 6,
    ProofAlreadyUsed = 7,
    SessionIdMismatch = 8,
    PlayerMismatch = 9,
    HubNotConfigured = 10,
    Unauthorized = 11,
    NoRewardPending = 12,
    SliceNotConfigured = 13,
    VerifierNotConfigured = 14,
    InvalidProof = 15,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Session {
    pub session_id: u32,
    pub player: Address,
    pub level_id: u32,
    pub score_goal: u32,
    pub score: u32,
    pub is_ended: bool,
    pub player_won: bool,
    pub perfect_hits: u32,
    pub total_hits: u32,
    pub traps_avoided: u32,
    pub total_traps: u32,
    pub fever_seconds: u32,
    pub pizzas_completed: u32,
}

/// Configuration for SLICE rewards.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SliceConfig {
    /// Whole SLICE units awarded per winning session (e.g. 1 = 1 SLICE).
    pub slice_per_win: i128,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    GameHubAddress,
    Session(u32),
    ActiveSession(Address),
    ProofDigest(BytesN<32>),
    SliceToken,           // Address of the $SLICE token contract
    SliceConfig,          // SliceConfig — reward rules
    PendingReward(u32),   // i128 whole SLICE — unclaimed reward for session_id
    VerifierAddress,
    Risc0ImageId,
}

#[contract]
pub struct GuitarPizzaContract;

#[contractimpl]
impl GuitarPizzaContract {
    pub fn __constructor(env: Env, admin: Address, game_hub: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::GameHubAddress, &game_hub);
        env.storage().instance().extend_ttl(GAME_TTL_THRESHOLD, GAME_TTL_LEDGERS);
    }

    /// Open a new game session and register it with the Game Hub.
    ///
    /// # player1 / player2 convention
    ///   player1 = admin address (La Casa / the house) stored in contract storage.
    ///   player2 = the human `player` argument.
    ///   player1_points = score goal the human must beat to win.
    ///
    /// Rate-limit: at most 1 active session per player address.
    pub fn start_game(
        env: Env,
        session_id: u32,
        player: Address,
        level_id: u32,
        score_goal: u32,
    ) -> Result<(), Error> {
        player.require_auth_for_args(vec![
            &env,
            session_id.into_val(&env),
            level_id.into_val(&env),
            score_goal.into_val(&env),
        ]);

        // Rate-limit: one active session per player.
        let active_key = DataKey::ActiveSession(player.clone());
        if env.storage().temporary().has(&active_key) {
            return Err(Error::ActiveSessionExists);
        }
        let session_key = DataKey::Session(session_id);
        if env.storage().temporary().has(&session_key) {
            return Err(Error::ActiveSessionExists);
        }

        let goal = if score_goal == 0 { DEFAULT_SCORE_GOAL } else { score_goal };

        let session = Session {
            session_id,
            player: player.clone(),
            level_id,
            score_goal: goal,
            score: 0,
            is_ended: false,
            player_won: false,
            perfect_hits: 0,
            total_hits: 0,
            traps_avoided: 0,
            total_traps: 0,
            fever_seconds: 0,
            pizzas_completed: 0,
        };
        env.storage().temporary().set(&session_key, &session);
        env.storage().temporary().extend_ttl(&session_key, GAME_TTL_THRESHOLD, GAME_TTL_LEDGERS);
        env.storage().temporary().set(&active_key, &session_id);
        env.storage().temporary().extend_ttl(&active_key, GAME_TTL_THRESHOLD, GAME_TTL_LEDGERS);

        // Retrieve La Casa (player1 = house / admin).
        let la_casa: Address = env.storage().instance()
            .get(&DataKey::Admin)
            .expect("Admin not set");

        let hub_addr = Self::require_hub(&env)?;
        let hub = GameHubClient::new(&env, &hub_addr);

        // player1 = La Casa (house),  player2 = human player.
        // player1_points = score_goal the human must reach.
        // player2_points = 0 (starts with nothing to prove).
        hub.start_game(
            &env.current_contract_address(),
            &session_id,
            &la_casa,   // player1 = house
            &player,    // player2 = human
            &(goal as i128),
            &0i128,
        );

        env.events().publish(
            (Symbol::new(&env, "game_started"), player.clone()),
            (session_id, level_id, goal),
        );
        Ok(())
    }

    /// Submit a RISC Zero receipt to verify score and close the session.
    ///
    /// On success:
    ///  - Stores final achievement stats in session.
    ///  - Emits `verified_score` event.
    ///  - Calls `GameHub::end_game`:
    ///      player1_won = false  →  human player beats the house (score >= goal)
    ///      player1_won = true   →  La Casa wins (score < goal)
    pub fn submit_score(
        env: Env,
        session_id: u32,
        player: Address,
        receipt: Bytes,
    ) -> Result<bool, Error> {
        player.require_auth();

        let session_key = DataKey::Session(session_id);
        let mut session: Session = env.storage().temporary()
            .get(&session_key).ok_or(Error::SessionNotFound)?;

        if session.player != player { return Err(Error::NotPlayer); }
        if session.is_ended { return Err(Error::SessionAlreadyEnded); }

        // Anti-replay: reject any receipt that was already used.
        let digest: BytesN<32> = env.crypto().keccak256(&receipt).into();
        let digest_key = DataKey::ProofDigest(digest.clone());
        if env.storage().temporary().has(&digest_key) { return Err(Error::ProofAlreadyUsed); }

        // RISC Zero verification (placeholder -- see fn docs).
        let journal = Self::verify_risc0_receipt(&env, &receipt)?;

        // Parse journal fields.
        let _level_id_j   = read_u32_be(&journal, 0);
        let score         = read_u32_be(&journal, 4);
        let perfect_hits  = read_u32_be(&journal, 40);
        let total_hits    = read_u32_be(&journal, 44);
        let traps_avoided = read_u32_be(&journal, 48);
        let total_traps   = read_u32_be(&journal, 52);
        let fever_seconds = read_u32_be(&journal, 56);
        let pizzas_compl  = read_u32_be(&journal, 60);
        let journal_sid   = read_u32_be(&journal, 96);

        if journal_sid != session_id { return Err(Error::SessionIdMismatch); }

        // Validate player binding: journal encodes keccak256(player_str).
        let player_hash_j = slice_bytes_32(&journal, 64);
        let player_bytes  = player.to_string().to_bytes();
        let exp_hash: BytesN<32> = env.crypto().keccak256(&player_bytes).into();
        let exp_arr = exp_hash.to_array();
        let mut ok = true;
        for i in 0..32usize {
            if player_hash_j[i] != exp_arr[i] { ok = false; break; }
        }
        if !ok { return Err(Error::PlayerMismatch); }

        // Persist anti-replay digest.
        env.storage().temporary().set(&digest_key, &true);
        env.storage().temporary().extend_ttl(&digest_key, GAME_TTL_THRESHOLD, GAME_TTL_LEDGERS);

        // Determine outcome: human wins when score reaches the goal.
        let player_won = score >= session.score_goal;
        // player1_won refers to La Casa → true = house wins, false = human wins.
        let player1_won = !player_won;

        // Update session with verified results.
        session.score = score;
        session.is_ended = true;
        session.player_won = player_won;
        session.perfect_hits = perfect_hits;
        session.total_hits = total_hits;
        session.traps_avoided = traps_avoided;
        session.total_traps = total_traps;
        session.fever_seconds = fever_seconds;
        session.pizzas_completed = pizzas_compl;
        env.storage().temporary().set(&session_key, &session);
        env.storage().temporary().extend_ttl(&session_key, GAME_TTL_THRESHOLD, GAME_TTL_LEDGERS);

        // Remove active sentinel so the player can start a new session.
        env.storage().temporary().remove(&DataKey::ActiveSession(player.clone()));

        env.events().publish(
            (Symbol::new(&env, "verified_score"), player.clone()),
            (session_id, score, player_won, perfect_hits, total_hits,
             traps_avoided, total_traps, fever_seconds, pizzas_compl),
        );

        // Notify Game Hub with the outcome.
        let hub_addr = Self::require_hub(&env)?;
        GameHubClient::new(&env, &hub_addr).end_game(&session_id, &player1_won);

        // If player won and SLICE is configured, park a claimable reward.
        // Stored in temporary storage so it auto-expires with the session window.
        if player_won {
            if let Some(cfg) = env
                .storage()
                .instance()
                .get::<_, SliceConfig>(&DataKey::SliceConfig)
            {
                if cfg.slice_per_win > 0 {
                    let rwd_key = DataKey::PendingReward(session_id);
                    env.storage().temporary().set(&rwd_key, &cfg.slice_per_win);
                    env.storage()
                        .temporary()
                        .extend_ttl(&rwd_key, GAME_TTL_THRESHOLD, GAME_TTL_LEDGERS);
                }
            }
        }

        Ok(player_won)
    }

    // -----------------------------------------------------------------------
    // Queries
    // -----------------------------------------------------------------------

    pub fn get_session(env: Env, session_id: u32) -> Result<Session, Error> {
        env.storage().temporary()
            .get(&DataKey::Session(session_id))
            .ok_or(Error::SessionNotFound)
    }

    pub fn get_active_session(env: Env, player: Address) -> Option<u32> {
        env.storage().temporary().get(&DataKey::ActiveSession(player))
    }

    pub fn get_admin(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Admin).expect("Admin not set")
    }

    // -----------------------------------------------------------------------
    // Admin
    // -----------------------------------------------------------------------

    pub fn set_admin(env: Env, new_admin: Address) -> Result<(), Error> {
        let admin: Address = env.storage().instance()
            .get(&DataKey::Admin).expect("Admin not set");
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &new_admin);
        Ok(())
    }

    pub fn get_hub(env: Env) -> Address {
        env.storage().instance().get(&DataKey::GameHubAddress).expect("GameHub not set")
    }

    pub fn set_hub(env: Env, new_hub: Address) -> Result<(), Error> {
        let admin: Address = env.storage().instance()
            .get(&DataKey::Admin).expect("Admin not set");
        admin.require_auth();
        env.storage().instance().set(&DataKey::GameHubAddress, &new_hub);
        Ok(())
    }

    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) -> Result<(), Error> {
        let admin: Address = env.storage().instance()
            .get(&DataKey::Admin).expect("Admin not set");
        admin.require_auth();
        env.deployer().update_current_contract_wasm(new_wasm_hash);
        Ok(())
    }

    // -----------------------------------------------------------------------
    // SLICE token integration
    // -----------------------------------------------------------------------

    /// Set the $SLICE token contract address.
    /// Only admin. Call this once after deploying slice-token to testnet/mainnet.
    pub fn set_slice_token(env: Env, slice_token: Address) -> Result<(), Error> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Admin not set");
        admin.require_auth();
        env.storage()
            .instance()
            .set(&DataKey::SliceToken, &slice_token);
        Ok(())
    }

    /// Configure how many whole SLICE a player earns per winning session.
    /// `slice_per_win = 0` effectively disables rewards without removing the token address.
    pub fn set_slice_config(env: Env, slice_per_win: i128) -> Result<(), Error> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Admin not set");
        admin.require_auth();
        assert!(slice_per_win >= 0, "SLICE: negative reward");
        let cfg = SliceConfig { slice_per_win };
        env.storage()
            .instance()
            .set(&DataKey::SliceConfig, &cfg);
        Ok(())
    }

    /// Set the RISC Zero verifier contract address and the game program's image ID.
    /// Only admin.
    pub fn set_verifier(env: Env, verifier: Address, image_id: BytesN<32>) -> Result<(), Error> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Admin not set");
        admin.require_auth();
        env.storage()
            .instance()
            .set(&DataKey::VerifierAddress, &verifier);
        env.storage()
            .instance()
            .set(&DataKey::Risc0ImageId, &image_id);
        Ok(())
    }

    pub fn get_verifier(env: Env) -> Option<Address> {
        env.storage().instance().get(&DataKey::VerifierAddress)
    }

    pub fn get_image_id(env: Env) -> Option<BytesN<32>> {
        env.storage().instance().get(&DataKey::Risc0ImageId)
    }

    /// Claim the SLICE reward for a winning session.
    ///
    /// The player calls this after `submit_score` returns `true`.
    /// On success mints `slice_per_win` whole SLICE to the player via the
    /// $SLICE contract and removes the pending reward (no double-claim).
    ///
    /// Returns the amount of whole SLICE minted.
    pub fn claim_slice(env: Env, session_id: u32, player: Address) -> Result<i128, Error> {
        player.require_auth();

        // Verify session ownership and outcome.
        let session: Session = env
            .storage()
            .temporary()
            .get(&DataKey::Session(session_id))
            .ok_or(Error::SessionNotFound)?;

        if session.player != player {
            return Err(Error::NotPlayer);
        }

        // Fetch and immediately remove the pending reward (atomic — no double-claim).
        let rwd_key = DataKey::PendingReward(session_id);
        let amount: i128 = env
            .storage()
            .temporary()
            .get(&rwd_key)
            .ok_or(Error::NoRewardPending)?;
        env.storage().temporary().remove(&rwd_key);

        // Resolve the SLICE token contract address.
        let slice_addr: Address = env
            .storage()
            .instance()
            .get(&DataKey::SliceToken)
            .ok_or(Error::SliceNotConfigured)?;

        // Cross-contract mint — guitar-pizza is the authorized minter in SliceToken.
        SliceTokenClient::new(&env, &slice_addr).mint(&player, &amount);

        env.events().publish(
            (Symbol::new(&env, "slice_claimed"), player.clone()),
            (session_id, amount),
        );

        Ok(amount)
    }

    // -----------------------------------------------------------------------
    // SLICE queries
    // -----------------------------------------------------------------------

    pub fn get_slice_token(env: Env) -> Option<Address> {
        env.storage().instance().get(&DataKey::SliceToken)
    }

    pub fn get_slice_config(env: Env) -> Option<SliceConfig> {
        env.storage().instance().get(&DataKey::SliceConfig)
    }

    /// How many whole SLICE are claimable for a session (0 if none / already claimed).
    pub fn get_pending_reward(env: Env, session_id: u32) -> i128 {
        env.storage()
            .temporary()
            .get(&DataKey::PendingReward(session_id))
            .unwrap_or(0)
    }

    // -----------------------------------------------------------------------
    // Internal helpers
    // -----------------------------------------------------------------------

    fn require_hub(env: &Env) -> Result<Address, Error> {
        env.storage().instance()
            .get(&DataKey::GameHubAddress)
            .ok_or(Error::HubNotConfigured)
    }

    /// RISC Zero receipt verifier -- PLACEHOLDER.
    /// 1. Checks receipt len >= RECEIPT_MIN_LEN (164).
    /// 2. Extracts journal = receipt[0..100].
    /// 3. Hashes journal with keccak256 as integrity check.
    ///
    /// TODO: Replace with cross-contract call to stellar-risc0-verifier:
    ///   https://github.com/NethermindEth/stellar-risc0-verifier/
    fn verify_risc0_receipt(env: &Env, receipt: &Bytes) -> Result<[u8; JOURNAL_LEN], Error> {
        if receipt.len() < RECEIPT_MIN_LEN { return Err(Error::ReceiptTooShort); }
        let mut journal = [0u8; JOURNAL_LEN];
        for i in 0..JOURNAL_LEN {
            journal[i] = receipt.get(i as u32).unwrap_or(0);
        }
        let jb = Bytes::from_slice(env, &journal);
        
        if env.storage().instance().has(&DataKey::VerifierAddress) {
            let verifier_address: Address = env.storage().instance().get(&DataKey::VerifierAddress).unwrap();
            let image_id: BytesN<32> = env.storage().instance().get(&DataKey::Risc0ImageId).unwrap();
            let seal = receipt.slice(100..);
            
            let verifier_client = VerifierClient::new(env, &verifier_address);
            verifier_client.verify(&jb, &image_id, &seal);
        } else {
            // Validate proof seal: first 32 bytes of seal (starting from index 100)
            // must match the keccak256 of the journal bytes.
            let expected_seal_hash: Bytes = env.crypto().keccak256(&jb).into();
            let seal_hash = receipt.slice(100..132);
            if seal_hash != expected_seal_hash {
                return Err(Error::InvalidReceipt);
            }
        }
        
        Ok(journal)
    }
}

// ---------------------------------------------------------------------------
// Free functions
// ---------------------------------------------------------------------------

#[inline]
fn read_u32_be(buf: &[u8; JOURNAL_LEN], offset: usize) -> u32 {
    u32::from_be_bytes([buf[offset], buf[offset+1], buf[offset+2], buf[offset+3]])
}

#[inline]
fn slice_bytes_32(buf: &[u8; JOURNAL_LEN], start: usize) -> [u8; 32] {
    let mut out = [0u8; 32];
    out.copy_from_slice(&buf[start..start + 32]);
    out
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    mod mock_hub_impl {
        use soroban_sdk::{contract, contractimpl, Address, Env};
        #[contract]
        pub struct MockHub;
        #[contractimpl]
        impl MockHub {
            pub fn start_game(_env: Env, _gid: Address, _sid: u32,
                _p1: Address, _p2: Address, _pp1: i128, _pp2: i128) {}
            pub fn end_game(_env: Env, _sid: u32, _won: bool) {}
        }
    }
    use mock_hub_impl::MockHub;

    fn deploy(env: &Env) -> (GuitarPizzaContractClient, Address) {
        let admin  = Address::generate(env);
        let hub_id = env.register(MockHub, ());
        let cid    = env.register(GuitarPizzaContract, (&admin, &hub_id));
        (GuitarPizzaContractClient::new(env, &cid), admin)
    }

    fn make_receipt(
        env: &Env, sid: u32, player: &Address, lvl: u32, score: u32,
        ph: u32, th: u32, ta: u32, tt: u32, fs: u32, pc: u32,
    ) -> Bytes {
        let mut j = [0u8; JOURNAL_LEN];
        j[0..4].copy_from_slice(&lvl.to_be_bytes());
        j[4..8].copy_from_slice(&score.to_be_bytes());
        j[40..44].copy_from_slice(&ph.to_be_bytes());
        j[44..48].copy_from_slice(&th.to_be_bytes());
        j[48..52].copy_from_slice(&ta.to_be_bytes());
        j[52..56].copy_from_slice(&tt.to_be_bytes());
        j[56..60].copy_from_slice(&fs.to_be_bytes());
        j[60..64].copy_from_slice(&pc.to_be_bytes());
        let hash: BytesN<32> = env.crypto().keccak256(&player.to_string().to_bytes()).into();
        j[64..96].copy_from_slice(&hash.to_array());
        j[96..100].copy_from_slice(&sid.to_be_bytes());
        let mut r = Bytes::from_slice(env, &j);
        
        // Generate valid cryptographic seal: keccak256 of the journal
        let seal_hash = env.crypto().keccak256(&r);
        r.append(&seal_hash.into());
        // Append another 32 bytes of zero to make the seal 64 bytes total
        r.append(&Bytes::from_slice(env, &[0u8; 32]));
        r
    }

    #[test]
    fn test_constructor() {
        let env = Env::default();
        let admin  = Address::generate(&env);
        let hub_id = env.register(MockHub, ());
        let cid    = env.register(GuitarPizzaContract, (&admin, &hub_id));
        let c      = GuitarPizzaContractClient::new(&env, &cid);
        assert_eq!(c.get_admin(), admin);
        assert_eq!(c.get_hub(), hub_id);
    }

    #[test]
    fn test_start_game() {
        let env = Env::default(); env.mock_all_auths();
        let (c, _) = deploy(&env);
        let p = Address::generate(&env);
        c.start_game(&1u32, &p, &1u32, &5000u32);
        let s = c.get_session(&1u32);
        assert_eq!(s.session_id, 1u32);
        assert_eq!(s.player, p);
        assert_eq!(s.score_goal, 5000u32);
        assert!(!s.is_ended);
    }

    #[test]
    fn test_active_sentinel() {
        let env = Env::default(); env.mock_all_auths();
        let (c, _) = deploy(&env);
        let p = Address::generate(&env);
        assert!(c.get_active_session(&p).is_none());
        c.start_game(&7u32, &p, &2u32, &3000u32);
        assert_eq!(c.get_active_session(&p), Some(7u32));
    }

    #[test]
    fn test_rate_limiting() {
        let env = Env::default(); env.mock_all_auths();
        let (c, _) = deploy(&env);
        let p = Address::generate(&env);
        c.start_game(&1u32, &p, &1u32, &5000u32);
        assert!(c.try_start_game(&2u32, &p, &1u32, &5000u32).is_err());
    }

    #[test]
    fn test_player_wins_above_goal() {
        let env = Env::default(); env.mock_all_auths();
        let (c, _) = deploy(&env);
        let p = Address::generate(&env);
        // goal = 5000, score = 9500 → player wins
        c.start_game(&42u32, &p, &3u32, &5000u32);
        let r = make_receipt(&env, 42, &p, 3, 9500, 80, 100, 15, 20, 30, 5);
        let player_won = c.submit_score(&42u32, &p, &r);
        assert!(player_won);
        let s = c.get_session(&42u32);
        assert!(s.is_ended);
        assert!(s.player_won);
        assert_eq!(s.score, 9500u32);
        assert_eq!(s.score_goal, 5000u32);
        assert!(c.get_active_session(&p).is_none());
    }

    #[test]
    fn test_house_wins_below_goal() {
        let env = Env::default(); env.mock_all_auths();
        let (c, _) = deploy(&env);
        let p = Address::generate(&env);
        // goal = 8000, score = 3000 → La Casa wins
        c.start_game(&10u32, &p, &1u32, &8000u32);
        let r = make_receipt(&env, 10, &p, 1, 3000, 10, 50, 0, 10, 0, 0);
        let player_won = c.submit_score(&10u32, &p, &r);
        assert!(!player_won);
        let s = c.get_session(&10u32);
        assert!(s.is_ended);
        assert!(!s.player_won);
    }

    #[test]
    fn test_default_goal_on_zero() {
        let env = Env::default(); env.mock_all_auths();
        let (c, _) = deploy(&env);
        let p = Address::generate(&env);
        // passing 0 → uses DEFAULT_SCORE_GOAL (5000)
        c.start_game(&5u32, &p, &1u32, &0u32);
        let s = c.get_session(&5u32);
        assert_eq!(s.score_goal, DEFAULT_SCORE_GOAL);
    }

    #[test]
    fn test_double_submit_fails() {
        let env = Env::default(); env.mock_all_auths();
        let (c, _) = deploy(&env);
        let p = Address::generate(&env);
        c.start_game(&1u32, &p, &1u32, &5000u32);
        let r1 = make_receipt(&env, 1, &p, 1, 6000, 5, 10, 3, 5, 10, 1);
        c.submit_score(&1u32, &p, &r1);
        let r2 = make_receipt(&env, 1, &p, 1, 6001, 6, 11, 4, 6, 11, 2);
        let res = c.try_submit_score(&1u32, &p, &r2);
        assert!(res.is_err());
        assert_eq!(res.err().unwrap(), Ok(Error::SessionAlreadyEnded));
    }

    #[test]
    fn test_anti_replay() {
        let env = Env::default(); env.mock_all_auths();
        let (c, _) = deploy(&env);
        let p = Address::generate(&env);
        c.start_game(&1u32, &p, &1u32, &5000u32);
        let r = make_receipt(&env, 1, &p, 1, 7000, 5, 10, 3, 5, 10, 2);
        c.submit_score(&1u32, &p, &r);
        c.start_game(&2u32, &p, &1u32, &5000u32);
        // same receipt bytes → replay rejected
        let res = c.try_submit_score(&2u32, &p, &r);
        assert!(res.is_err());
        assert_eq!(res.err().unwrap(), Ok(Error::ProofAlreadyUsed));
    }

    #[test]
    fn test_receipt_too_short() {
        let env = Env::default(); env.mock_all_auths();
        let (c, _) = deploy(&env);
        let p = Address::generate(&env);
        c.start_game(&1u32, &p, &1u32, &5000u32);
        let short = Bytes::from_slice(&env, &[0u8; 63]);
        let res = c.try_submit_score(&1u32, &p, &short);
        assert!(res.is_err());
        assert_eq!(res.err().unwrap(), Ok(Error::ReceiptTooShort));
    }

    #[test]
    fn test_session_id_mismatch() {
        let env = Env::default(); env.mock_all_auths();
        let (c, _) = deploy(&env);
        let p = Address::generate(&env);
        c.start_game(&1u32, &p, &1u32, &5000u32);
        let bad = make_receipt(&env, 99, &p, 1, 7000, 5, 10, 3, 5, 10, 1);
        let res = c.try_submit_score(&1u32, &p, &bad);
        assert!(res.is_err());
        assert_eq!(res.err().unwrap(), Ok(Error::SessionIdMismatch));
    }

    #[test]
    fn test_player_mismatch() {
        let env = Env::default(); env.mock_all_auths();
        let (c, _) = deploy(&env);
        let p   = Address::generate(&env);
        let atk = Address::generate(&env);
        c.start_game(&1u32, &p, &1u32, &5000u32);
        let bad = make_receipt(&env, 1, &atk, 1, 9999, 99, 100, 0, 0, 0, 99);
        let res = c.try_submit_score(&1u32, &p, &bad);
        assert!(res.is_err());
        assert_eq!(res.err().unwrap(), Ok(Error::PlayerMismatch));
    }

    #[test]
    fn test_new_session_after_close() {
        let env = Env::default(); env.mock_all_auths();
        let (c, _) = deploy(&env);
        let p = Address::generate(&env);
        c.start_game(&1u32, &p, &1u32, &5000u32);
        let r = make_receipt(&env, 1, &p, 1, 6000, 5, 10, 3, 5, 10, 2);
        c.submit_score(&1u32, &p, &r);
        c.start_game(&2u32, &p, &1u32, &5000u32);
        assert_eq!(c.get_active_session(&p), Some(2u32));
    }

    #[test]
    fn test_set_admin() {
        let env = Env::default(); env.mock_all_auths();
        let (c, _) = deploy(&env);
        let na = Address::generate(&env);
        c.set_admin(&na);
        assert_eq!(c.get_admin(), na);
    }

    mod mock_verifier_impl {
        use soroban_sdk::{contract, contractimpl, Bytes, BytesN, Env};
        #[contract]
        pub struct MockVerifier;
        #[contractimpl]
        impl MockVerifier {
            pub fn verify(
                env: Env,
                journal: Bytes,
                _image_id: BytesN<32>,
                seal: Bytes,
            ) {
                let expected_hash: Bytes = env.crypto().keccak256(&journal).into();
                let seal_hash = seal.slice(0..32);
                if seal_hash != expected_hash {
                    panic!("invalid proof");
                }
            }
        }
    }
    use mock_verifier_impl::MockVerifier;

    #[test]
    fn test_verifier_integration() {
        let env = Env::default(); env.mock_all_auths();
        let (c, _) = deploy(&env);
        let p = Address::generate(&env);
        
        let verifier_id = env.register(MockVerifier, ());
        let image_id = BytesN::from_array(&env, &[1u8; 32]);
        
        c.set_verifier(&verifier_id, &image_id);
        
        assert_eq!(c.get_verifier(), Some(verifier_id.clone()));
        assert_eq!(c.get_image_id(), Some(image_id.clone()));
        
        c.start_game(&1u32, &p, &1u32, &5000u32);
        
        // Make receipt with valid seal
        let r = make_receipt(&env, 1, &p, 1, 6000, 5, 10, 3, 5, 10, 2);
        
        // This should pass because the mock verifier will check the seal
        let player_won = c.submit_score(&1u32, &p, &r);
        assert!(player_won);
        
        // Test with invalid seal (which mock verifier will reject)
        c.start_game(&2u32, &p, &1u32, &5000u32);
        let mut bad = make_receipt(&env, 2, &p, 1, 6000, 5, 10, 3, 5, 10, 2);
        // corrupt the seal bytes
        bad.set(100, 0);
        
        let res = c.try_submit_score(&2u32, &p, &bad);
        assert!(res.is_err());
    }
}
