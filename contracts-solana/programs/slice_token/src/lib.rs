use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount, Burn};

declare_id!("SLicE11111111111111111111111111111111111111");

#[program]
pub mod slice_token {
    use super::*;

    /// Initialize the global state and mint authority PDA
    pub fn initialize(ctx: Context<Initialize>, decimals: u8) -> Result<()> {
        let state = &mut ctx.accounts.token_state;
        state.authority = ctx.accounts.authority.key();
        state.mint = ctx.accounts.mint.key();
        state.decimals = decimals;
        state.total_minted = 0;
        state.bump = ctx.bumps.mint_authority;
        msg!("SliceTokenProgram: Initialized successfully with decimals {}", decimals);
        Ok(())
    }

    /// Reward a player with $SLICE tokens after finishing a rhythm pizza session
    pub fn reward_player(ctx: Context<RewardPlayer>, amount: u64, song_id: u32, accuracy_bps: u16) -> Result<()> {
        require!(accuracy_bps <= 10000, SliceError::InvalidAccuracy);
        require!(amount > 0, SliceError::ZeroAmount);

        let seeds = &[
            b"mint_authority".as_ref(),
            &[ctx.accounts.token_state.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.player_token_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::mint_to(cpi_ctx, amount)?;

        let state = &mut ctx.accounts.token_state;
        state.total_minted = state.total_minted.checked_add(amount).unwrap();

        emit!(PlayerRewardedEvent {
            player: ctx.accounts.player.key(),
            amount,
            song_id,
            accuracy_bps,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("SliceTokenProgram: Player {} rewarded with {} SLICE for song {}", ctx.accounts.player.key(), amount, song_id);
        Ok(())
    }

    /// Burn $SLICE when crafting special toppings, wood or upgrading ovens
    pub fn burn_for_crafting(ctx: Context<BurnForCrafting>, amount: u64, recipe_id: u32) -> Result<()> {
        require!(amount > 0, SliceError::ZeroAmount);

        let cpi_accounts = Burn {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.player_token_account.to_account_info(),
            authority: ctx.accounts.player.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::burn(cpi_ctx, amount)?;

        emit!(SliceBurnedEvent {
            player: ctx.accounts.player.key(),
            amount,
            recipe_id,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("SliceTokenProgram: Player {} burned {} SLICE for recipe {}", ctx.accounts.player.key(), amount, recipe_id);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(decimals: u8)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + TokenState::INIT_SPACE,
        seeds = [b"token_state"],
        bump
    )]
    pub token_state: Account<'info, TokenState>,

    #[account(
        seeds = [b"mint_authority"],
        bump
    )]
    /// CHECK: PDA signer for mint authority
    pub mint_authority: UncheckedAccount<'info>,

    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RewardPlayer<'info> {
    #[account(
        mut,
        seeds = [b"token_state"],
        bump = token_state.bump
    )]
    pub token_state: Account<'info, TokenState>,

    #[account(
        seeds = [b"mint_authority"],
        bump = token_state.bump
    )]
    /// CHECK: PDA signer for minting rewards
    pub mint_authority: UncheckedAccount<'info>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = player_token_account.owner == player.key()
    )]
    pub player_token_account: Account<'info, TokenAccount>,

    pub player: Signer<'info>,
    pub authority: Signer<'info>, // Server authority signature
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct BurnForCrafting<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = player_token_account.owner == player.key()
    )]
    pub player_token_account: Account<'info, TokenAccount>,

    pub player: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct TokenState {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub decimals: u8,
    pub total_minted: u64,
    pub bump: u8,
}

#[event]
pub struct PlayerRewardedEvent {
    pub player: Pubkey,
    pub amount: u64,
    pub song_id: u32,
    pub accuracy_bps: u16,
    pub timestamp: i64,
}

#[event]
pub struct SliceBurnedEvent {
    pub player: Pubkey,
    pub amount: u64,
    pub recipe_id: u32,
    pub timestamp: i64,
}

#[error_code]
pub enum SliceError {
    #[msg("Accuracy must be between 0 and 10000 basis points.")]
    InvalidAccuracy,
    #[msg("Amount must be greater than zero.")]
    ZeroAmount,
}
