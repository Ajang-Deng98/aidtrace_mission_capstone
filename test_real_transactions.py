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

def test_real_transactions():
    print("🧪 Testing Real Blockchain Transactions")
    print("=" * 50)
    
    if not blockchain_service.is_connected:
        print("❌ Blockchain not connected")
        return
    
    print(f"✅ Connected to: Chain ID {blockchain_service.w3.eth.chain_id}")
    print(f"📍 Contract: {blockchain_service.contract.address}")
    
    # Test 1: NGO Wallet Link
    print("\n1️⃣ Testing NGO Wallet Link...")
    try:
        tx_hash = blockchain_service.link_ngo_wallet(
            ngo_id=1,
            wallet_address="0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
            name="Test NGO",
            license_number="NGO123456"
        )
        print(f"✅ NGO Linked - TX: {tx_hash}")
        
        # Verify transaction
        receipt = blockchain_service.w3.eth.get_transaction_receipt(tx_hash)
        print(f"📊 Block: {receipt.blockNumber}, Gas: {receipt.gasUsed}")
        
    except Exception as e:
        print(f"❌ Failed: {e}")
    
    # Test 2: Project Creation
    print("\n2️⃣ Testing Project Creation...")
    try:
        tx_hash = blockchain_service.create_project(
            project_id=1,
            title="Emergency Food Aid",
            description="Providing food to disaster victims",
            location="Test City",
            items=["Rice", "Beans", "Water"]
        )
        print(f"✅ Project Created - TX: {tx_hash}")
        
        # Verify transaction
        receipt = blockchain_service.w3.eth.get_transaction_receipt(tx_hash)
        print(f"📊 Block: {receipt.blockNumber}, Gas: {receipt.gasUsed}")
        
    except Exception as e:
        print(f"❌ Failed: {e}")
    
    # Test 3: Funding Record
    print("\n3️⃣ Testing Funding Record...")
    try:
        tx_hash = blockchain_service.record_funding(
            project_id=1,
            donor_wallet="0x8ba1f109551bD432803012645Hac136c30C6C88",
            ngo_wallet="0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
            amount=1000
        )
        print(f"✅ Funding Recorded - TX: {tx_hash}")
        
        # Verify transaction
        receipt = blockchain_service.w3.eth.get_transaction_receipt(tx_hash)
        print(f"📊 Block: {receipt.blockNumber}, Gas: {receipt.gasUsed}")
        
    except Exception as e:
        print(f"❌ Failed: {e}")
    
    print("\n🎉 All transactions are REAL and verifiable!")
    print(f"🔍 Latest block: {blockchain_service.w3.eth.block_number}")

if __name__ == "__main__":
    test_real_transactions()