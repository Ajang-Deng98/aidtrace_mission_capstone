#!/usr/bin/env python3
import os
import sys
import django
from pathlib import Path

project_root = Path(__file__).parent / "backend"
sys.path.append(str(project_root))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aidtrace.settings')
django.setup()

from api.blockchain import blockchain_service

def test_connection():
    print("Testing blockchain connection...")
    if blockchain_service.is_connected:
        print(f"✅ Connected to: {blockchain_service.w3.provider.endpoint_uri}")
        print(f"Chain ID: {blockchain_service.w3.eth.chain_id}")
        print(f"Latest block: {blockchain_service.w3.eth.block_number}")
        
        if blockchain_service.contract:
            print(f"✅ Contract loaded at: {blockchain_service.contract.address}")
            return True
        else:
            print("❌ Contract not loaded")
            return False
    else:
        print("❌ Not connected to blockchain")
        return False

if __name__ == "__main__":
    test_connection()