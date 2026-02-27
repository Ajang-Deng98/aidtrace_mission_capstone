require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      gas: 6721975,
      gasPrice: 20000000000
    },
    sepolia: {
      provider: function() {
        return new HDWalletProvider({
          mnemonic: {
            phrase: process.env.MNEMONIC
          },
          providerOrUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
          numberOfAddresses: 1,
          shareNonce: true,
          derivationPath: "m/44'/60'/0'/0/"
        });
      },
      network_id: 11155111,
      gas: 5500000,
      gasPrice: 10000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      networkCheckTimeout: 100000,
      deploymentPollingInterval: 10000
    }
  },
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};