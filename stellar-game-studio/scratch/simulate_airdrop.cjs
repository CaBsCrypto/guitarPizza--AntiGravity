const StellarSdk = require('@stellar/stellar-sdk');
const { Keypair, Contract, rpc, Networks, Address, nativeToScVal } = StellarSdk;

async function check() {
  const adminSecret = 'SBL476C4C7ZTSWUWWNPFNCFWEW2JIPPWJMZMTCI3QZFVSRQWSTQDVIFN';
  const kp = Keypair.fromSecret(adminSecret);
  const playerAddress = 'GDTZDDVUPB2DHOJI665O5KWWDUIMCAP75CXDUSYMNHE6WHMHP57DMG7L'; // using admin as player address for test

  const contractId = 'CDDYOTZUTLLEQST7VVQPUL3XVXJERHQGJ246SA2RWCRROOQQPQKJTGZC';
  const guitarPizzaContractId = 'CBOKHYCJYPAIF3NQHPQGJTDJGCKBDC2FN5IXPBFI7L4UDIIFCLVED4HF';
  const rpcUrl = 'https://soroban-testnet.stellar.org';
  const server = new rpc.Server(rpcUrl);
  const contract = new Contract(contractId);

  try {
    const account = await server.getAccount(kp.publicKey());

    const amountBigInt = BigInt(Math.floor(100 * 1e7)); // 100 SLICE
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: '3000',
      networkPassphrase: Networks.TESTNET
    })
      .addOperation(
        contract.call(
          'set_minter',
          Address.fromString(kp.publicKey()).toScVal()
        )
      )
      .addOperation(
        contract.call(
          'mint', 
          Address.fromString(playerAddress).toScVal(),
          nativeToScVal(amountBigInt, { type: 'i128' })
        )
      )
      .addOperation(
        contract.call(
          'set_minter',
          Address.fromString(guitarPizzaContractId).toScVal()
        )
      )
      .setTimeout(30)
      .build();

    const sim = await server.simulateTransaction(tx);
    console.log('Simulation response:', JSON.stringify(sim, null, 2));

  } catch(e) {
    console.error('Error simulating:', e);
  }
}

check();
