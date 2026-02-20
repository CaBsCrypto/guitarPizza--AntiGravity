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
    contractId: "CCGVC6WRVP5BNFVBQRZ3KNGTSMR37QHGAZ76NB7FXUT4LSGORTPAERVC",
  }
} as const


export interface Badge {
  achievement_type: u32;
  earned_at: u64;
  fever_seconds: u32;
  level_id: u32;
  /**
 * Snapshot of the proof stats for display purposes
 */
perfect_hits: u32;
  pizzas_completed: u32;
  player: string;
  score: u64;
  total_hits: u32;
  total_traps: u32;
  traps_avoided: u32;
}

export const Errors = {
  1: {message:"NotInitialized"},
  2: {message:"AlreadyEarned"},
  3: {message:"InvalidProofData"},
  4: {message:"InvalidReceipt"},
  5: {message:"ConditionNotMet"},
  6: {message:"InvalidAchievementType"},
  7: {message:"AdminRequired"}
}

export type DataKey = {tag: "Admin", values: void} | {tag: "TrustedGame", values: void} | {tag: "Badge", values: readonly [string, u32]} | {tag: "BadgeCount", values: readonly [string]};

export interface Client {
  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admin: (options?: MethodOptions) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a get_badge_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get how many badges a player has earned.
   */
  get_badge_count: ({player}: {player: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a claim_achievement transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Claim a badge by submitting proof data and a RISC Zero receipt.
   * 
   * # Arguments
   * * `player`           - The player claiming the badge
   * * `achievement_type` - 0=PerfectRun, 1=TrapMaster, 2=FeverGod, 3=IronChef
   * * `level_id`         - Level where the achievement was earned
   * * `proof_data`       - 40-byte stats blob parsed from the ZK journal
   * * `receipt`          - Full RISC Zero receipt bytes (journal + seal)
   */
  claim_achievement: ({player, achievement_type, level_id, proof_data, receipt}: {player: string, achievement_type: u32, level_id: u32, proof_data: Buffer, receipt: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Badge>>>

  /**
   * Construct and simulate a get_badge transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get a specific badge for a player.
   */
  get_badge: ({player, achievement_type}: {player: string, achievement_type: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Option<Badge>>>

  /**
   * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_admin: ({new_admin}: {new_admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a has_achievement transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Check if a player has earned a specific achievement.
   */
  has_achievement: ({player, achievement_type}: {player: string, achievement_type: u32}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a set_trusted_game transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_trusted_game: ({new_game}: {new_game: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_all_badges transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get all badges for a player (returns only earned ones, up to 4).
   */
  get_all_badges: ({player}: {player: string}, options?: MethodOptions) => Promise<AssembledTransaction<Array<Badge>>>

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
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAABUJhZGdlAAAAAAAACwAAAAAAAAAQYWNoaWV2ZW1lbnRfdHlwZQAAAAQAAAAAAAAACWVhcm5lZF9hdAAAAAAAAAYAAAAAAAAADWZldmVyX3NlY29uZHMAAAAAAAAEAAAAAAAAAAhsZXZlbF9pZAAAAAQAAAAwU25hcHNob3Qgb2YgdGhlIHByb29mIHN0YXRzIGZvciBkaXNwbGF5IHB1cnBvc2VzAAAADHBlcmZlY3RfaGl0cwAAAAQAAAAAAAAAEHBpenphc19jb21wbGV0ZWQAAAAEAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAAAAAAABXNjb3JlAAAAAAAABgAAAAAAAAAKdG90YWxfaGl0cwAAAAAABAAAAAAAAAALdG90YWxfdHJhcHMAAAAABAAAAAAAAAANdHJhcHNfYXZvaWRlZAAAAAAAAAQ=",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABwAAAAAAAAAOTm90SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAADUFscmVhZHlFYXJuZWQAAAAAAAACAAAAAAAAABBJbnZhbGlkUHJvb2ZEYXRhAAAAAwAAAAAAAAAOSW52YWxpZFJlY2VpcHQAAAAAAAQAAAAAAAAAD0NvbmRpdGlvbk5vdE1ldAAAAAAFAAAAAAAAABZJbnZhbGlkQWNoaWV2ZW1lbnRUeXBlAAAAAAAGAAAAAAAAAA1BZG1pblJlcXVpcmVkAAAAAAAABw==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAALVHJ1c3RlZEdhbWUAAAAAAQAAAClCYWRnZSBrZXllZCBieSAocGxheWVyLCBhY2hpZXZlbWVudF90eXBlKQAAAAAAAAVCYWRnZQAAAAAAAAIAAAATAAAABAAAAAEAAAAwVG90YWwgYmFkZ2UgY291bnQgcGVyIHBsYXllciAoZm9yIHF1aWNrIHN1bW1hcnkpAAAACkJhZGdlQ291bnQAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAPoAAAAEw==",
        "AAAAAAAAAChHZXQgaG93IG1hbnkgYmFkZ2VzIGEgcGxheWVyIGhhcyBlYXJuZWQuAAAAD2dldF9iYWRnZV9jb3VudAAAAAABAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAABAAAABA==",
        "AAAAAAAAAZNDbGFpbSBhIGJhZGdlIGJ5IHN1Ym1pdHRpbmcgcHJvb2YgZGF0YSBhbmQgYSBSSVNDIFplcm8gcmVjZWlwdC4KCiMgQXJndW1lbnRzCiogYHBsYXllcmAgICAgICAgICAgIC0gVGhlIHBsYXllciBjbGFpbWluZyB0aGUgYmFkZ2UKKiBgYWNoaWV2ZW1lbnRfdHlwZWAgLSAwPVBlcmZlY3RSdW4sIDE9VHJhcE1hc3RlciwgMj1GZXZlckdvZCwgMz1Jcm9uQ2hlZgoqIGBsZXZlbF9pZGAgICAgICAgICAtIExldmVsIHdoZXJlIHRoZSBhY2hpZXZlbWVudCB3YXMgZWFybmVkCiogYHByb29mX2RhdGFgICAgICAgIC0gNDAtYnl0ZSBzdGF0cyBibG9iIHBhcnNlZCBmcm9tIHRoZSBaSyBqb3VybmFsCiogYHJlY2VpcHRgICAgICAgICAgIC0gRnVsbCBSSVNDIFplcm8gcmVjZWlwdCBieXRlcyAoam91cm5hbCArIHNlYWwpAAAAABFjbGFpbV9hY2hpZXZlbWVudAAAAAAAAAUAAAAAAAAABnBsYXllcgAAAAAAEwAAAAAAAAAQYWNoaWV2ZW1lbnRfdHlwZQAAAAQAAAAAAAAACGxldmVsX2lkAAAABAAAAAAAAAAKcHJvb2ZfZGF0YQAAAAAADgAAAAAAAAAHcmVjZWlwdAAAAAAOAAAAAQAAA+kAAAfQAAAABUJhZGdlAAAAAAAAAw==",
        "AAAAAAAAACJHZXQgYSBzcGVjaWZpYyBiYWRnZSBmb3IgYSBwbGF5ZXIuAAAAAAAJZ2V0X2JhZGdlAAAAAAAAAgAAAAAAAAAGcGxheWVyAAAAAAATAAAAAAAAABBhY2hpZXZlbWVudF90eXBlAAAABAAAAAEAAAPoAAAH0AAAAAVCYWRnZQAAAA==",
        "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAEAAAPpAAAAAgAAAAM=",
        "AAAAAAAAADRDaGVjayBpZiBhIHBsYXllciBoYXMgZWFybmVkIGEgc3BlY2lmaWMgYWNoaWV2ZW1lbnQuAAAAD2hhc19hY2hpZXZlbWVudAAAAAACAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAAAAAAAEGFjaGlldmVtZW50X3R5cGUAAAAEAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAQc2V0X3RydXN0ZWRfZ2FtZQAAAAEAAAAAAAAACG5ld19nYW1lAAAAEwAAAAEAAAPpAAAAAgAAAAM=",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAIZ2FtZV9odWIAAAATAAAAAA==",
        "AAAAAAAAAEBHZXQgYWxsIGJhZGdlcyBmb3IgYSBwbGF5ZXIgKHJldHVybnMgb25seSBlYXJuZWQgb25lcywgdXAgdG8gNCkuAAAADmdldF9hbGxfYmFkZ2VzAAAAAAABAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAABAAAD6gAAB9AAAAAFQmFkZ2UAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_admin: this.txFromJSON<Option<string>>,
        get_badge_count: this.txFromJSON<u32>,
        claim_achievement: this.txFromJSON<Result<Badge>>,
        get_badge: this.txFromJSON<Option<Badge>>,
        set_admin: this.txFromJSON<Result<void>>,
        has_achievement: this.txFromJSON<boolean>,
        set_trusted_game: this.txFromJSON<Result<void>>,
        get_all_badges: this.txFromJSON<Array<Badge>>
  }
}