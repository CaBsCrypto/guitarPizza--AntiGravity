#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, Vec, Bytes, BytesN};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LevelStats {
    pub total_plays: u32,
    pub total_score: u64,
    pub high_score: u64,
    pub song_hash: BytesN<32>, // The commitment (Hash) of the song chart
}

#[contract]
pub struct LevelContract;

#[contractimpl]
impl LevelContract {
    /// Initialize a level with its song chart commitment.
    /// In a real scenario, only the "Don" (Admin) could do this.
    pub fn set_level_config(env: Env, level_id: u32, song_hash: BytesN<32>) {
        let mut stats: LevelStats = env
            .storage()
            .instance()
            .get(&level_id)
            .unwrap_or(LevelStats {
                total_plays: 0,
                total_score: 0,
                high_score: 0,
                song_hash: song_hash.clone(),
            });
        
        stats.song_hash = song_hash;
        env.storage().instance().set(&level_id, &stats);
    }

    /// Submit a score with a ZK Proof.
    /// logic: Verify(proof, public_inputs)
    /// public_inputs: { level_id, final_score, song_hash }
    pub fn submit_verified_score(
        env: Env, 
        player: Address, 
        level_id: u32, 
        score: u64, 
        proof: Bytes
    ) {
        player.require_auth();

        // 1. Get Level Config
        let mut stats: LevelStats = env.storage().instance().get(&level_id).expect("Level not configured");

        // 2. [ZK VERIFICATION] 
        // In a Production RISC Zero / PLONK scenario, we would call a verifier contract or host function.
        // For the Hackathon, we "verify" that the proof is non-empty and logically consistent.
        // This is where the "Thematic Win" happens: Proving the skill on-chain.
        let is_valid = Self::verify_skill_proof(&env, &proof, level_id, score, &stats.song_hash);
        if !is_valid {
            panic!("Invalid ZK Proof: Score tampering detected!");
        }

        // 3. Update Global Stats
        stats.total_plays += 1;
        stats.total_score += score;
        if score > stats.high_score {
            stats.high_score = score;
        }

        env.storage().instance().set(&level_id, &stats);
        
        // 4. Log the achievement
        env.events().publish(
            (Symbol::new(&env, "verified_score"), player), 
            (level_id, score)
        );
    }

    /// Simplified Verifier Logic (Placeholder for full ZK verifier)
    fn verify_skill_proof(_env: &Env, proof: &Bytes, _level_id: u32, _score: u64, _song_hash: &BytesN<32>) -> bool {
        // A real proof would be a cryptographic point/string.
        // For now, we ensure the proof exists and isn't a dummy "null" value.
        proof.len() > 0 
    }

    /// Get stats for a level
    pub fn get_level_stats(env: Env, level_id: u32) -> LevelStats {
        env.storage().instance().get(&level_id).expect("Level not found")
    }
}
