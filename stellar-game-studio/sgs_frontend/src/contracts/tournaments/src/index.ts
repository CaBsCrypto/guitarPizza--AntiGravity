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




export type DataKey = {tag: "Admin", values: void} | {tag: "SliceToken", values: void} | {tag: "ActiveTournament", values: void} | {tag: "Leaderboard", values: void} | {tag: "PlayerRegistered", values: readonly [string, u32]} | {tag: "Initialized", values: void} | {tag: "StakingVault", values: void} | {tag: "PlayerTickets", values: readonly [string]} | {tag: "StakingTicketsClaimed", values: readonly [string, u32]};


export interface TournamentInfo {
  duration: u64;
  id: u32;
  is_active: boolean;
  pool: i128;
  start_time: u64;
  wager_fee: i128;
}


export interface LeaderboardEntry {
  player: string;
  score: u32;
  timestamp: u64;
}

export interface Client {
  /**
   * Construct and simulate a is_registered transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_registered: ({player, tournament_id}: {player: string, tournament_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a start_new_tournament transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  start_new_tournament: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a claim_staking_tickets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  claim_staking_tickets: ({player}: {player: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin, slice_token, wager_fee, duration}: {admin: string, slice_token: string, wager_fee: i128, duration: u64}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a resolve_tournament transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  resolve_tournament: (options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_daily_special_multiplier transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_daily_special_multiplier: (options?: MethodOptions) => Promise<AssembledTransaction<readonly [string, u32]>>

  /**
   * Construct and simulate a get_tickets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tickets: ({player}: {player: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_leaderboard transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_leaderboard: (options?: MethodOptions) => Promise<AssembledTransaction<Array<LeaderboardEntry>>>

  /**
   * Construct and simulate a set_staking_vault transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_staking_vault: ({address}: {address: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a buy_tickets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  buy_tickets: ({player, amount}: {player: string, amount: u32}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_tournament_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tournament_info: (options?: MethodOptions) => Promise<AssembledTransaction<TournamentInfo>>

  /**
   * Construct and simulate a submit_tournament_score transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  submit_tournament_score: ({player, score, receipt}: {player: string, score: u32, receipt: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a add_tickets_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_tickets_admin: ({player, amount}: {player: string, amount: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
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
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAKU2xpY2VUb2tlbgAAAAAAAAAAAAAAAAAQQWN0aXZlVG91cm5hbWVudAAAAAAAAAAAAAAAC0xlYWRlcmJvYXJkAAAAAAEAAAAAAAAAEFBsYXllclJlZ2lzdGVyZWQAAAACAAAAEwAAAAQAAAAAAAAAAAAAAAtJbml0aWFsaXplZAAAAAAAAAAAAAAAAAxTdGFraW5nVmF1bHQAAAABAAAAAAAAAA1QbGF5ZXJUaWNrZXRzAAAAAAAAAQAAABMAAAABAAAAAAAAABVTdGFraW5nVGlja2V0c0NsYWltZWQAAAAAAAACAAAAEwAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAADlRvdXJuYW1lbnRJbmZvAAAAAAAGAAAAAAAAAAhkdXJhdGlvbgAAAAYAAAAAAAAAAmlkAAAAAAAEAAAAAAAAAAlpc19hY3RpdmUAAAAAAAABAAAAAAAAAARwb29sAAAACwAAAAAAAAAKc3RhcnRfdGltZQAAAAAABgAAAAAAAAAJd2FnZXJfZmVlAAAAAAAACw==",
        "AAAAAQAAAAAAAAAAAAAAEExlYWRlcmJvYXJkRW50cnkAAAADAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAAAAAAABXNjb3JlAAAAAAAABAAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg==",
        "AAAAAAAAAAAAAAANaXNfcmVnaXN0ZXJlZAAAAAAAAAIAAAAAAAAABnBsYXllcgAAAAAAEwAAAAAAAAANdG91cm5hbWVudF9pZAAAAAAAAAQAAAABAAAAAQ==",
        "AAAAAAAAAAAAAAAUc3RhcnRfbmV3X3RvdXJuYW1lbnQAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAVY2xhaW1fc3Rha2luZ190aWNrZXRzAAAAAAAAAQAAAAAAAAAGcGxheWVyAAAAAAATAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAtzbGljZV90b2tlbgAAAAATAAAAAAAAAAl3YWdlcl9mZWUAAAAAAAALAAAAAAAAAAhkdXJhdGlvbgAAAAYAAAAA",
        "AAAAAAAAAAAAAAAScmVzb2x2ZV90b3VybmFtZW50AAAAAAAAAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAcZ2V0X2RhaWx5X3NwZWNpYWxfbXVsdGlwbGllcgAAAAAAAAABAAAD7QAAAAIAAAARAAAABA==",
        "AAAAAAAAAAAAAAALZ2V0X3RpY2tldHMAAAAAAQAAAAAAAAAGcGxheWVyAAAAAAATAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAPZ2V0X2xlYWRlcmJvYXJkAAAAAAAAAAABAAAD6gAAB9AAAAAQTGVhZGVyYm9hcmRFbnRyeQ==",
        "AAAAAAAAAAAAAAARc2V0X3N0YWtpbmdfdmF1bHQAAAAAAAABAAAAAAAAAAdhZGRyZXNzAAAAABMAAAAA",
        "AAAAAAAAAAAAAAALYnV5X3RpY2tldHMAAAAAAgAAAAAAAAAGcGxheWVyAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAQAAAABAAAABA==",
        "AAAAAAAAAAAAAAATZ2V0X3RvdXJuYW1lbnRfaW5mbwAAAAAAAAAAAQAAB9AAAAAOVG91cm5hbWVudEluZm8AAA==",
        "AAAAAAAAAAAAAAAXc3VibWl0X3RvdXJuYW1lbnRfc2NvcmUAAAAAAwAAAAAAAAAGcGxheWVyAAAAAAATAAAAAAAAAAVzY29yZQAAAAAAAAQAAAAAAAAAB3JlY2VpcHQAAAAADgAAAAEAAAAB",
        "AAAAAAAAAAAAAAARYWRkX3RpY2tldHNfYWRtaW4AAAAAAAACAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAAAAAAABmFtb3VudAAAAAAABAAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    is_registered: this.txFromJSON<boolean>,
        start_new_tournament: this.txFromJSON<u32>,
        claim_staking_tickets: this.txFromJSON<u32>,
        initialize: this.txFromJSON<null>,
        resolve_tournament: this.txFromJSON<boolean>,
        get_daily_special_multiplier: this.txFromJSON<readonly [string, u32]>,
        get_tickets: this.txFromJSON<u32>,
        get_leaderboard: this.txFromJSON<Array<LeaderboardEntry>>,
        set_staking_vault: this.txFromJSON<null>,
        buy_tickets: this.txFromJSON<u32>,
        get_tournament_info: this.txFromJSON<TournamentInfo>,
        submit_tournament_score: this.txFromJSON<boolean>,
        add_tickets_admin: this.txFromJSON<null>
  }
}