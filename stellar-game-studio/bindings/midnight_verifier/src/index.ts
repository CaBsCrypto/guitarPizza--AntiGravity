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
    contractId: "CDXW6ARYNZV2ZIMQZZHDS54QJGAMBDSQJLBL5TOWANZORVRCQOR2MSTI",
  }
} as const

export const Errors = {
  1: {message:"InvalidSignature"},
  2: {message:"NullifierAlreadyUsed"},
  3: {message:"CommitteeNotConfigured"},
  4: {message:"Unauthorized"}
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the verifier with the public key of the Midnight validator committee.
   */
  initialize: ({admin, committee_pubkey}: {admin: string, committee_pubkey: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a update_committee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update the official Midnight validator committee public key (admin only).
   */
  update_committee: ({new_pubkey}: {new_pubkey: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a verify_ticket transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Verifies a blind signature ticket issued by Midnight.
   * 
   * The ticket is signed by Midnight validators to authorize a score claim for a specific
   * recipient wallet on Stellar, without revealing the player's private gaming trace or Midnight address.
   * 
   * # Parameters
   * - `nullifier`: The anonymous transaction nullifier registered on Midnight to prevent double spending.
   * - `recipient`: The Stellar address that will receive the $SLICE prize.
   * - `signature`: The Ed25519 signature certifying `hash(nullifier + recipient)`.
   */
  verify_ticket: ({nullifier, recipient, signature}: {nullifier: Buffer, recipient: string, signature: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

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
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABAAAAAAAAAAQSW52YWxpZFNpZ25hdHVyZQAAAAEAAAAAAAAAFE51bGxpZmllckFscmVhZHlVc2VkAAAAAgAAAAAAAAAWQ29tbWl0dGVlTm90Q29uZmlndXJlZAAAAAAAAwAAAAAAAAAMVW5hdXRob3JpemVkAAAABA==",
        "AAAAAAAAAFBJbml0aWFsaXplIHRoZSB2ZXJpZmllciB3aXRoIHRoZSBwdWJsaWMga2V5IG9mIHRoZSBNaWRuaWdodCB2YWxpZGF0b3IgY29tbWl0dGVlLgAAAAppbml0aWFsaXplAAAAAAACAAAAAAAAAAVhZG1pbgAAAAAAABMAAAAAAAAAEGNvbW1pdHRlZV9wdWJrZXkAAAPuAAAAIAAAAAA=",
        "AAAAAAAAAElVcGRhdGUgdGhlIG9mZmljaWFsIE1pZG5pZ2h0IHZhbGlkYXRvciBjb21taXR0ZWUgcHVibGljIGtleSAoYWRtaW4gb25seSkuAAAAAAAAEHVwZGF0ZV9jb21taXR0ZWUAAAABAAAAAAAAAApuZXdfcHVia2V5AAAAAAPuAAAAIAAAAAEAAAPpAAAAAgAAAAM=",
        "AAAAAAAAAfxWZXJpZmllcyBhIGJsaW5kIHNpZ25hdHVyZSB0aWNrZXQgaXNzdWVkIGJ5IE1pZG5pZ2h0LgoKVGhlIHRpY2tldCBpcyBzaWduZWQgYnkgTWlkbmlnaHQgdmFsaWRhdG9ycyB0byBhdXRob3JpemUgYSBzY29yZSBjbGFpbSBmb3IgYSBzcGVjaWZpYwpyZWNpcGllbnQgd2FsbGV0IG9uIFN0ZWxsYXIsIHdpdGhvdXQgcmV2ZWFsaW5nIHRoZSBwbGF5ZXIncyBwcml2YXRlIGdhbWluZyB0cmFjZSBvciBNaWRuaWdodCBhZGRyZXNzLgoKIyBQYXJhbWV0ZXJzCi0gYG51bGxpZmllcmA6IFRoZSBhbm9ueW1vdXMgdHJhbnNhY3Rpb24gbnVsbGlmaWVyIHJlZ2lzdGVyZWQgb24gTWlkbmlnaHQgdG8gcHJldmVudCBkb3VibGUgc3BlbmRpbmcuCi0gYHJlY2lwaWVudGA6IFRoZSBTdGVsbGFyIGFkZHJlc3MgdGhhdCB3aWxsIHJlY2VpdmUgdGhlICRTTElDRSBwcml6ZS4KLSBgc2lnbmF0dXJlYDogVGhlIEVkMjU1MTkgc2lnbmF0dXJlIGNlcnRpZnlpbmcgYGhhc2gobnVsbGlmaWVyICsgcmVjaXBpZW50KWAuAAAADXZlcmlmeV90aWNrZXQAAAAAAAADAAAAAAAAAAludWxsaWZpZXIAAAAAAAPuAAAAIAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAJc2lnbmF0dXJlAAAAAAAADgAAAAEAAAPpAAAAAgAAAAM=" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        update_committee: this.txFromJSON<Result<void>>,
        verify_ticket: this.txFromJSON<Result<void>>
  }
}