#!/usr/bin/env python3
"""
AidTrace Blockchain Deployment Script
Deploys smart contract and updates Django settings
"""

import os
import sys
import json
import subprocess
from pathlib import Path

def run_command(cmd, cwd=None):
    """Run shell command and return output"""
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error: {result.stderr}")
            return None
        return result.stdout.strip()
    except Exception as e:
        print(f"Command failed: {e}")
        return None

def deploy_local():
    """Deploy to local Ganache"""
    print("🚀 Deploying to local Ganache...")
    
    # Start in blockchain directory
    blockchain_dir = Path(__file__).parent / "blockchain"
    
    # Install dependencies
    print("📦 Installing dependencies...")
    run_command("npm install", cwd=blockchain_dir)
    
    # Compile contracts
    print("🔨 Compiling contracts...")
    run_command("truffle compile", cwd=blockchain_dir)
    
    # Deploy contracts
    print("📤 Deploying contracts...")
    output = run_command("truffle migrate --reset", cwd=blockchain_dir)
    
    if output:
        # Extract contract address from output
        lines = output.split('\n')
        contract_address = None
        for line in lines:
            if 'AidTrace:' in line and '0x' in line:
                contract_address = line.split('0x')[1].split()[0]
                contract_address = '0x' + contract_address
                break
        
        if contract_address:
            print(f"✅ Contract deployed at: {contract_address}")
            
            # Update .env file
            env_path = Path(__file__).parent / "backend" / ".env"
            env_content = f"LOCAL_CONTRACT_ADDRESS={contract_address}\n"
            
            if env_path.exists():
                with open(env_path, 'r') as f:
                    existing = f.read()
                if 'LOCAL_CONTRACT_ADDRESS' not in existing:
                    with open(env_path, 'a') as f:
                        f.write(env_content)
            else:
                with open(env_path, 'w') as f:
                    f.write(env_content)
            
            print(f"✅ Updated .env with contract address")
            return contract_address
    
    return None

def deploy_sepolia():
    """Deploy to Sepolia testnet"""
    print("🌐 Deploying to Sepolia testnet...")
    
    # Check environment variables
    required_vars = ['MNEMONIC', 'INFURA_PROJECT_ID']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("Please set these in your .env file")
        return None
    
    blockchain_dir = Path(__file__).parent / "blockchain"
    
    # Deploy to Sepolia
    output = run_command("truffle migrate --network sepolia", cwd=blockchain_dir)
    
    if output:
        # Extract contract address
        lines = output.split('\n')
        contract_address = None
        for line in lines:
            if 'AidTrace:' in line and '0x' in line:
                contract_address = line.split('0x')[1].split()[0]
                contract_address = '0x' + contract_address
                break
        
        if contract_address:
            print(f"✅ Contract deployed to Sepolia at: {contract_address}")
            print(f"🔍 View on Etherscan: https://sepolia.etherscan.io/address/{contract_address}")
            
            # Update .env file
            env_path = Path(__file__).parent / "backend" / ".env"
            env_content = f"SEPOLIA_CONTRACT_ADDRESS={contract_address}\n"
            
            if env_path.exists():
                with open(env_path, 'a') as f:
                    f.write(env_content)
            else:
                with open(env_path, 'w') as f:
                    f.write(env_content)
            
            return contract_address
    
    return None

def main():
    if len(sys.argv) < 2:
        print("Usage: python deploy.py [local|sepolia]")
        sys.exit(1)
    
    network = sys.argv[1].lower()
    
    if network == "local":
        contract_address = deploy_local()
    elif network == "sepolia":
        contract_address = deploy_sepolia()
    else:
        print("Invalid network. Use 'local' or 'sepolia'")
        sys.exit(1)
    
    if contract_address:
        print(f"\n🎉 Deployment successful!")
        print(f"Contract Address: {contract_address}")
        print(f"Network: {network}")
        print(f"\nNext steps:")
        print(f"1. Update your Django settings with the contract address")
        print(f"2. Restart your Django server")
        print(f"3. Test blockchain functionality")
    else:
        print("❌ Deployment failed")
        sys.exit(1)

if __name__ == "__main__":
    main()