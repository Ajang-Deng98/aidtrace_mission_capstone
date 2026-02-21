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

def verify_transaction(tx_hash):
    """Verify and display transaction details"""
    print(f"🔍 Verifying Transaction: {tx_hash}")
    print("=" * 80)
    
    try:
        # Get transaction receipt
        receipt = blockchain_service.w3.eth.get_transaction_receipt(tx_hash)
        transaction = blockchain_service.w3.eth.get_transaction(tx_hash)
        
        print(f"✅ Transaction Found!")
        print(f"📊 Block Number: {receipt.blockNumber}")
        print(f"⛽ Gas Used: {receipt.gasUsed}")
        print(f"📍 From: {transaction['from']}")
        print(f"📍 To: {transaction['to']} (Contract)")
        print(f"💰 Value: {transaction['value']} ETH")
        print(f"✅ Status: {'Success' if receipt.status == 1 else 'Failed'}")
        
        # Get current confirmations
        current_block = blockchain_service.w3.eth.block_number
        confirmations = current_block - receipt.blockNumber
        print(f"🔗 Confirmations: {confirmations}")
        
        # Decode logs if available
        if receipt.logs:
            print(f"📝 Events Emitted: {len(receipt.logs)}")
            for i, log in enumerate(receipt.logs):
                print(f"   Event {i+1}: {len(log.topics)} topics, {len(log.data)} bytes data")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("🔗 AidTrace Transaction Verifier")
    print("=" * 80)
    
    if not blockchain_service.is_connected:
        print("❌ Blockchain not connected")
        return
    
    print(f"✅ Connected to Chain ID: {blockchain_service.w3.eth.chain_id}")
    print(f"📍 Contract: {blockchain_service.contract.address}")
    print(f"🧱 Current Block: {blockchain_service.w3.eth.block_number}")
    print()
    
    # Your transaction hashes
    hashes = [
        "0xd65b35c52f5ed2a37d731368b8d9af3473edb4e6d57342999401124d27d26b29",
        "6cde99e3a84b4d90ffe75f35c0aff485646aa011ce8bc7241f35a434bf49510f"
    ]
    
    for i, tx_hash in enumerate(hashes, 1):
        print(f"\n{i}️⃣ Transaction {i}")
        verify_transaction(tx_hash)
        print()

if __name__ == "__main__":
    main()