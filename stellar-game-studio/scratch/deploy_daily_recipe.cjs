const { Keypair } = require('@stellar/stellar-sdk');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
    try {
        console.log("Setting up admin identity...");
        const adminKeypair = Keypair.random();
        const adminAddress = adminKeypair.publicKey();
        const adminSecret = adminKeypair.secret();
        console.log("Admin generated:", adminAddress);

        // 2. Fund via friendbot
        console.log("Funding admin via Friendbot...");
        const fundRes = await fetch(`https://friendbot.stellar.org?addr=${adminAddress}`);
        if (!fundRes.ok) {
            throw new Error(`Friendbot failed with status ${fundRes.status}`);
        }
        console.log("Admin funded successfully!");

        // 3. Install WASM
        const wasmPath = path.resolve('target/wasm32v1-none/release/daily_recipe.wasm');
        console.log("Installing WASM from:", wasmPath);
        const installCmd = `stellar contract install --wasm "${wasmPath}" --source-account ${adminSecret} --network testnet`;
        console.log("Exec:", installCmd);
        const wasmHash = execSync(installCmd).toString().trim();
        console.log("WASM Hash:", wasmHash);

        // 4. Deploy contract
        const gameHubId = "CDKUWXZ46OAVM4V4Z47SKF3YGUSXFNF4WF4QN6SK5UWJRU4IKW7CX3MG";
        const deployCmd = `stellar contract deploy --wasm-hash ${wasmHash} --source-account ${adminSecret} --network testnet -- --admin ${adminAddress} --game-hub ${gameHubId}`;
        console.log("Exec:", deployCmd);
        const contractId = execSync(deployCmd).toString().trim();
        console.log("Deployed daily-recipe ID:", contractId);

        // 5. Update deployment.json
        const deploymentPath = path.resolve('deployment.json');
        if (fs.existsSync(deploymentPath)) {
            const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
            if (!deployment.contracts) deployment.contracts = {};
            deployment.contracts['daily-recipe'] = contractId;
            fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2) + '\n');
            console.log("Updated deployment.json!");
        }

        // 6. Update .env file
        const envPath = path.resolve('.env');
        if (fs.existsSync(envPath)) {
            let envContent = fs.readFileSync(envPath, 'utf8');
            const searchPattern = /VITE_DAILY_RECIPE_CONTRACT_ID=[^\r\n]*/;
            if (searchPattern.test(envContent)) {
                envContent = envContent.replace(searchPattern, `VITE_DAILY_RECIPE_CONTRACT_ID=${contractId}`);
            } else {
                envContent += `\nVITE_DAILY_RECIPE_CONTRACT_ID=${contractId}\n`;
            }
            fs.writeFileSync(envPath, envContent);
            console.log("Updated .env file!");
        }

        // 7. Update constants.ts inside frontend
        const constantsPath = path.resolve('sgs_frontend/src/utils/constants.ts');
        if (fs.existsSync(constantsPath)) {
            let constantsContent = fs.readFileSync(constantsPath, 'utf8');
            const searchPattern = /'daily-recipe':\s*'[^']*'/;
            if (searchPattern.test(constantsContent)) {
                constantsContent = constantsContent.replace(searchPattern, `'daily-recipe':      '${contractId}'`);
                fs.writeFileSync(constantsPath, constantsContent);
                console.log("Updated sgs_frontend/src/utils/constants.ts!");
            }
        }

        console.log("🎉 SUCCESS! daily-recipe redeployed and project configs updated.");
    } catch (e) {
        console.error("❌ Deployment failed:", e);
        process.exit(1);
    }
})();
