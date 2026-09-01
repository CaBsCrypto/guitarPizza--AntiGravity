use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

declare_id!("OVEN111111111111111111111111111111111111111");

#[program]
pub mod pizza_nft {
    use super::*;

    /// Initialize collection config
    pub fn initialize(ctx: Context<InitializeCollection>, collection_name: String, symbol: String) -> Result<()> {
        let config = &mut ctx.accounts.collection_config;
        config.authority = ctx.accounts.authority.key();
        config.collection_name = collection_name;
        config.symbol = symbol;
        config.total_minted = 0;
        msg!("PizzaNftProgram: Collection initialized successfully");
        Ok(())
    }

    /// Mint an Oven NFT with on-chain multiplier attributes (e.g. 1.25x = 12500 bps)
    pub fn mint_oven(
        ctx: Context<MintOven>,
        style_id: u8,
        multiplier_bps: u16,
        name: String,
        uri: String,
    ) -> Result<()> {
        require!(multiplier_bps >= 10000 && multiplier_bps <= 30000, NftError::InvalidMultiplier);

        let oven_account = &mut ctx.accounts.oven_account;
        oven_account.owner = ctx.accounts.player.key();
        oven_account.mint = ctx.accounts.mint.key();
        oven_account.style_id = style_id;
        oven_account.multiplier_bps = multiplier_bps;
        oven_account.name = name.clone();
        oven_account.uri = uri;
        oven_account.level = 1;
        oven_account.is_equipped = false;

        let config = &mut ctx.accounts.collection_config;
        config.total_minted = config.total_minted.checked_add(1).unwrap();

        emit!(OvenMintedEvent {
            owner: ctx.accounts.player.key(),
            mint: ctx.accounts.mint.key(),
            style_id,
            multiplier_bps,
            name,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("PizzaNftProgram: Oven NFT minted for player {} with {} bps", ctx.accounts.player.key(), multiplier_bps);
        Ok(())
    }

    /// Equip an Oven to activate its rhythm score multiplier in gameplay
    pub fn equip_oven(ctx: Context<EquipOven>, is_equipped: bool) -> Result<()> {
        let oven = &mut ctx.accounts.oven_account;
        require!(oven.owner == ctx.accounts.player.key(), NftError::NotOwner);
        oven.is_equipped = is_equipped;

        emit!(OvenEquippedEvent {
            player: ctx.accounts.player.key(),
            mint: oven.mint,
            is_equipped,
            multiplier_bps: oven.multiplier_bps,
        });

        msg!("PizzaNftProgram: Oven {} equipped status set to {}", oven.mint, is_equipped);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCollection<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + CollectionConfig::INIT_SPACE,
        seeds = [b"collection_config"],
        bump
    )]
    pub collection_config: Account<'info, CollectionConfig>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintOven<'info> {
    #[account(
        mut,
        seeds = [b"collection_config"],
        bump
    )]
    pub collection_config: Account<'info, CollectionConfig>,

    #[account(
        init,
        payer = player,
        space = 8 + OvenAccount::INIT_SPACE,
        seeds = [b"oven", mint.key().as_ref()],
        bump
    )]
    pub oven_account: Account<'info, OvenAccount>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = player_token_account.owner == player.key()
    )]
    pub player_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct EquipOven<'info> {
    #[account(
        mut,
        seeds = [b"oven", oven_account.mint.as_ref()],
        bump
    )]
    pub oven_account: Account<'info, OvenAccount>,

    pub player: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct CollectionConfig {
    pub authority: Pubkey,
    #[max_len(32)]
    pub collection_name: String,
    #[max_len(10)]
    pub symbol: String,
    pub total_minted: u64,
}

#[account]
#[derive(InitSpace)]
pub struct OvenAccount {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub style_id: u8,
    pub multiplier_bps: u16,
    #[max_len(32)]
    pub name: String,
    #[max_len(128)]
    pub uri: String,
    pub level: u8,
    pub is_equipped: bool,
}

#[event]
pub struct OvenMintedEvent {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub style_id: u8,
    pub multiplier_bps: u16,
    pub name: String,
    pub timestamp: i64,
}

#[event]
pub struct OvenEquippedEvent {
    pub player: Pubkey,
    pub mint: Pubkey,
    pub is_equipped: bool,
    pub multiplier_bps: u16,
}

#[error_code]
pub enum NftError {
    #[msg("Multiplier must be between 10000 (1x) and 30000 (3x).")]
    InvalidMultiplier,
    #[msg("You are not the owner of this NFT.")]
    NotOwner,
}
