import {
    Contract,
    TransactionBuilder,
    Keypair,
    xdr,
    rpc,
    TimeoutInfinite
} from '@stellar/stellar-sdk';
import { readEnvFile, getEnvValue } from './utils/env';
import { Buffer } from 'buffer';

// Allow top-level await
async function main() {
    console.log("🍕 Initializing Guitar Pizza Level 1 (Direct SDK)...");

    const env = await readEnvFile('.env');
    const rpcUrl = getEnvValue(env, 'VITE_SOROBAN_RPC_URL', 'https://soroban-testnet.stellar.org');
    const networkPassphrase = getEnvValue(env, 'VITE_NETWORK_PASSPHRASE', 'Test SDF Network ; September 2015');
    const contractId = getEnvValue(env, 'VITE_GUITAR_PIZZA_CONTRACT_ID');
    const player1Secret = getEnvValue(env, 'VITE_DEV_PLAYER1_SECRET');

    if (!contractId) {
        throw new Error("Contract ID missing in .env");
    }
    if (!player1Secret) {
        throw new Error("Player 1 secret missing in .env");
    }

    const server = new rpc.Server(rpcUrl);
    const signer = Keypair.fromSecret(player1Secret);
    const adminPublicKey = signer.publicKey();

    console.log(`Contract: ${contractId}`);
    console.log(`Admin/Signer: ${adminPublicKey}`);

    try {
        const account = await server.getAccount(adminPublicKey);

        // Mock Song Hash (32 bytes)
        const songHash = Buffer.alloc(32);
        songHash.write("Verse1-Chorus-Solo-Outro", 0);

        const contract = new Contract(contractId);

        // Operation: set_level_config(level_id: u32, song_hash: bytes32)
        const callOp = contract.call(
            "set_level_config",
            xdr.ScVal.scvU32(1),
            xdr.ScVal.scvBytes(songHash)
        );

        const tx = new TransactionBuilder(account, {
            fee: "10000", /* Higher fee for safety */
            networkPassphrase
        })
            .addOperation(callOp)
            .setTimeout(TimeoutInfinite)
            .build();

        console.log("Simulating...");
        const simResponse = await server.simulateTransaction(tx);

        if (rpc.Api.isSimulationError(simResponse)) {
            console.error("Simulation Error:", simResponse.error);
            // console.error("Events:", simResponse.events);
            return;
        }

        console.log("Preparing transaction...");
        const preparedTx = await server.prepareTransaction(tx, simResponse);

        console.log("Signing...");
        preparedTx.sign(signer);

        console.log("Submitting...");
        const sendResponse = await server.sendTransaction(preparedTx);

        if (sendResponse.status !== "PENDING" && sendResponse.status !== "SUCCESS") {
            console.error("Submission Failed:", sendResponse);
            // If error result is xdr, we can't parse it easily here without more utils
            return;
        }

        // Wait for completion (handling pending)
        let status = sendResponse.status;
        let result = sendResponse;
        if (status === "PENDING") {
            const hash = sendResponse.hash;
            console.log(`Tx PENDING: ${hash}. Waiting...`);

            // Poll for status
            for (let i = 0; i < 10; i++) {
                await new Promise(r => setTimeout(r, 2000));
                const txResp = await server.getTransaction(hash);
                status = txResp.status;
                if (status !== "NOT_FOUND" && status !== "PENDING") {
                    result = txResp as any;
                    break;
                }
            }
        }

        if (status === "SUCCESS") {
            console.log("✅ Level 1 Initialized Successfully!");
            console.log(`Tx Hash: ${result.hash}`);
        } else {
            console.error(`❌ Transaction failed with status: ${status}`);
        }

    } catch (e: any) {
        console.error("❌ SCRIPT ERROR:", e.message);
        if (e.response) {
            console.error("Response data:", e.response.data);
        }
    }
}

main();
