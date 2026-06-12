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




export type DataKey = {tag: "Admin", values: void} | {tag: "Minter", values: void} | {tag: "TotalMinted", values: void} | {tag: "Balance", values: readonly [string]} | {tag: "Allowance", values: readonly [string, string]} | {tag: "AllowanceExp", values: readonly [string, string]} | {tag: "DayGlobal", values: readonly [u64]} | {tag: "DayWallet", values: readonly [string, u64]} | {tag: "Paused", values: void};

export interface Client {
  /**
   * Construct and simulate a minter transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  minter: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance: ({id}: {id: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  name: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer: ({from, to, amount}: {from: string, to: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer_from: ({spender, from, to, amount}: {spender: string, from: string, to: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a approve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  approve: ({from, spender, amount, expiration_ledger}: {from: string, spender: string, amount: i128, expiration_ledger: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a is_paused transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_paused: (options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a total_minted transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_minted: (options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  admin: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a symbol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  symbol: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_admin: ({new_admin}: {new_admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a allowance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  allowance: ({from, spender}: {from: string, spender: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a minted_today_global transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * How many SLICE have been minted globally today (in whole SLICE units).
   */
  minted_today_global: (options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Burn `amount_slice` whole SLICE from `from`.
   * `from` must authorize this call.
   * Used by the Horno to burn SLICE when initiating a bake.
   */
  burn: ({from, amount_slice}: {from: string, amount_slice: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pause: (options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a unpause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unpause: (options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Mint `amount_slice` whole SLICE to `to`.
   * Called by guitar-pizza after a ZK-verified winning session.
   * `amount_slice` is in whole tokens (e.g. 5 = 5 SLICE, not 50_000_000).
   */
  mint: ({to, amount_slice}: {to: string, amount_slice: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a decimals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  decimals: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a set_minter transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update the minter — e.g. after redeploying guitar-pizza.
   */
  set_minter: ({new_minter}: {new_minter: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a minted_today_wallet transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * How many SLICE a wallet has minted today (in whole SLICE units).
   */
  minted_today_wallet: ({addr}: {addr: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {admin, minter}: {admin: string, minter: string},
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
    return ContractClient.deploy({admin, minter}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAGTWludGVyAAAAAAAAAAAAAAAAAAtUb3RhbE1pbnRlZAAAAAABAAAAAAAAAAdCYWxhbmNlAAAAAAEAAAATAAAAAQAAAAAAAAAJQWxsb3dhbmNlAAAAAAAAAgAAABMAAAATAAAAAQAAAAAAAAAMQWxsb3dhbmNlRXhwAAAAAgAAABMAAAATAAAAAQAAAAAAAAAJRGF5R2xvYmFsAAAAAAAAAQAAAAYAAAABAAAAAAAAAAlEYXlXYWxsZXQAAAAAAAACAAAAEwAAAAYAAAAAAAAAAAAAAAZQYXVzZWQAAA==",
        "AAAAAAAAAAAAAAAGbWludGVyAAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
        "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAQAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAHYXBwcm92ZQAAAAAEAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWV4cGlyYXRpb25fbGVkZ2VyAAAAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAAJaXNfcGF1c2VkAAAAAAAAAAAAAAEAAAAB",
        "AAAAAAAAAAAAAAAMdG90YWxfbWludGVkAAAAAAAAAAEAAAAL",
        "AAAAAAAAAAAAAAAFYWRtaW4AAAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
        "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAJYWxsb3dhbmNlAAAAAAAAAgAAAAAAAAAEZnJvbQAAABMAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAGbWludGVyAAAAAAATAAAAAA==",
        "AAAAAAAAAEZIb3cgbWFueSBTTElDRSBoYXZlIGJlZW4gbWludGVkIGdsb2JhbGx5IHRvZGF5IChpbiB3aG9sZSBTTElDRSB1bml0cykuAAAAAAATbWludGVkX3RvZGF5X2dsb2JhbAAAAAAAAAAAAQAAAAs=",
        "AAAAAAAAAIVCdXJuIGBhbW91bnRfc2xpY2VgIHdob2xlIFNMSUNFIGZyb20gYGZyb21gLgpgZnJvbWAgbXVzdCBhdXRob3JpemUgdGhpcyBjYWxsLgpVc2VkIGJ5IHRoZSBIb3JubyB0byBidXJuIFNMSUNFIHdoZW4gaW5pdGlhdGluZyBhIGJha2UuAAAAAAAABGJ1cm4AAAACAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAMYW1vdW50X3NsaWNlAAAACwAAAAA=",
        "AAAAAAAAAAAAAAAFcGF1c2UAAAAAAAAAAAAAAA==",
        "AAAAAAAAAAAAAAAHdW5wYXVzZQAAAAAAAAAAAA==",
        "AAAAAAAAAKpNaW50IGBhbW91bnRfc2xpY2VgIHdob2xlIFNMSUNFIHRvIGB0b2AuCkNhbGxlZCBieSBndWl0YXItcGl6emEgYWZ0ZXIgYSBaSy12ZXJpZmllZCB3aW5uaW5nIHNlc3Npb24uCmBhbW91bnRfc2xpY2VgIGlzIGluIHdob2xlIHRva2VucyAoZS5nLiA1ID0gNSBTTElDRSwgbm90IDUwXzAwMF8wMDApLgAAAAAABG1pbnQAAAACAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAMYW1vdW50X3NsaWNlAAAACwAAAAA=",
        "AAAAAAAAAAAAAAAIZGVjaW1hbHMAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAADpVcGRhdGUgdGhlIG1pbnRlciDigJQgZS5nLiBhZnRlciByZWRlcGxveWluZyBndWl0YXItcGl6emEuAAAAAAAKc2V0X21pbnRlcgAAAAAAAQAAAAAAAAAKbmV3X21pbnRlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAEBIb3cgbWFueSBTTElDRSBhIHdhbGxldCBoYXMgbWludGVkIHRvZGF5IChpbiB3aG9sZSBTTElDRSB1bml0cykuAAAAE21pbnRlZF90b2RheV93YWxsZXQAAAAAAQAAAAAAAAAEYWRkcgAAABMAAAABAAAACw==" ]),
      options
    )
  }
  public readonly fromJSON = {
    minter: this.txFromJSON<string>,
        balance: this.txFromJSON<i128>,
        name: this.txFromJSON<string>,
        transfer: this.txFromJSON<null>,
        transfer_from: this.txFromJSON<null>,
        approve: this.txFromJSON<null>,
        is_paused: this.txFromJSON<boolean>,
        total_minted: this.txFromJSON<i128>,
        admin: this.txFromJSON<string>,
        symbol: this.txFromJSON<string>,
        set_admin: this.txFromJSON<null>,
        allowance: this.txFromJSON<i128>,
        minted_today_global: this.txFromJSON<i128>,
        burn: this.txFromJSON<null>,
        pause: this.txFromJSON<null>,
        unpause: this.txFromJSON<null>,
        mint: this.txFromJSON<null>,
        decimals: this.txFromJSON<u32>,
        set_minter: this.txFromJSON<null>,
        minted_today_wallet: this.txFromJSON<i128>
  }
}