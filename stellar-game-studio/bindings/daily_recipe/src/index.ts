// @ts-nocheck
import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBWPTLNG5BZQUWQYRBTRGUARM7XUEUASASWMGLPIRKSNNVO7R4K3HOVN",
  }
} as const

export const Errors = {
  1: {message:"NotInitialized"},
  2: {message:"AlreadyCompleted"},
  3: {message:"InvalidReceipt"},
  4: {message:"NotEnoughPizzas"},
  5: {message:"AdminRequired"}
}

export type DataKey = {tag: "Admin", values: void} | {tag: "TrustedGame", values: void} | {tag: "Challenge", values: readonly [u64]} | {tag: "Progress", values: readonly [string, u64]};


export interface PlayerProgress {
  best_pizzas: u32;
  claimed_at: u64;
  completed: boolean;
  week_id: u64;
}


export interface WeeklyChallenge {
  target_pizzas: u32;
  total_completions: u32;
  week_id: u64;
}

export interface Client {
  /**
   * Construct and simulate a claim_weekly transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Submit a session result to claim the weekly pizza challenge.
   * 
   * # Arguments
   * * `player`           - The player claiming the achievement
   * * `pizzas_completed` - Number of pizzas completed in the session (from receipt journal)
   * * `receipt`          - RISC Zero receipt bytes proving the session result
   */
  claim_weekly: ({player, pizzas_completed, receipt}: {player: string, pizzas_completed: u32, receipt: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Result<WeeklyChallenge>>>

  /**
   * Construct and simulate a current_week_id transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the current week ID.
   */
  current_week_id: (options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a set_trusted_game transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_trusted_game: ({new_game}: {new_game: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_admin: ({new_admin}: {new_admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_current_challenge transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get current week's challenge (target + completions so far).
   */
  get_current_challenge: (options?: MethodOptions) => Promise<AssembledTransaction<WeeklyChallenge>>

  /**
   * Construct and simulate a get_player_progress_week transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get a player's progress for a specific week.
   */
  get_player_progress_week: ({player, week_id}: {player: string, week_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Option<PlayerProgress>>>

  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admin: (options?: MethodOptions) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a get_player_progress transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get a player's progress for the current week.
   */
  get_player_progress: ({player}: {player: string}, options?: MethodOptions) => Promise<AssembledTransaction<Option<PlayerProgress>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {admin, game_hub}: {admin: string, game_hub: string},
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({admin, game_hub}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABQAAAAAAAAAOTm90SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAAEEFscmVhZHlDb21wbGV0ZWQAAAACAAAAAAAAAA5JbnZhbGlkUmVjZWlwdAAAAAAAAwAAAAAAAAAPTm90RW5vdWdoUGl6emFzAAAAAAQAAAAAAAAADUFkbWluUmVxdWlyZWQAAAAAAAAF",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAALVHJ1c3RlZEdhbWUAAAAAAQAAACVDaGFsbGVuZ2UgbWV0YWRhdGEgc3RvcmVkIHBlciB3ZWVrX2lkAAAAAAAACUNoYWxsZW5nZQAAAAAAAAEAAAAGAAAAAQAAACxQbGF5ZXIgcHJvZ3Jlc3Mgc3RvcmVkIHBlciAocGxheWVyLCB3ZWVrX2lkKQAAAAhQcm9ncmVzcwAAAAIAAAATAAAABg==",
        "AAAAAQAAAAAAAAAAAAAADlBsYXllclByb2dyZXNzAAAAAAAEAAAAAAAAAAtiZXN0X3BpenphcwAAAAAEAAAAAAAAAApjbGFpbWVkX2F0AAAAAAAGAAAAAAAAAAljb21wbGV0ZWQAAAAAAAABAAAAAAAAAAd3ZWVrX2lkAAAAAAY=",
        "AAAAAQAAAAAAAAAAAAAAD1dlZWtseUNoYWxsZW5nZQAAAAADAAAAAAAAAA10YXJnZXRfcGl6emFzAAAAAAAABAAAAAAAAAARdG90YWxfY29tcGxldGlvbnMAAAAAAAAEAAAAAAAAAAd3ZWVrX2lkAAAAAAY=",
        "AAAAAAAAASZTdWJtaXQgYSBzZXNzaW9uIHJlc3VsdCB0byBjbGFpbSB0aGUgd2Vla2x5IHBpenphIGNoYWxsZW5nZS4KCiMgQXJndW1lbnRzCiogYHBsYXllcmAgICAgICAgICAgIC0gVGhlIHBsYXllciBjbGFpbWluZyB0aGUgYWNoaWV2ZW1lbnQKKiBgcGl6emFzX2NvbXBsZXRlZGAgLSBOdW1iZXIgb2YgcGl6emFzIGNvbXBsZXRlZCBpbiB0aGUgc2Vzc2lvbiAoZnJvbSByZWNlaXB0IGpvdXJuYWwpCiogYHJlY2VpcHRgICAgICAgICAgIC0gUklTQyBaZXJvIHJlY2VpcHQgYnl0ZXMgcHJvdmluZyB0aGUgc2Vzc2lvbiByZXN1bHQAAAAAAAxjbGFpbV93ZWVrbHkAAAADAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAAAAAAAEHBpenphc19jb21wbGV0ZWQAAAAEAAAAAAAAAAdyZWNlaXB0AAAAAA4AAAABAAAD6QAAB9AAAAAPV2Vla2x5Q2hhbGxlbmdlAAAAAAM=",
        "AAAAAAAAABhHZXQgdGhlIGN1cnJlbnQgd2VlayBJRC4AAAAPY3VycmVudF93ZWVrX2lkAAAAAAAAAAABAAAABg==",
        "AAAAAAAAAAAAAAAQc2V0X3RydXN0ZWRfZ2FtZQAAAAEAAAAAAAAACG5ld19nYW1lAAAAEwAAAAEAAAPpAAAAAgAAAAM=",
        "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAEAAAPpAAAAAgAAAAM=",
        "AAAAAAAAADtHZXQgY3VycmVudCB3ZWVrJ3MgY2hhbGxlbmdlICh0YXJnZXQgKyBjb21wbGV0aW9ucyBzbyBmYXIpLgAAAAAVZ2V0X2N1cnJlbnRfY2hhbGxlbmdlAAAAAAAAAAAAAAEAAAfQAAAAD1dlZWtseUNoYWxsZW5nZQA=",
        "AAAAAAAAACxHZXQgYSBwbGF5ZXIncyBwcm9ncmVzcyBmb3IgYSBzcGVjaWZpYyB3ZWVrLgAAABhnZXRfcGxheWVyX3Byb2dyZXNzX3dlZWsAAAACAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAAAAAAAB3dlZWtfaWQAAAAABgAAAAEAAAPoAAAH0AAAAA5QbGF5ZXJQcm9ncmVzcwAA",
        "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAPoAAAAEw==",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAIZ2FtZV9odWIAAAATAAAAAA==",
        "AAAAAAAAAC1HZXQgYSBwbGF5ZXIncyBwcm9ncmVzcyBmb3IgdGhlIGN1cnJlbnQgd2Vlay4AAAAAAAATZ2V0X3BsYXllcl9wcm9ncmVzcwAAAAABAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAABAAAD6AAAB9AAAAAOUGxheWVyUHJvZ3Jlc3MAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    claim_weekly: this.txFromJSON<Result<WeeklyChallenge>>,
        current_week_id: this.txFromJSON<u64>,
        set_trusted_game: this.txFromJSON<Result<void>>,
        set_admin: this.txFromJSON<Result<void>>,
        get_current_challenge: this.txFromJSON<WeeklyChallenge>,
        get_player_progress_week: this.txFromJSON<Option<PlayerProgress>>,
        get_admin: this.txFromJSON<Option<string>>,
        get_player_progress: this.txFromJSON<Option<PlayerProgress>>
  }
}