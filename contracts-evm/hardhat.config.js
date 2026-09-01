require("@nomicfoundation/hardhat-toolbox");
const fs = require("fs");
const path = require("path");

function getPrivateKey() {
  try {
    const envPath = path.resolve(__dirname, ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const match = content.match(/PRIVATE_KEY=([^\r\n]+)/);
      if (match) {
        const pk = match[1].trim();
        return pk.startsWith("0x") ? pk : "0x" + pk;
      }
    }
  } catch (e) {}
  const envPk = process.env.PRIVATE_KEY;
  if (envPk) return envPk.startsWith("0x") ? envPk : "0x" + envPk;
  return "";
}

const pk = getPrivateKey();
const accounts = pk ? [pk] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "cancun",
    },
  },
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {},
    avalancheFuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: accounts,
    },
    avalancheMainnet: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: accounts,
    },
  },
};
