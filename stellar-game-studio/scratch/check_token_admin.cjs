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

  try {
    const account = await server.getAccount(kp.publicKey());

    // 1. Get Admin
    const txAdmin = new StellarSdk.TransactionBuilder(account, {
      fee: '1000',
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(contract.call('admin'))
    .setTimeout(30)
    .build();

    const simAdmin = await server.simulateTransaction(txAdmin);
    if (simAdmin.result) {
      // Decode return value
      const val = simAdmin.result.retval;
      console.log('Admin ScVal:', JSON.stringify(val));
      if (val._value) {
        // Try to decode address
        try {
          const scValAddress = val;
          const address = StellarSdk.Address.fromScVal(scValAddress).toString();
          console.log('Decoded Admin Address:', address);
        } catch(e) {
          console.log('Error decoding admin ScVal to Address:', e);
        }
      }
    } else {
      console.log('Admin simulation failed:', simAdmin);
    }

    // 2. Get Minter
    const txMinter = new StellarSdk.TransactionBuilder(account, {
      fee: '1000',
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(contract.call('minter'))
    .setTimeout(30)
    .build();

    const simMinter = await server.simulateTransaction(txMinter);
    if (simMinter.result) {
      const val = simMinter.result.retval;
      console.log('Minter ScVal:', JSON.stringify(val));
      try {
        const address = StellarSdk.Address.fromScVal(val).toString();
        console.log('Decoded Minter Address:', address);
      } catch(e) {
        console.log('Error decoding minter ScVal to Address:', e);
      }
    } else {
      console.log('Minter simulation failed:', simMinter);
    }

  } catch(e) {
    console.error('Error querying chain:', e);
  }
}

check();
