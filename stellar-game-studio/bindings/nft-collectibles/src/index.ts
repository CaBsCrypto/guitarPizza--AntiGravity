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




export const Errors = {
  1: {message:"AlreadyInitialized"},
  2: {message:"NotInitialized"},
  3: {message:"NotAuthorized"},
  4: {message:"MaxSupplyReached"},
  5: {message:"TokenDoesNotExist"},
  6: {message:"NotOwner"},
  7: {message:"InvalidRoyalty"}
}

export type DataKey = {tag: "Admin", values: void} | {tag: "BaseURI", values: void} | {tag: "TotalSupply", values: void} | {tag: "Treasury", values: void} | {tag: "RoyaltyBps", values: void} | {tag: "Balance", values: readonly [string]} | {tag: "Owner", values: readonly [u32]} | {tag: "Approved", values: readonly [u32]};

export interface Client {
  /**
   * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Burn (destroy) a token
   */
  burn: ({caller, token_id}: {caller: string, token_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a total_supply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_supply: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_royalty_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Calculate Royalties for a given sale price
   */
  get_royalty_info: ({sale_price}: {sale_price: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Result<readonly [string, u32]>>>

  /**
   * Construct and simulate a owner_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  owner_of: ({token_id}: {token_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a set_base_uri transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Admin only: Change the Base URI
   */
  set_base_uri: ({new_uri}: {new_uri: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a base_uri transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  base_uri: (options?: MethodOptions) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Transfer a token to a new owner
   */
  transfer: ({caller, from, to, token_id}: {caller: string, from: string, to: string, token_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Mint a new NFT to a specific address. Returns the new Token ID.
   */
  mint: ({to}: {to: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<u32>>>

  /**
   * Construct and simulate a approve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Approve another address to transfer this token
   */
  approve: ({caller, operator, token_id}: {caller: string, operator: string, token_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a balance_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance_of: ({owner}: {owner: string}, options?: MethodOptions) => Promise<AssembledTransaction<Array<u32>>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the contract with an admin, base URI, treasury address, and royalties in basis points (e.g. 500 = 5%)
   */
  initialize: ({admin, base_uri, treasury, royalty_bps}: {admin: string, base_uri: string, treasury: string, royalty_bps: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

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
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABwAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAABAAAAAAAAAA5Ob3RJbml0aWFsaXplZAAAAAAAAgAAAAAAAAANTm90QXV0aG9yaXplZAAAAAAAAAMAAAAAAAAAEE1heFN1cHBseVJlYWNoZWQAAAAEAAAAAAAAABFUb2tlbkRvZXNOb3RFeGlzdAAAAAAAAAUAAAAAAAAACE5vdE93bmVyAAAABgAAAAAAAAAOSW52YWxpZFJveWFsdHkAAAAAAAc=",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAHQmFzZVVSSQAAAAAAAAAAAAAAAAtUb3RhbFN1cHBseQAAAAAAAAAAAAAAAAhUcmVhc3VyeQAAAAAAAAAAAAAAClJveWFsdHlCcHMAAAAAAAEAAAAAAAAAB0JhbGFuY2UAAAAAAQAAABMAAAABAAAAAAAAAAVPd25lcgAAAAAAAAEAAAAEAAAAAQAAAAAAAAAIQXBwcm92ZWQAAAABAAAABA==",
        "AAAAAAAAABZCdXJuIChkZXN0cm95KSBhIHRva2VuAAAAAAAEYnVybgAAAAIAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAQAAA+kAAAACAAAAAw==",
        "AAAAAAAAAAAAAAAMdG90YWxfc3VwcGx5AAAAAAAAAAEAAAAE",
        "AAAAAAAAACpDYWxjdWxhdGUgUm95YWx0aWVzIGZvciBhIGdpdmVuIHNhbGUgcHJpY2UAAAAAABBnZXRfcm95YWx0eV9pbmZvAAAAAQAAAAAAAAAKc2FsZV9wcmljZQAAAAAABAAAAAEAAAPpAAAD7QAAAAIAAAATAAAABAAAAAM=",
        "AAAAAAAAAAAAAAAIb3duZXJfb2YAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAABAAAD6QAAABMAAAAD",
        "AAAAAAAAAB9BZG1pbiBvbmx5OiBDaGFuZ2UgdGhlIEJhc2UgVVJJAAAAAAxzZXRfYmFzZV91cmkAAAABAAAAAAAAAAduZXdfdXJpAAAAABAAAAABAAAD6QAAAAIAAAAD",
        "AAAAAAAAAAAAAAAIYmFzZV91cmkAAAAAAAAAAQAAA+kAAAAQAAAAAw==",
        "AAAAAAAAAB9UcmFuc2ZlciBhIHRva2VuIHRvIGEgbmV3IG93bmVyAAAAAAh0cmFuc2ZlcgAAAAQAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAABAAAD6QAAAAIAAAAD",
        "AAAAAAAAAD9NaW50IGEgbmV3IE5GVCB0byBhIHNwZWNpZmljIGFkZHJlc3MuIFJldHVybnMgdGhlIG5ldyBUb2tlbiBJRC4AAAAABG1pbnQAAAABAAAAAAAAAAJ0bwAAAAAAEwAAAAEAAAPpAAAABAAAAAM=",
        "AAAAAAAAAC5BcHByb3ZlIGFub3RoZXIgYWRkcmVzcyB0byB0cmFuc2ZlciB0aGlzIHRva2VuAAAAAAAHYXBwcm92ZQAAAAADAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAQAAA+kAAAACAAAAAw==",
        "AAAAAAAAAAAAAAAKYmFsYW5jZV9vZgAAAAAAAQAAAAAAAAAFb3duZXIAAAAAAAATAAAAAQAAA+oAAAAE",
        "AAAAAAAAAHBJbml0aWFsaXplIHRoZSBjb250cmFjdCB3aXRoIGFuIGFkbWluLCBiYXNlIFVSSSwgdHJlYXN1cnkgYWRkcmVzcywgYW5kIHJveWFsdGllcyBpbiBiYXNpcyBwb2ludHMgKGUuZy4gNTAwID0gNSUpAAAACmluaXRpYWxpemUAAAAAAAQAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAIYmFzZV91cmkAAAAQAAAAAAAAAAh0cmVhc3VyeQAAABMAAAAAAAAAC3JveWFsdHlfYnBzAAAAAAQAAAABAAAD6QAAAAIAAAAD" ]),
      options
    )
  }
  public readonly fromJSON = {
    burn: this.txFromJSON<Result<void>>,
        total_supply: this.txFromJSON<u32>,
        get_royalty_info: this.txFromJSON<Result<readonly [string, u32]>>,
        owner_of: this.txFromJSON<Result<string>>,
        set_base_uri: this.txFromJSON<Result<void>>,
        base_uri: this.txFromJSON<Result<string>>,
        transfer: this.txFromJSON<Result<void>>,
        mint: this.txFromJSON<Result<u32>>,
        approve: this.txFromJSON<Result<void>>,
        balance_of: this.txFromJSON<Array<u32>>,
        initialize: this.txFromJSON<Result<void>>
  }
}