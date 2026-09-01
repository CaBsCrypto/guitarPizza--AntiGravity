use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("PvPEscrow11111111111111111111111111111111111");

#[program]
pub mod pvp_escrow {
    use super::*;

    /// Create a new 1v1 PvP Match with wager deposit from Player 1 (Host)
    pub fn create_match(ctx: Context<CreateMatch>, match_id: u64, wager_amount: u64, song_id: u32) -> Result<()> {
        require!(wager_amount > 0, EscrowError::ZeroWager);

        let match_account = &mut ctx.accounts.match_account;
        match_account.match_id = match_id;
        match_account.player1 = ctx.accounts.player1.key();
        match_account.player2 = Pubkey::default();
        match_account.wager_amount = wager_amount;
        match_account.song_id = song_id;
        match_account.status = MatchStatus::WaitingForOpponent;
        match_account.bump = ctx.bumps.vault;

        // Transfer wager from Player 1 to Escrow Vault PDA
        let cpi_accounts = Transfer {
            from: ctx.accounts.player1_token_account.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
            authority: ctx.accounts.player1.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        token::transfer(CpiContext::new(cpi_program, cpi_accounts), wager_amount)?;

        emit!(MatchCreatedEvent {
            match_id,
            player1: ctx.accounts.player1.key(),
            wager_amount,
            song_id,
        });

        msg!("PvPEscrow: Match {} created by player 1 with wager {}", match_id, wager_amount);
        Ok(())
    }

    /// Join an existing match by depositing the matching wager (Player 2)
    pub fn join_match(ctx: Context<JoinMatch>) -> Result<()> {
        let match_account = &mut ctx.accounts.match_account;
        require!(match_account.status == MatchStatus::WaitingForOpponent, EscrowError::MatchNotOpen);

        match_account.player2 = ctx.accounts.player2.key();
        match_account.status = MatchStatus::InProgress;

        // Transfer wager from Player 2 to Escrow Vault PDA
        let cpi_accounts = Transfer {
            from: ctx.accounts.player2_token_account.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
            authority: ctx.accounts.player2.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        token::transfer(CpiContext::new(cpi_program, cpi_accounts), match_account.wager_amount)?;

        emit!(MatchJoinedEvent {
            match_id: match_account.match_id,
            player2: ctx.accounts.player2.key(),
        });

        msg!("PvPEscrow: Player 2 {} joined match {}", ctx.accounts.player2.key(), match_account.match_id);
        Ok(())
    }

    /// Resolve match and payout the total pot (2x wager) to the winner
    pub fn resolve_match(ctx: Context<ResolveMatch>, winner: Pubkey, score_p1: u32, score_p2: u32) -> Result<()> {
        let match_account = &mut ctx.accounts.match_account;
        require!(match_account.status == MatchStatus::InProgress, EscrowError::MatchNotInProgress);
        require!(winner == match_account.player1 || winner == match_account.player2, EscrowError::InvalidWinner);

        let total_pot = match_account.wager_amount.checked_mul(2).unwrap();
        match_account.status = MatchStatus::Completed;

        let match_id_bytes = match_account.match_id.to_le_bytes();
        let seeds = &[
            b"vault".as_ref(),
            match_id_bytes.as_ref(),
            &[match_account.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.winner_token_account.to_account_info(),
            authority: ctx.accounts.vault.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        token::transfer(CpiContext::new_with_signer(cpi_program, cpi_accounts, signer), total_pot)?;

        emit!(MatchResolvedEvent {
            match_id: match_account.match_id,
            winner,
            total_pot,
            score_p1,
            score_p2,
        });

        msg!("PvPEscrow: Match {} won by {} with pot {}", match_account.match_id, winner, total_pot);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(match_id: u64)]
pub struct CreateMatch<'info> {
    #[account(
        init,
        payer = player1,
        space = 8 + MatchAccount::INIT_SPACE,
        seeds = [b"match", match_id.to_le_bytes().as_ref()],
        bump
    )]
    pub match_account: Account<'info, MatchAccount>,

    #[account(
        init,
        payer = player1,
        token::mint = mint,
        token::authority = vault,
        seeds = [b"vault", match_id.to_le_bytes().as_ref()],
        bump
    )]
    pub vault: Account<'info, TokenAccount>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = player1_token_account.owner == player1.key()
    )]
    pub player1_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub player1: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct JoinMatch<'info> {
    #[account(
        mut,
        seeds = [b"match", match_account.match_id.to_le_bytes().as_ref()],
        bump
    )]
    pub match_account: Account<'info, MatchAccount>,

    #[account(
        mut,
        seeds = [b"vault", match_account.match_id.to_le_bytes().as_ref()],
        bump = match_account.bump
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = player2_token_account.owner == player2.key()
    )]
    pub player2_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub player2: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ResolveMatch<'info> {
    #[account(
        mut,
        seeds = [b"match", match_account.match_id.to_le_bytes().as_ref()],
        bump
    )]
    pub match_account: Account<'info, MatchAccount>,

    #[account(
        mut,
        seeds = [b"vault", match_account.match_id.to_le_bytes().as_ref()],
        bump = match_account.bump
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub winner_token_account: Account<'info, TokenAccount>,

    pub referee_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct MatchAccount {
    pub match_id: u64,
    pub player1: Pubkey,
    pub player2: Pubkey,
    pub wager_amount: u64,
    pub song_id: u32,
    pub status: MatchStatus,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum MatchStatus {
    WaitingForOpponent,
    InProgress,
    Completed,
    Cancelled,
}

#[event]
pub struct MatchCreatedEvent {
    pub match_id: u64,
    pub player1: Pubkey,
    pub wager_amount: u64,
    pub song_id: u32,
}

#[event]
pub struct MatchJoinedEvent {
    pub match_id: u64,
    pub player2: Pubkey,
}

#[event]
pub struct MatchResolvedEvent {
    pub match_id: u64,
    pub winner: Pubkey,
    pub total_pot: u64,
    pub score_p1: u32,
    pub score_p2: u32,
}

#[error_code]
pub enum EscrowError {
    #[msg("Wager amount must be greater than zero.")]
    ZeroWager,
    #[msg("Match is not open for joining.")]
    MatchNotOpen,
    #[msg("Match is not currently in progress.")]
    MatchNotInProgress,
    #[msg("Specified winner is not a participant in this match.")]
    InvalidWinner,
}
