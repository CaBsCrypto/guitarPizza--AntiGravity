const { execSync } = require('child_process');
const fs = require('fs');

const run = (cmd) => {
    console.log(`Running: ${cmd}`);
    return execSync(cmd, { encoding: 'utf-8' }).trim();
};

const INGREDIENTS = ['CHEESE', 'PEPPERONI', 'BACON', 'ONION'];
const tokens = {};

for (const ing of INGREDIENTS) {
    console.log(`\n--- Deploying ${ing} Token ---`);
    const id = run(`stellar contract deploy --wasm target\\wasm32v1-none\\release\\slice_token.wasm --source-account admin --network testnet -- --admin admin --minter admin`);
    console.log(`${ing} ID: ${id}`);
    tokens[ing] = id;
}

console.log('\n--- Tokens Deployed ---');
console.log(tokens);

// Update constants.ts
const constantsPath = 'sgs_frontend/src/utils/constants.ts';
let constants = fs.readFileSync(constantsPath, 'utf8');

// We will inject the new token IDs into constants.ts
for (const ing of INGREDIENTS) {
    const regex = new RegExp(`'${ing.toLowerCase()}-token':\\s*'.*?',?`, 'g');
    if (constants.match(regex)) {
        constants = constants.replace(regex, `'${ing.toLowerCase()}-token': '${tokens[ing]}',`);
    } else {
        // Just append to TESTNET_CONTRACT_IDS block
        constants = constants.replace('};', `  '${ing.toLowerCase()}-token': '${tokens[ing]}',\n};`);
    }
}

fs.writeFileSync(constantsPath, constants);
console.log('constants.ts updated.');

// Now initialize Staking Vault
const STAKING_VAULT = 'CCFFCESR67QY2KDAOQGUKG3LWR6BFWXKGWF75TS75VX7IOBKHOSXJCW3';
const SLICE = 'CDDYOTZUTLLEQST7VVQPUL3XVXJERHQGJ246SA2RWCRROOQQPQKJTGZC';

console.log(`\n--- Initializing Staking Vault ---`);
try {
    run(`stellar contract invoke --id ${STAKING_VAULT} --source-account admin --network testnet -- initialize --slice ${SLICE} --cheese ${tokens.CHEESE} --pepperoni ${tokens.PEPPERONI} --bacon ${tokens.BACON} --onion ${tokens.ONION}`);
    console.log('Staking Vault initialized!');
} catch (e) {
    console.log('Initialization failed or already initialized.');
}

console.log('Done!');
