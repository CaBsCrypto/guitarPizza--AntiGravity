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
export { Address } from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBOKHYCJYPAIF3NQHPQGJTDJGCKBDC2FN5IXPBFI7L4UDIIFCLVED4HF",
  }
} as const

export const Errors = {
  1: {message:"NotPlayer"},
  2: {message:"SessionNotFound"},
  3: {message:"SessionAlreadyEnded"},
  4: {message:"ActiveSessionExists"},
  5: {message:"ReceiptTooShort"},
  6: {message:"InvalidReceipt"},
  7: {message:"ProofAlreadyUsed"},
  8: {message:"SessionIdMismatch"},
  9: {message:"PlayerMismatch"},
  10: {message:"HubNotConfigured"},
  11: {message:"Unauthorized"},
  12: {message:"NoRewardPending"},
  13: {message:"SliceNotConfigured"}
}

export type DataKey = {tag: "Admin", values: void} | {tag: "GameHubAddress", values: void} | {tag: "Session", values: readonly [u32]} | {tag: "ActiveSession", values: readonly [string]} | {tag: "ProofDigest", values: readonly [Buffer]} | {tag: "SliceToken", values: void} | {tag: "SliceConfig", values: void} | {tag: "PendingReward", values: readonly [u32]};


export interface Session {
  fever_seconds: u32;
  is_ended: boolean;
  level_id: u32;
  perfect_hits: u32;
  pizzas_completed: u32;
  player: string;
  player_won: boolean;
  score: u32;
  score_goal: u32;
  session_id: u32;
  total_hits: u32;
  total_traps: u32;
  traps_avoided: u32;
}


/**
 * Configuration for SLICE rewards.
 */
export interface SliceConfig {
  /**
 * Whole SLICE units awarded per winning session (e.g. 1 = 1 SLICE).
 */
slice_per_win: i128;
}

