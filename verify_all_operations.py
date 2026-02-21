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

def test_all_operations():
    print("COMPREHENSIVE BLOCKCHAIN TEST")
    print("=" * 60)
    
    if not blockchain_service.is_connected:
        print("❌ Blockchain not connected")
        return False
    
    print(f"✅ Connected: Chain ID {blockchain_service.w3.eth.chain_id}")
    print(f"📍 Contract: {blockchain_service.contract.address}")
    
    results = {}
    
    # Test 1: NGO Wallet Link
    print("\n1️⃣ NGO Wallet Link")
    try:
        tx_hash = blockchain_service.link_ngo_wallet(1, "0x742d35cc6634c0532925a3b8d4c9db96590c6c88", "Test NGO", "NGO123")
        receipt = blockchain_service.w3.eth.get_transaction_receipt(tx_hash)
        results['ngo_link'] = {'hash': tx_hash, 'block': receipt.blockNumber, 'gas': receipt.gasUsed}
        print(f"✅ Hash: {tx_hash}")
        print(f"📊 Block: {receipt.blockNumber}, Gas: {receipt.gasUsed}")
    except Exception as e:
        results['ngo_link'] = {'error': str(e)}
        print(f"❌ Error: {e}")
    
    # Test 2: Project Creation
    print("\n2️⃣ Project Creation")
    try:
        tx_hash = blockchain_service.create_project(1, "Food Aid", "Emergency food distribution", "Test City", ["Rice", "Beans"])
        receipt = blockchain_service.w3.eth.get_transaction_receipt(tx_hash)
        results['project_creation'] = {'hash': tx_hash, 'block': receipt.blockNumber, 'gas': receipt.gasUsed}
        print(f"✅ Hash: {tx_hash}")
        print(f"📊 Block: {receipt.blockNumber}, Gas: {receipt.gasUsed}")
    except Exception as e:
        results['project_creation'] = {'error': str(e)}
        print(f"❌ Error: {e}")
    
    # Test 3: Funding Record
    print("\n3️⃣ Funding Record")
    try:
        tx_hash = blockchain_service.record_funding(1, "0x742d35cc6634c0532925a3b8d4c9db96590c6c88", "0x8ba1f109551bd432803012645aac136c30c6c888", 1000)
        receipt = blockchain_service.w3.eth.get_transaction_receipt(tx_hash)
        results['funding'] = {'hash': tx_hash, 'block': receipt.blockNumber, 'gas': receipt.gasUsed}
        print(f"✅ Hash: {tx_hash}")
        print(f"📊 Block: {receipt.blockNumber}, Gas: {receipt.gasUsed}")
    except Exception as e:
        results['funding'] = {'error': str(e)}
        print(f"❌ Error: {e}")
    
    # Test 4: Supplier Confirmation
    print("\n4️⃣ Supplier Confirmation")
    try:
        tx_hash = blockchain_service.record_supplier_confirmation(1, "0x123d35cc6634c0532925a3b8d4c9db96590c6c88", "supplier_signature_123")
        receipt = blockchain_service.w3.eth.get_transaction_receipt(tx_hash)
        results['supplier'] = {'hash': tx_hash, 'block': receipt.blockNumber, 'gas': receipt.gasUsed}
        print(f"✅ Hash: {tx_hash}")
        print(f"📊 Block: {receipt.blockNumber}, Gas: {receipt.gasUsed}")
    except Exception as e:
        results['supplier'] = {'error': str(e)}
        print(f"❌ Error: {e}")
    
    # Test 5: Field Officer Confirmation
    print("\n5️⃣ Field Officer Confirmation")
    try:
        tx_hash = blockchain_service.record_field_officer_confirmation(1, "0x456d35cc6634c0532925a3b8d4c9db96590c6c88", "officer_signature_456")
        receipt = blockchain_service.w3.eth.get_transaction_receipt(tx_hash)
        results['field_officer'] = {'hash': tx_hash, 'block': receipt.blockNumber, 'gas': receipt.gasUsed}
        print(f"✅ Hash: {tx_hash}")
        print(f"📊 Block: {receipt.blockNumber}, Gas: {receipt.gasUsed}")
    except Exception as e:
        results['field_officer'] = {'error': str(e)}
        print(f"❌ Error: {e}")
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 FINAL RESULTS")
    print("=" * 60)
    
    successful = 0
    total = 5
    
    for operation, result in results.items():
        if 'hash' in result:
            print(f"✅ {operation.upper()}: {result['hash']}")
            successful += 1
        else:
            print(f"❌ {operation.upper()}: {result['error']}")
    
    print(f"\n🎯 SUCCESS RATE: {successful}/{total} operations")
    
    if successful == total:
        print("🎉 ALL BLOCKCHAIN OPERATIONS GENERATE REAL HASHES!")
        print("🔗 Your AidTrace app is fully blockchain-enabled!")
    else:
        print("⚠️  Some operations failed - check errors above")
    
    print(f"🔍 Current block: {blockchain_service.w3.eth.block_number}")
    
    return successful == total

if __name__ == "__main__":
    test_all_operations()