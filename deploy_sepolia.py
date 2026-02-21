#!/usr/bin/env python3
import subprocess
import os
from pathlib import Path

def deploy_to_sepolia():
    """Deploy contract to Sepolia testnet"""
    
    # Check environment variables
    required_vars = ['MNEMONIC', 'INFURA_PROJECT_ID']
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        print(f"❌ Missing environment variables: {', '.join(missing)}")
        print("Add these to your .env file in the blockchain directory")
        return None
    
    blockchain_dir = Path(__file__).parent / "blockchain"
    
    print("🌐 Deploying to Sepolia testnet...")
    print("⏳ This may take 1-2 minutes...")
    
    try:
        # Deploy to Sepolia
        result = subprocess.run(
            ["truffle", "migrate", "--network", "sepolia"],
            cwd=blockchain_dir,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            # Extract contract address
            output = result.stdout
            lines = output.split('\n')
            
            for line in lines:
                if 'AidTrace:' in line and '0x' in line:
                    # Extract address
                    parts = line.split()
                    for part in parts:
                        if part.startswith('0x') and len(part) == 42:
                            contract_address = part
                            print(f"✅ Contract deployed to Sepolia!")
                            print(f"📍 Address: {contract_address}")
                            print(f"🔍 View on Etherscan: https://sepolia.etherscan.io/address/{contract_address}")
                            
                            # Update .env file
                            env_path = Path(__file__).parent / "backend" / ".env"
                            with open(env_path, 'a') as f:
                                f.write(f"\\nSEPOLIA_CONTRACT_ADDRESS={contract_address}\\n")
                            
                            print(f"✅ Updated .env file")
                            return contract_address
            
            print("❌ Could not extract contract address from output")
            print("Output:", output)
        else:
            print("❌ Deployment failed:")
            print(result.stderr)
    
    except Exception as e:
        print(f"❌ Deployment error: {e}")
    
    return None

if __name__ == "__main__":
    deploy_to_sepolia()