export interface Client {
  /**
   * Construct and simulate a claim_slice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Claim the SLICE reward for a winning session.
   * 
   * The player calls this after `submit_score` returns `true`.
   * On success mints `slice_per_win` whole SLICE to the player via the
   * $SLICE contract and removes the pending reward (no double-claim).
   * 
   * Returns the amount of whole SLICE minted.
   */
  claim_slice: ({session_id, player}: {session_id: u32, player: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a get_session transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_session: ({session_id}: {session_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Session>>>

  /**
   * Construct and simulate a get_slice_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_slice_token: (options?: MethodOptions) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a set_slice_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set the $SLICE token contract address.
   * Only admin. Call this once after deploying slice-token to testnet/mainnet.
   */
  set_slice_token: ({slice_token}: {slice_token: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_slice_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_slice_config: (options?: MethodOptions) => Promise<AssembledTransaction<Option<SliceConfig>>>

  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  upgrade: ({new_wasm_hash}: {new_wasm_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_admin: ({new_admin}: {new_admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a start_game transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Open a new game session and register it with the Game Hub.
   * 
   * # player1 / player2 convention
   * player1 = admin address (La Casa / the house) stored in contract storage.
   * player2 = the human `player` argument.
   * player1_points = score goal the human must beat to win.
   * 
   * Rate-limit: at most 1 active session per player address.
   */
  start_game: ({session_id, player, level_id, score_goal}: {session_id: u32, player: string, level_id: u32, score_goal: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a submit_score transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Submit a RISC Zero receipt to verify score and close the session.
   * 
   * On success:
   * - Stores final achievement stats in session.
   * - Emits `verified_score` event.
   * - Calls `GameHub::end_game`:
   * player1_won = false  →  human player beats the house (score >= goal)
   * player1_won = true   →  La Casa wins (score < goal)
   */
  submit_score: ({session_id, player, receipt}: {session_id: u32, player: string, receipt: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Result<boolean>>>

  /**
   * Construct and simulate a set_slice_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Configure how many whole SLICE a player earns per winning session.
   * `slice_per_win = 0` effectively disables rewards without removing the token address.
   */
  set_slice_config: ({slice_per_win}: {slice_per_win: i128}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a set_hub transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_hub: ({new_hub}: {new_hub: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admin: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_hub transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_hub: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_active_session transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_active_session: ({player}: {player: string}, options?: MethodOptions) => Promise<AssembledTransaction<Option<u32>>>

  /**
   * Construct and simulate a get_pending_reward transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * How many whole SLICE are claimable for a session (0 if none / already claimed).
   */
  get_pending_reward: ({session_id}: {session_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

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
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAADQAAAAAAAAAJTm90UGxheWVyAAAAAAAAAQAAAAAAAAAPU2Vzc2lvbk5vdEZvdW5kAAAAAAIAAAAAAAAAE1Nlc3Npb25BbHJlYWR5RW5kZWQAAAAAAwAAAAAAAAATQWN0aXZlU2Vzc2lvbkV4aXN0cwAAAAAEAAAAAAAAAA9SZWNlaXB0VG9vU2hvcnQAAAAABQAAAAAAAAAOSW52YWxpZFJlY2VpcHQAAAAAAAYAAAAAAAAAEFByb29mQWxyZWFkeVVzZWQAAAAHAAAAAAAAABFTZXNzaW9uSWRNaXNtYXRjaAAAAAAAAAgAAAAAAAAADlBsYXllck1pc21hdGNoAAAAAAAJAAAAAAAAABBIdWJOb3RDb25maWd1cmVkAAAACgAAAAAAAAAMVW5hdXRob3JpemVkAAAACwAAAAAAAAAPTm9SZXdhcmRQZW5kaW5nAAAAAAwAAAAAAAAAElNsaWNlTm90Q29uZmlndXJlZAAAAAAADQ==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAOR2FtZUh1YkFkZHJlc3MAAAAAAAEAAAAAAAAAB1Nlc3Npb24AAAAAAQAAAAQAAAABAAAAAAAAAA1BY3RpdmVTZXNzaW9uAAAAAAAAAQAAABMAAAABAAAAAAAAAAtQcm9vZkRpZ2VzdAAAAAABAAAD7gAAACAAAAAAAAAAAAAAAApTbGljZVRva2VuAAAAAAAAAAAAAAAAAAtTbGljZUNvbmZpZwAAAAABAAAAAAAAAA1QZW5kaW5nUmV3YXJkAAAAAAAAAQAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAB1Nlc3Npb24AAAAADQAAAAAAAAANZmV2ZXJfc2Vjb25kcwAAAAAAAAQAAAAAAAAACGlzX2VuZGVkAAAAAQAAAAAAAAAIbGV2ZWxfaWQAAAAEAAAAAAAAAAxwZXJmZWN0X2hpdHMAAAAEAAAAAAAAABBwaXp6YXNfY29tcGxldGVkAAAABAAAAAAAAAAGcGxheWVyAAAAAAATAAAAAAAAAApwbGF5ZXJfd29uAAAAAAABAAAAAAAAAAVzY29yZQAAAAAAAAQAAAAAAAAACnNjb3JlX2dvYWwAAAAAAAQAAAAAAAAACnNlc3Npb25faWQAAAAAAAQAAAAAAAAACnRvdGFsX2hpdHMAAAAAAAQAAAAAAAAAC3RvdGFsX3RyYXBzAAAAAAQAAAAAAAAADXRyYXBzX2F2b2lkZWQAAAAAAAAE",
        "AAAAAQAAACBDb25maWd1cmF0aW9uIGZvciBTTElDRSByZXdhcmRzLgAAAAAAAAALU2xpY2VDb25maWcAAAAAAQAAAEFXaG9sZSBTTElDRSB1bml0cyBhd2FyZGVkIHBlciB3aW5uaW5nIHNlc3Npb24gKGUuZy4gMSA9IDEgU0xJQ0UpLgAAAAAAAA1zbGljZV9wZXJfd2luAAAAAAAACw==",
        "AAAAAAAAARlDbGFpbSB0aGUgU0xJQ0UgcmV3YXJkIGZvciBhIHdpbm5pbmcgc2Vzc2lvbi4KClRoZSBwbGF5ZXIgY2FsbHMgdGhpcyBhZnRlciBgc3VibWl0X3Njb3JlYCByZXR1cm5zIGB0cnVlYC4KT24gc3VjY2VzcyBtaW50cyBgc2xpY2VfcGVyX3dpbmAgd2hvbGUgU0xJQ0UgdG8gdGhlIHBsYXllciB2aWEgdGhlCiRTTElDRSBjb250cmFjdCBhbmQgcmVtb3ZlcyB0aGUgcGVuZGluZyByZXdhcmQgKG5vIGRvdWJsZS1jbGFpbSkuCgpSZXR1cm5zIHRoZSBhbW91bnQgb2Ygd2hvbGUgU0xJQ0UgbWludGVkLgAAAAAAAAtjbGFpbV9zbGljZQAAAAACAAAAAAAAAApzZXNzaW9uX2lkAAAAAAAEAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAABAAAD6QAAAAsAAAAD",
        "AAAAAAAAAAAAAAALZ2V0X3Nlc3Npb24AAAAAAQAAAAAAAAAKc2Vzc2lvbl9pZAAAAAAABAAAAAEAAAPpAAAH0AAAAAdTZXNzaW9uAAAAAAM=",
        "AAAAAAAAAAAAAAAPZ2V0X3NsaWNlX3Rva2VuAAAAAAAAAAABAAAD6AAAABM=",
        "AAAAAAAAAHFTZXQgdGhlICRTTElDRSB0b2tlbiBjb250cmFjdCBhZGRyZXNzLgpPbmx5IGFkbWluLiBDYWxsIHRoaXMgb25jZSBhZnRlciBkZXBsb3lpbmcgc2xpY2UtdG9rZW4gdG8gdGVzdG5ldC9tYWlubmV0LgAAAAAAAA9zZXRfc2xpY2VfdG9rZW4AAAAAAQAAAAAAAAALc2xpY2VfdG9rZW4AAAAAEwAAAAEAAAPpAAAAAgAAAAM=",
        "AAAAAAAAAAAAAAAQZ2V0X3NsaWNlX2NvbmZpZwAAAAAAAAABAAAD6AAAB9AAAAALU2xpY2VDb25maWcA",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAAAIAAAAD",
        "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAEAAAPpAAAAAgAAAAM=",
        "AAAAAAAAAT1PcGVuIGEgbmV3IGdhbWUgc2Vzc2lvbiBhbmQgcmVnaXN0ZXIgaXQgd2l0aCB0aGUgR2FtZSBIdWIuCgojIHBsYXllcjEgLyBwbGF5ZXIyIGNvbnZlbnRpb24KcGxheWVyMSA9IGFkbWluIGFkZHJlc3MgKExhIENhc2EgLyB0aGUgaG91c2UpIHN0b3JlZCBpbiBjb250cmFjdCBzdG9yYWdlLgpwbGF5ZXIyID0gdGhlIGh1bWFuIGBwbGF5ZXJgIGFyZ3VtZW50LgpwbGF5ZXIxX3BvaW50cyA9IHNjb3JlIGdvYWwgdGhlIGh1bWFuIG11c3QgYmVhdCB0byB3aW4uCgpSYXRlLWxpbWl0OiBhdCBtb3N0IDEgYWN0aXZlIHNlc3Npb24gcGVyIHBsYXllciBhZGRyZXNzLgAAAAAAAApzdGFydF9nYW1lAAAAAAAEAAAAAAAAAApzZXNzaW9uX2lkAAAAAAAEAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAAAAAAACGxldmVsX2lkAAAABAAAAAAAAAAKc2NvcmVfZ29hbAAAAAAABAAAAAEAAAPpAAAAAgAAAAM=",
        "AAAAAAAAATVTdWJtaXQgYSBSSVNDIFplcm8gcmVjZWlwdCB0byB2ZXJpZnkgc2NvcmUgYW5kIGNsb3NlIHRoZSBzZXNzaW9uLgoKT24gc3VjY2VzczoKLSBTdG9yZXMgZmluYWwgYWNoaWV2ZW1lbnQgc3RhdHMgaW4gc2Vzc2lvbi4KLSBFbWl0cyBgdmVyaWZpZWRfc2NvcmVgIGV2ZW50LgotIENhbGxzIGBHYW1lSHViOjplbmRfZ2FtZWA6CnBsYXllcjFfd29uID0gZmFsc2UgIOKGkiAgaHVtYW4gcGxheWVyIGJlYXRzIHRoZSBob3VzZSAoc2NvcmUgPj0gZ29hbCkKcGxheWVyMV93b24gPSB0cnVlICAg4oaSICBMYSBDYXNhIHdpbnMgKHNjb3JlIDwgZ29hbCkAAAAAAAAMc3VibWl0X3Njb3JlAAAAAwAAAAAAAAAKc2Vzc2lvbl9pZAAAAAAABAAAAAAAAAAGcGxheWVyAAAAAAATAAAAAAAAAAdyZWNlaXB0AAAAAA4AAAABAAAD6QAAAAEAAAAD",
        "AAAAAAAAAJdDb25maWd1cmUgaG93IG1hbnkgd2hvbGUgU0xJQ0UgYSBwbGF5ZXIgZWFybnMgcGVyIHdpbm5pbmcgc2Vzc2lvbi4KYHNsaWNlX3Blcl93aW4gPSAwYCBlZmZlY3RpdmVseSBkaXNhYmxlcyByZXdhcmRzIHdpdGhvdXQgcmVtb3ZpbmcgdGhlIHRva2VuIGFkZHJlc3MuAAAAABBzZXRfc2xpY2VfY29uZmlnAAAAAQAAAAAAAAANc2xpY2VfcGVyX3dpbgAAAAAAAAsAAAABAAAD6QAAAAIAAAAD",
        "AAAAAAAAAAAAAAAHc2V0X2h1YgAAAAABAAAAAAAAAAduZXdfaHViAAAAABMAAAABAAAD6QAAAAIAAAAD",
        "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAHZ2V0X2h1YgAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAIZ2FtZV9odWIAAAATAAAAAA==",
        "AAAAAAAAAAAAAAASZ2V0X2FjdGl2ZV9zZXNzaW9uAAAAAAABAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAABAAAD6AAAAAQ=",
        "AAAAAAAAAE9Ib3cgbWFueSB3aG9sZSBTTElDRSBhcmUgY2xhaW1hYmxlIGZvciBhIHNlc3Npb24gKDAgaWYgbm9uZSAvIGFscmVhZHkgY2xhaW1lZCkuAAAAABJnZXRfcGVuZGluZ19yZXdhcmQAAAAAAAEAAAAAAAAACnNlc3Npb25faWQAAAAAAAQAAAABAAAACw==" ]),
      options
    )
  }
  public readonly fromJSON = {
    claim_slice: this.txFromJSON<Result<i128>>,
        get_session: this.txFromJSON<Result<Session>>,
        get_slice_token: this.txFromJSON<Option<string>>,
        set_slice_token: this.txFromJSON<Result<void>>,
        get_slice_config: this.txFromJSON<Option<SliceConfig>>,
        upgrade: this.txFromJSON<Result<void>>,
        set_admin: this.txFromJSON<Result<void>>,
        start_game: this.txFromJSON<Result<void>>,
        submit_score: this.txFromJSON<Result<boolean>>,
        set_slice_config: this.txFromJSON<Result<void>>,
        set_hub: this.txFromJSON<Result<void>>,
        get_admin: this.txFromJSON<string>,
        get_hub: this.txFromJSON<string>,
        get_active_session: this.txFromJSON<Option<u32>>,
        get_pending_reward: this.txFromJSON<i128>
  }
}