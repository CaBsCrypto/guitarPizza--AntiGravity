const dummyFn = () => {};

export const sequentialInstructionPlan = dummyFn;
export const TOKEN_PROGRAM_ADDRESS = '';
export const findAssociatedTokenPda = dummyFn;
export const getCreateAssociatedTokenInstruction = dummyFn;
export const getCreateAssociatedTokenIdempotentInstruction = dummyFn;
export const getTransferInstruction = dummyFn;
export const fetchMint = dummyFn;
export const fetchToken = dummyFn;
export const getStructEncoder = dummyFn;
export const getOptionEncoder = dummyFn;
export const getAddressEncoder = dummyFn;
export const getU32Encoder = dummyFn;
export const getU64Encoder = dummyFn;
export const getU8Encoder = dummyFn;
export const getBooleanEncoder = dummyFn;
export const getStructDecoder = dummyFn;
export const getOptionDecoder = dummyFn;
export const getAddressDecoder = dummyFn;
export const getU32Decoder = dummyFn;
export const getU64Decoder = dummyFn;
export const getU8Decoder = dummyFn;
export const getBooleanDecoder = dummyFn;
export const combineCodec = dummyFn;
export const decodeAccount = dummyFn;
export const assertAccountExists = dummyFn;
export const fetchEncodedAccount = dummyFn;
export const assertAccountsExist = dummyFn;
export const fetchEncodedAccounts = dummyFn;
export const getArrayEncoder = dummyFn;
export const getArrayDecoder = dummyFn;
export const getEnumEncoder = dummyFn;
export const getEnumDecoder = dummyFn;
export const containsBytes = dummyFn;
export const isProgramError = dummyFn;
export const transformEncoder = dummyFn;
export const AccountRole = {};
export const getProgramDerivedAddress = dummyFn;
export const none = dummyFn;
export const getUtf8Encoder = dummyFn;
export const getUtf8Decoder = dummyFn;
export const upgradeRoleToSigner = dummyFn;

const mockProxy = new Proxy({}, {
  get: () => dummyFn
});

export default mockProxy;
