const StellarSdk = require('@stellar/stellar-sdk');
const { Keypair, Contract, rpc, Networks } = StellarSdk;

async function check() {
  const adminSecret = 'SBL476C4C7ZTSWUWWNPFNCFWEW2JIPPWJMZMTCI3QZFVSRQWSTQDVIFN';
  const kp = Keypair.fromSecret(adminSecret);
  console.log('Admin Secret Public Key:', kp.publicKey());

  const contractId = 'CDDYOTZUTLLEQST7VVQPUL3XVXJERHQGJ246SA2RWCRROOQQPQKJTGZC';
  const rpcUrl = 'https://soroban-testnet.stellar.org';
  const server = new rpc.Server(rpcUrl);
  const contract = new Contract(contractId);

  // We will run a simulation to invoke the view functions admin() and minter()
  // This does not cost gas and does not need signatures.
  try {
    // Generate a dummy keypair to sign the simulation (required by some SDK versions, though simulation can use dummy)
    const dummyKp = Keypair.random();
    const account = await server.getAccount(dummyKp.publicKey());

    // 1. Get Admin
    const txAdmin = new StellarSdk.TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(contract.call('admin'))
    .setTimeout(30)
    .build();

    const simAdmin = await server.simulateTransaction(txAdmin);
    if (simAdmin.result) {
      console.log('Admin returned ScVal:', JSON.stringify(simAdmin.result.retval));
    } else {
      console.log('Admin simulation failed:', simAdmin);
    }

    // 2. Get Minter
    const txMinter = new StellarSdk.TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(contract.call('minter'))
    .setTimeout(30)
    .build();

    const simMinter = await server.simulateTransaction(txMinter);
    if (simMinter.result) {
      console.log('Minter returned ScVal:', JSON.stringify(simMinter.result.retval));
    } else {
      console.log('Minter simulation failed:', simMinter);
    }

  } catch(e) {
    console.error('Error querying chain:', e);
  }
}

check();
