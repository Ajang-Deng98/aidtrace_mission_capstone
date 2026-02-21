#!/usr/bin/env python3
"""
Quick Sepolia Deployment Guide
"""

print("🌐 SEPOLIA DEPLOYMENT STEPS")
print("=" * 50)

print("\n1️⃣ Get Sepolia ETH:")
print("   Visit: https://sepoliafaucet.com/")
print("   Enter your wallet address")

print("\n2️⃣ Get Infura Project ID:")
print("   Visit: https://infura.io/")
print("   Create project and copy Project ID")

print("\n3️⃣ Update blockchain/.env:")
print("   INFURA_PROJECT_ID=your_project_id")
print("   MNEMONIC=your 12 word seed phrase")

print("\n4️⃣ Deploy Contract:")
print("   cd blockchain")
print("   truffle migrate --network sepolia")

print("\n5️⃣ Update backend/.env:")
print("   BLOCKCHAIN_NETWORK=sepolia")
print("   SEPOLIA_CONTRACT_ADDRESS=0x... (from step 4)")

print("\n6️⃣ Test Transactions:")
print("   python verify_all_operations.py")

print("\n7️⃣ View on Etherscan:")
print("   https://sepolia.etherscan.io/tx/YOUR_TX_HASH")

print("\n🎯 After deployment, all your AidTrace transactions")
print("   will be visible on Sepolia Etherscan!")