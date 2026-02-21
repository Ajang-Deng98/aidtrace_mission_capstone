# Blockchain Setup Guide

## 1. Install Ganache CLI (Local Ethereum)
```bash
npm install -g ganache-cli
```

## 2. Start Local Blockchain
```bash
ganache-cli --host 0.0.0.0 --port 7545 --accounts 10 --deterministic
```

## 3. Deploy Smart Contract
```bash
cd blockchain
npm install
truffle compile
truffle migrate --reset
```

## 4. Update Contract Address
After deployment, copy the contract address from migration output and update settings.py

## 5. For Sepolia Testnet (Real Ethereum)
1. Get Sepolia ETH from faucet: https://sepoliafaucet.com/
2. Create Infura account: https://infura.io/
3. Update truffle-config.js with Sepolia network
4. Deploy to Sepolia: `truffle migrate --network sepolia`