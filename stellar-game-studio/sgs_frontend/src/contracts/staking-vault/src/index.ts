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




export type DataKey = {tag: "SliceToken", values: void} | {tag: "CheeseToken", values: void} | {tag: "PepperoniToken", values: void} | {tag: "BaconToken", values: void} | {tag: "OnionToken", values: void} | {tag: "Stake", values: readonly [string]} | {tag: "LastHarvest", values: readonly [string]} | {tag: "Initialized", values: void} | {tag: "LPToken", values: void} | {tag: "LPStake", values: readonly [string]} | {tag: "LPLastHarvest", values: readonly [string]};

export interface Client {
  /**
   * Construct and simulate a unstake_slice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unstake_slice: ({user, amount}: {user: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_lp_last_harvest transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_lp_last_harvest: ({user}: {user: string}, options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a stake_lp transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  stake_lp: ({user, amount}: {user: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a unstake_lp transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unstake_lp: ({user, amount}: {user: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_lp_stake transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_lp_stake: ({user}: {user: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a claim_lp_rewards transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  claim_lp_rewards: ({user}: {user: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a stake_slice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  stake_slice: ({user, amount}: {user: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_last_harvest transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_last_harvest: ({user}: {user: string}, options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a get_stake transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_stake: ({user}: {user: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({slice, cheese, pepperoni, bacon, onion, lp_token}: {slice: string, cheese: string, pepperoni: string, bacon: string, onion: string, lp_token: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a claim_rewards transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  claim_rewards: ({user}: {user: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACwAAAAAAAAAAAAAAClNsaWNlVG9rZW4AAAAAAAAAAAAAAAAAC0NoZWVzZVRva2VuAAAAAAAAAAAAAAAADlBlcHBlcm9uaVRva2VuAAAAAAAAAAAAAAAAAApCYWNvblRva2VuAAAAAAAAAAAAAAAAAApPbmlvblRva2VuAAAAAAABAAAAAAAAAAVTdGFrZQAAAAAAAAEAAAATAAAAAQAAAAAAAAALTGFzdEhhcnZlc3QAAAAAAQAAABMAAAAAAAAAAAAAAAtJbml0aWFsaXplZAAAAAAAAAAAAAAAAAdMUFRva2VuAAAAAAEAAAAAAAAAB0xQU3Rha2UAAAAAAQAAABMAAAABAAAAAAAAAA1MUExhc3RIYXJ2ZXN0AAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAANdW5zdGFrZV9zbGljZQAAAAAAAAIAAAAAAAAABHVzZXIAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAATZ2V0X2xwX2xhc3RfaGFydmVzdAAAAAABAAAAAAAAAAR1c2VyAAAAEwAAAAEAAAAG",
        "AAAAAAAAAAAAAAAIc3Rha2VfbHAAAAACAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAKdW5zdGFrZV9scAAAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAAAAAAAMZ2V0X2xwX3N0YWtlAAAAAQAAAAAAAAAEdXNlcgAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAQY2xhaW1fbHBfcmV3YXJkcwAAAAEAAAAAAAAABHVzZXIAAAATAAAAAA==",
        "AAAAAAAAAAAAAAALc3Rha2Vfc2xpY2UAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAAAAAAAQZ2V0X2xhc3RfaGFydmVzdAAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAAAY=",
        "AAAAAAAAAAAAAAAJZ2V0X3N0YWtlAAAAAAAAAQAAAAAAAAAEdXNlcgAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABgAAAAAAAAAFc2xpY2UAAAAAAAATAAAAAAAAAAZjaGVlc2UAAAAAABMAAAAAAAAACXBlcHBlcm9uaQAAAAAAABMAAAAAAAAABWJhY29uAAAAAAAAEwAAAAAAAAAFb25pb24AAAAAAAATAAAAAAAAAAhscF90b2tlbgAAABMAAAAA",
        "AAAAAAAAAAAAAAANY2xhaW1fcmV3YXJkcwAAAAAAAAEAAAAAAAAABHVzZXIAAAATAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    unstake_slice: this.txFromJSON<null>,
        get_lp_last_harvest: this.txFromJSON<u64>,
        stake_lp: this.txFromJSON<null>,
        unstake_lp: this.txFromJSON<null>,
        get_lp_stake: this.txFromJSON<i128>,
        claim_lp_rewards: this.txFromJSON<null>,
        stake_slice: this.txFromJSON<null>,
        get_last_harvest: this.txFromJSON<u64>,
        get_stake: this.txFromJSON<i128>,
        initialize: this.txFromJSON<null>,
        claim_rewards: this.txFromJSON<null>
  }
}