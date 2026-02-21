#!/usr/bin/env python3
"""
Test AidTrace Blockchain Integration
Tests all blockchain functions and displays real transaction hashes
"""

import os
import sys
import django
from pathlib import Path

# Add Django project to path
project_root = Path(__file__).parent / "backend"
sys.path.append(str(project_root))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aidtrace.settings')
django.setup()

from api.blockchain import blockchain_service
from api.models import User, Project

def test_blockchain_connection():
    """Test blockchain connection"""
    print("🔗 Testing blockchain connection...")
    
    if blockchain_service.is_connected:
        print(f"✅ Connected to: {blockchain_service.w3.provider.endpoint_uri}")
        print(f"📊 Chain ID: {blockchain_service.w3.eth.chain_id}")
        print(f"🧱 Latest block: {blockchain_service.w3.eth.block_number}")
        
        if blockchain_service.contract:
            print(f"📄 Contract loaded at: {blockchain_service.contract.address}")
        else:
            print("⚠️  Contract not loaded")
        
        return True
    else:
        print("❌ Not connected to blockchain")
        return False

def test_ngo_wallet_link():
    """Test NGO wallet linking"""
    print("\n👥 Testing NGO wallet linking...")
    
    try:
        tx_hash = blockchain_service.link_ngo_wallet(
            ngo_id=1,
            wallet_address="0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
            name="Test NGO",
            license_number="NGO123456"
        )
        
        print(f"✅ NGO wallet linked")
        print(f"🔗 Transaction hash: {tx_hash}")
        
        if tx_hash.startswith('0x') and len(tx_hash) == 66:
            print("✅ Real Ethereum transaction hash!")
        else:
            print("⚠️  Mock hash generated (blockchain unavailable)")
        
        return tx_hash
    except Exception as e:
        print(f"❌ NGO wallet link failed: {e}")
        return None

def test_project_creation():
    """Test project creation"""
    print("\n📋 Testing project creation...")
    
    try:
        tx_hash = blockchain_service.create_project(
            project_id=1,
            title="Emergency Food Distribution",
            description="Providing food aid to disaster victims",
            location="Test Location",
            items=["Rice", "Beans", "Water"]
        )
        
        print(f"✅ Project created")
        print(f"🔗 Transaction hash: {tx_hash}")
        
        if tx_hash.startswith('0x') and len(tx_hash) == 66:
            print("✅ Real Ethereum transaction hash!")
        else:
            print("⚠️  Mock hash generated (blockchain unavailable)")
        
        return tx_hash
    except Exception as e:
        print(f"❌ Project creation failed: {e}")
        return None

def test_funding_record():
    """Test funding record"""
    print("\n💰 Testing funding record...")
    
    try:
        tx_hash = blockchain_service.record_funding(
            project_id=1,
            donor_wallet="0x8ba1f109551bD432803012645Hac136c30C6C87",
            ngo_wallet="0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
            amount=1000
        )
        
        print(f"✅ Funding recorded")
        print(f"🔗 Transaction hash: {tx_hash}")
        
        if tx_hash.startswith('0x') and len(tx_hash) == 66:
            print("✅ Real Ethereum transaction hash!")
        else:
            print("⚠️  Mock hash generated (blockchain unavailable)")
        
        return tx_hash
    except Exception as e:
        print(f"❌ Funding record failed: {e}")
        return None

def test_supplier_confirmation():
    """Test supplier confirmation"""
    print("\n🚚 Testing supplier confirmation...")
    
    try:
        tx_hash = blockchain_service.record_supplier_confirmation(
            project_id=1,
            supplier_address="0x123d35Cc6634C0532925a3b8D4C9db96590c6C87",
            signature="supplier_signature_123"
        )
        
        print(f"✅ Supplier confirmation recorded")
        print(f"🔗 Transaction hash: {tx_hash}")
        
        if tx_hash.startswith('0x') and len(tx_hash) == 66:
            print("✅ Real Ethereum transaction hash!")
        else:
            print("⚠️  Mock hash generated (blockchain unavailable)")
        
        return tx_hash
    except Exception as e:
        print(f"❌ Supplier confirmation failed: {e}")
        return None

def test_field_officer_confirmation():
    """Test field officer confirmation"""
    print("\n👮 Testing field officer confirmation...")
    
    try:
        tx_hash = blockchain_service.record_field_officer_confirmation(
            project_id=1,
            officer_address="0x456d35Cc6634C0532925a3b8D4C9db96590c6C87",
            signature="officer_signature_456"
        )
        
        print(f"✅ Field officer confirmation recorded")
        print(f"🔗 Transaction hash: {tx_hash}")
        
        if tx_hash.startswith('0x') and len(tx_hash) == 66:
            print("✅ Real Ethereum transaction hash!")
        else:
            print("⚠️  Mock hash generated (blockchain unavailable)")
        
        return tx_hash
    except Exception as e:
        print(f"❌ Field officer confirmation failed: {e}")
        return None

def main():
    print("🧪 AidTrace Blockchain Test Suite")
    print("=" * 50)
    
    # Test connection
    if not test_blockchain_connection():
        print("\n❌ Cannot proceed without blockchain connection")
        print("\nTo fix:")
        print("1. Start Ganache: ganache-cli --host 0.0.0.0 --port 7545")
        print("2. Deploy contract: python deploy.py local")
        print("3. Run this test again")
        return
    
    # Run all tests
    results = {}
    results['ngo_wallet'] = test_ngo_wallet_link()
    results['project'] = test_project_creation()
    results['funding'] = test_funding_record()
    results['supplier'] = test_supplier_confirmation()
    results['field_officer'] = test_field_officer_confirmation()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary")
    print("=" * 50)
    
    real_hashes = 0
    mock_hashes = 0
    
    for test_name, tx_hash in results.items():
        if tx_hash:
            if tx_hash.startswith('0x') and len(tx_hash) == 66:
                print(f"✅ {test_name}: REAL HASH - {tx_hash}")
                real_hashes += 1
            else:
                print(f"⚠️  {test_name}: MOCK HASH - {tx_hash}")
                mock_hashes += 1
        else:
            print(f"❌ {test_name}: FAILED")
    
    print(f"\n📈 Results: {real_hashes} real hashes, {mock_hashes} mock hashes")
    
    if real_hashes > 0:
        print("🎉 SUCCESS! You're getting real Ethereum transaction hashes!")
        if blockchain_service.w3.eth.chain_id == 11155111:
            print("🌐 These are Sepolia testnet transactions - you can view them on Etherscan!")
        else:
            print("🏠 These are local Ganache transactions")
    else:
        print("⚠️  All hashes are mocked - blockchain connection issues")

if __name__ == "__main__":
    main()