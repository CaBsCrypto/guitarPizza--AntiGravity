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




export type DataKey = {tag: "Admin", values: void} | {tag: "SliceToken", values: void} | {tag: "NextMatchId", values: void} | {tag: "Match", values: readonly [u64]} | {tag: "Initialized", values: void};


export interface MatchInfo {
  player_a: string;
  player_b: Option<string>;
  status: u32;
  wager: i128;
  winner: Option<string>;
}

export interface Client {
  /**
   * Construct and simulate a create_match transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_match: ({player_a, wager}: {player_a: string, wager: i128}, options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a join_match transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  join_match: ({player_b, match_id}: {player_b: string, match_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a resolve_match transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  resolve_match: ({match_id, winner}: {match_id: u64, winner: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_match transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_match: ({match_id}: {match_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Option<MatchInfo>>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin, slice_token}: {admin: string, slice_token: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAKU2xpY2VUb2tlbgAAAAAAAAAAAAAAAAALTmV4dE1hdGNoSWQAAAAAAQAAAAAAAAAFTWF0Y2gAAAAAAAABAAAABgAAAAAAAAAAAAAAC0luaXRpYWxpemVkAA==",
        "AAAAAQAAAAAAAAAAAAAACU1hdGNoSW5mbwAAAAAAAAUAAAAAAAAACHBsYXllcl9hAAAAEwAAAAAAAAAIcGxheWVyX2IAAAPoAAAAEwAAAAAAAAAGc3RhdHVzAAAAAAAEAAAAAAAAAAV3YWdlcgAAAAAAAAsAAAAAAAAABndpbm5lcgAAAAAD6AAAABM=",
        "AAAAAAAAAAAAAAAMY3JlYXRlX21hdGNoAAAAAgAAAAAAAAAIcGxheWVyX2EAAAATAAAAAAAAAAV3YWdlcgAAAAAAAAsAAAABAAAABg==",
        "AAAAAAAAAAAAAAAKam9pbl9tYXRjaAAAAAAAAgAAAAAAAAAIcGxheWVyX2IAAAATAAAAAAAAAAhtYXRjaF9pZAAAAAYAAAAA",
        "AAAAAAAAAAAAAAANcmVzb2x2ZV9tYXRjaAAAAAAAAAIAAAAAAAAACG1hdGNoX2lkAAAABgAAAAAAAAAGd2lubmVyAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAJZ2V0X21hdGNoAAAAAAAAAQAAAAAAAAAIbWF0Y2hfaWQAAAAGAAAAAQAAA+gAAAfQAAAACU1hdGNoSW5mbwAAAA==",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAtzbGljZV90b2tlbgAAAAATAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    create_match: this.txFromJSON<u64>,
        join_match: this.txFromJSON<null>,
        resolve_match: this.txFromJSON<null>,
        get_match: this.txFromJSON<Option<MatchInfo>>,
        initialize: this.txFromJSON<null>
  }
}