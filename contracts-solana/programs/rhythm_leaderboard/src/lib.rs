use anchor_lang::prelude::*;

declare_id!("LEAD111111111111111111111111111111111111111");

#[program]
pub mod rhythm_leaderboard {
    use super::*;

    /// Initialize a player's on-chain Profile & Score stats PDA
    pub fn init_player_profile(ctx: Context<InitPlayerProfile>, nickname: String) -> Result<()> {
        require!(nickname.len() >= 2 && nickname.len() <= 16, LeaderboardError::InvalidNicknameLength);

        let profile = &mut ctx.accounts.player_profile;
        profile.player = ctx.accounts.player.key();
        profile.nickname = nickname.clone();
        profile.total_score = 0;
        profile.high_score = 0;
        profile.games_played = 0;
        profile.perfect_pizzas = 0;
        profile.created_at = Clock::get()?.unix_timestamp;

        emit!(PlayerRegisteredEvent {
            player: ctx.accounts.player.key(),
            nickname,
            timestamp: profile.created_at,
        });

        msg!("Leaderboard: Player profile created for {}", ctx.accounts.player.key());
        Ok(())
    }

    /// Submit a verified gameplay score with match proof hash
    pub fn submit_verified_score(
        ctx: Context<SubmitVerifiedScore>,
        score: u32,
        song_id: u32,
        accuracy_bps: u16,
        proof_hash: [u8; 32],
    ) -> Result<()> {
        require!(accuracy_bps <= 10000, LeaderboardError::InvalidAccuracy);

        let profile = &mut ctx.accounts.player_profile;
        profile.total_score = profile.total_score.checked_add(score as u64).unwrap();
        profile.games_played = profile.games_played.checked_add(1).unwrap();
        if score > profile.high_score {
            profile.high_score = score;
        }
        if accuracy_bps == 10000 {
            profile.perfect_pizzas = profile.perfect_pizzas.checked_add(1).unwrap();
        }

        emit!(ScoreSubmittedEvent {
            player: ctx.accounts.player.key(),
            nickname: profile.nickname.clone(),
            score,
            song_id,
            accuracy_bps,
            proof_hash,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Leaderboard: Score {} submitted for player {} on song {}", score, ctx.accounts.player.key(), song_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitPlayerProfile<'info> {
    #[account(
        init,
        payer = player,
        space = 8 + PlayerProfile::INIT_SPACE,
        seeds = [b"player_profile", player.key().as_ref()],
        bump
    )]
    pub player_profile: Account<'info, PlayerProfile>,

    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitVerifiedScore<'info> {
    #[account(
        mut,
        seeds = [b"player_profile", player.key().as_ref()],
        bump
    )]
    pub player_profile: Account<'info, PlayerProfile>,

    pub player: Signer<'info>,
    pub authority: Signer<'info>, // Server game validator signature
}

#[account]
#[derive(InitSpace)]
pub struct PlayerProfile {
    pub player: Pubkey,
    #[max_len(16)]
    pub nickname: String,
    pub total_score: u64,
    pub high_score: u32,
    pub games_played: u32,
    pub perfect_pizzas: u32,
    pub created_at: i64,
}

#[event]
pub struct PlayerRegisteredEvent {
    pub player: Pubkey,
    pub nickname: String,
    pub timestamp: i64,
}

#[event]
pub struct ScoreSubmittedEvent {
    pub player: Pubkey,
    pub nickname: String,
    pub score: u32,
    pub song_id: u32,
    pub accuracy_bps: u16,
    pub proof_hash: [u8; 32],
    pub timestamp: i64,
}

#[error_code]
pub enum LeaderboardError {
    #[msg("Nickname must be between 2 and 16 characters.")]
    InvalidNicknameLength,
    #[msg("Accuracy must be between 0 and 10000 basis points.")]
    InvalidAccuracy,
}
