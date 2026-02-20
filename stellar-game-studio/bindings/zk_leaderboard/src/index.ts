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
    contractId: "CAFKIEE76S5LHA2QJ3PYU7WW2VSCYCW2FDLCC2RTQLBTZRYTL5UL5PYV",
  }
} as const

export const Errors = {
  1: {message:"NotInitialized"},
  2: {message:"Unauthorized"},
  3: {message:"InvalidReceipt"},
  4: {message:"AdminRequired"}
}

export type DataKey = {tag: "Admin", values: void} | {tag: "TrustedGame", values: void} | {tag: "Board", values: readonly [u32]} | {tag: "PersonalBest", values: readonly [string, u32]} | {tag: "Epoch", values: readonly [u32]};


export interface LeaderboardEntry {
  perfect_hits: u32;
  pizzas_completed: u32;
  player: string;
  score: u64;
  timestamp: u64;
}

export interface Client {
  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admin: (options?: MethodOptions) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a get_epoch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_epoch: ({level_id}: {level_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_leaderboard transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get top-10 leaderboard for a level.
   */
  get_leaderboard: ({level_id}: {level_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Array<LeaderboardEntry>>>

  /**
   * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update admin address.
   */
  set_admin: ({new_admin}: {new_admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a submit_score transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Submit a verified score to the leaderboard.
   * 
   * Can be called by:
   * - The trusted guitar-pizza contract (no extra receipt needed, already verified)
   * - A player directly (receipt required for standalone verification)
   * 
   * # Arguments
   * * `caller`           - Address of the caller (game contract or player)
   * * `player`           - The player whose score is being recorded
   * * `level_id`         - Level identifier
   * * `score`            - Final verified score
   * * `perfect_hits`     - Perfect hit count from journal
   * * `pizzas_completed` - Pizzas completed from journal
   * * `receipt`          - RISC Zero receipt bytes (required if caller != trusted_game)
   */
  submit_score: ({caller, player, level_id, score, perfect_hits, pizzas_completed, receipt}: {caller: string, player: string, level_id: u32, score: u64, perfect_hits: u32, pizzas_completed: u32, receipt: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Result<u32>>>

  /**
   * Construct and simulate a set_trusted_game transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update the trusted game contract address (admin only).
   */
  set_trusted_game: ({new_game}: {new_game: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a reset_leaderboard transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Reset the leaderboard for a level (admin only).
   */
  reset_leaderboard: ({level_id}: {level_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_trusted_game transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_trusted_game: (options?: MethodOptions) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a get_personal_best transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get personal best for a player on a level.
   */
  get_personal_best: ({player, level_id}: {player: string, level_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Option<LeaderboardEntry>>>

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
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABAAAAAAAAAAOTm90SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAADFVuYXV0aG9yaXplZAAAAAIAAAAAAAAADkludmFsaWRSZWNlaXB0AAAAAAADAAAAAAAAAA1BZG1pblJlcXVpcmVkAAAAAAAABA==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAALVHJ1c3RlZEdhbWUAAAAAAQAAACFUb3AtMTAgYm9hcmQgZm9yIGEgZ2l2ZW4gbGV2ZWxfaWQAAAAAAAAFQm9hcmQAAAAAAAABAAAABAAAAAEAAAAkUGVyc29uYWwgYmVzdCBmb3IgKHBsYXllciwgbGV2ZWxfaWQpAAAADFBlcnNvbmFsQmVzdAAAAAIAAAATAAAABAAAAAEAAAAyUmVzZXQgZXBvY2ggcGVyIGxldmVsIChpbmNyZW1lbnRlZCBvbiBhZG1pbiByZXNldCkAAAAAAAVFcG9jaAAAAAAAAAEAAAAE",
        "AAAAAQAAAAAAAAAAAAAAEExlYWRlcmJvYXJkRW50cnkAAAAFAAAAAAAAAAxwZXJmZWN0X2hpdHMAAAAEAAAAAAAAABBwaXp6YXNfY29tcGxldGVkAAAABAAAAAAAAAAGcGxheWVyAAAAAAATAAAAAAAAAAVzY29yZQAAAAAAAAYAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAY=",
        "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAPoAAAAEw==",
        "AAAAAAAAAAAAAAAJZ2V0X2Vwb2NoAAAAAAAAAQAAAAAAAAAIbGV2ZWxfaWQAAAAEAAAAAQAAAAQ=",
        "AAAAAAAAACNHZXQgdG9wLTEwIGxlYWRlcmJvYXJkIGZvciBhIGxldmVsLgAAAAAPZ2V0X2xlYWRlcmJvYXJkAAAAAAEAAAAAAAAACGxldmVsX2lkAAAABAAAAAEAAAPqAAAH0AAAABBMZWFkZXJib2FyZEVudHJ5",
        "AAAAAAAAABVVcGRhdGUgYWRtaW4gYWRkcmVzcy4AAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAEAAAPpAAAAAgAAAAM=",
        "AAAAAAAAAnhTdWJtaXQgYSB2ZXJpZmllZCBzY29yZSB0byB0aGUgbGVhZGVyYm9hcmQuCgpDYW4gYmUgY2FsbGVkIGJ5OgotIFRoZSB0cnVzdGVkIGd1aXRhci1waXp6YSBjb250cmFjdCAobm8gZXh0cmEgcmVjZWlwdCBuZWVkZWQsIGFscmVhZHkgdmVyaWZpZWQpCi0gQSBwbGF5ZXIgZGlyZWN0bHkgKHJlY2VpcHQgcmVxdWlyZWQgZm9yIHN0YW5kYWxvbmUgdmVyaWZpY2F0aW9uKQoKIyBBcmd1bWVudHMKKiBgY2FsbGVyYCAgICAgICAgICAgLSBBZGRyZXNzIG9mIHRoZSBjYWxsZXIgKGdhbWUgY29udHJhY3Qgb3IgcGxheWVyKQoqIGBwbGF5ZXJgICAgICAgICAgICAtIFRoZSBwbGF5ZXIgd2hvc2Ugc2NvcmUgaXMgYmVpbmcgcmVjb3JkZWQKKiBgbGV2ZWxfaWRgICAgICAgICAgLSBMZXZlbCBpZGVudGlmaWVyCiogYHNjb3JlYCAgICAgICAgICAgIC0gRmluYWwgdmVyaWZpZWQgc2NvcmUKKiBgcGVyZmVjdF9oaXRzYCAgICAgLSBQZXJmZWN0IGhpdCBjb3VudCBmcm9tIGpvdXJuYWwKKiBgcGl6emFzX2NvbXBsZXRlZGAgLSBQaXp6YXMgY29tcGxldGVkIGZyb20gam91cm5hbAoqIGByZWNlaXB0YCAgICAgICAgICAtIFJJU0MgWmVybyByZWNlaXB0IGJ5dGVzIChyZXF1aXJlZCBpZiBjYWxsZXIgIT0gdHJ1c3RlZF9nYW1lKQAAAAxzdWJtaXRfc2NvcmUAAAAHAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAABnBsYXllcgAAAAAAEwAAAAAAAAAIbGV2ZWxfaWQAAAAEAAAAAAAAAAVzY29yZQAAAAAAAAYAAAAAAAAADHBlcmZlY3RfaGl0cwAAAAQAAAAAAAAAEHBpenphc19jb21wbGV0ZWQAAAAEAAAAAAAAAAdyZWNlaXB0AAAAAA4AAAABAAAD6QAAAAQAAAAD",
        "AAAAAAAAADZVcGRhdGUgdGhlIHRydXN0ZWQgZ2FtZSBjb250cmFjdCBhZGRyZXNzIChhZG1pbiBvbmx5KS4AAAAAABBzZXRfdHJ1c3RlZF9nYW1lAAAAAQAAAAAAAAAIbmV3X2dhbWUAAAATAAAAAQAAA+kAAAACAAAAAw==",
        "AAAAAAAAAE9Jbml0aWFsaXplIHRoZSBsZWFkZXJib2FyZCB3aXRoIGFuIGFkbWluIGFuZCB0aGUgdHJ1c3RlZCBnYW1lIGNvbnRyYWN0IGFkZHJlc3MuAAAAAA1fX2NvbnN0cnVjdG9yAAAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAhnYW1lX2h1YgAAABMAAAAA",
        "AAAAAAAAAC9SZXNldCB0aGUgbGVhZGVyYm9hcmQgZm9yIGEgbGV2ZWwgKGFkbWluIG9ubHkpLgAAAAARcmVzZXRfbGVhZGVyYm9hcmQAAAAAAAABAAAAAAAAAAhsZXZlbF9pZAAAAAQAAAABAAAD6QAAAAIAAAAD",
        "AAAAAAAAAAAAAAAQZ2V0X3RydXN0ZWRfZ2FtZQAAAAAAAAABAAAD6AAAABM=",
        "AAAAAAAAACpHZXQgcGVyc29uYWwgYmVzdCBmb3IgYSBwbGF5ZXIgb24gYSBsZXZlbC4AAAAAABFnZXRfcGVyc29uYWxfYmVzdAAAAAAAAAIAAAAAAAAABnBsYXllcgAAAAAAEwAAAAAAAAAIbGV2ZWxfaWQAAAAEAAAAAQAAA+gAAAfQAAAAEExlYWRlcmJvYXJkRW50cnk=" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_admin: this.txFromJSON<Option<string>>,
        get_epoch: this.txFromJSON<u32>,
        get_leaderboard: this.txFromJSON<Array<LeaderboardEntry>>,
        set_admin: this.txFromJSON<Result<void>>,
        submit_score: this.txFromJSON<Result<u32>>,
        set_trusted_game: this.txFromJSON<Result<void>>,
        reset_leaderboard: this.txFromJSON<Result<void>>,
        get_trusted_game: this.txFromJSON<Option<string>>,
        get_personal_best: this.txFromJSON<Option<LeaderboardEntry>>
  }
}