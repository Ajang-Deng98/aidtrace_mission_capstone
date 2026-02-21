#!/usr/bin/env python3
from web3 import Web3

# Your private key from .env
private_key = "0x6fd7f85f80bbcc6c367fd3d01bc9c91732de29d01e1bbf3b37a77bdb73b473c0"

# Derive wallet address
w3 = Web3()
account = w3.eth.account.from_key(private_key)

print("🔑 Your Wallet Address (derived from private key):")
print(f"   {account.address}")
print()
print("📍 Your Contract Address:")
print(f"   0x8Cd0e455153580630c6c625855aA121510935EA0")
print()
print("⚠️  You need ETH in your WALLET address to pay gas fees!")
print("💡 Update the faucet to mine to your wallet address instead.")