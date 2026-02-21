from web3 import Web3
from django.conf import settings
import json
import os
import logging

logger = logging.getLogger(__name__)

class BlockchainService:
    def __init__(self):
        self.w3 = None
        self.contract = None
        self.is_connected = False
        self.connect_to_blockchain()
    
    def connect_to_blockchain(self):
        """Initialize blockchain connection"""
        try:
            self.w3 = Web3(Web3.HTTPProvider(settings.WEB3_PROVIDER))
            self.is_connected = self.w3.is_connected()
            
            if self.is_connected:
                logger.info(f"Connected to blockchain: {settings.WEB3_PROVIDER}")
                logger.info(f"Chain ID: {self.w3.eth.chain_id}")
                logger.info(f"Latest block: {self.w3.eth.block_number}")
                
                if settings.CONTRACT_ADDRESS and settings.CONTRACT_ADDRESS != '0x1234567890abcdef1234567890abcdef12345678':
                    self.load_contract()
                else:
                    logger.warning("No valid contract address configured")
            else:
                logger.error(f"Failed to connect to blockchain: {settings.WEB3_PROVIDER}")
                
        except Exception as e:
            logger.error(f"Blockchain connection failed: {e}")
            self.is_connected = False
    
    def load_contract(self):
        """Load smart contract ABI and create contract instance"""
        try:
            contract_path = os.path.join(settings.BASE_DIR.parent, 'blockchain', 'build', 'contracts', 'AidTrace.json')
            if os.path.exists(contract_path):
                with open(contract_path) as f:
                    contract_json = json.load(f)
                    abi = contract_json['abi']
                    self.contract = self.w3.eth.contract(
                        address=Web3.to_checksum_address(settings.CONTRACT_ADDRESS),
                        abi=abi
                    )
                logger.info(f"Contract loaded at: {settings.CONTRACT_ADDRESS}")
            else:
                logger.error(f"Contract ABI not found at: {contract_path}")
                logger.info("Run 'truffle compile' in blockchain directory to generate ABI")
        except Exception as e:
            logger.error(f"Contract loading failed: {e}")
            self.contract = None
    
    def get_account(self):
        """Get account for transactions"""
        if hasattr(settings, 'BLOCKCHAIN_PRIVATE_KEY') and settings.BLOCKCHAIN_PRIVATE_KEY:
            account = self.w3.eth.account.from_key(settings.BLOCKCHAIN_PRIVATE_KEY)
            return account.address
        elif self.w3.eth.accounts:
            return self.w3.eth.accounts[0]
        else:
            raise Exception("No account available for transactions")
    
    def send_transaction(self, transaction):
        """Send signed transaction for Sepolia/Infura"""
        if hasattr(settings, 'BLOCKCHAIN_PRIVATE_KEY') and settings.BLOCKCHAIN_PRIVATE_KEY:
            # Sign and send transaction for Sepolia
            account = self.w3.eth.account.from_key(settings.BLOCKCHAIN_PRIVATE_KEY)
            transaction['from'] = account.address
            transaction['nonce'] = self.w3.eth.get_transaction_count(account.address)
            transaction['gas'] = 500000
            transaction['maxFeePerGas'] = self.w3.to_wei('20', 'gwei')
            transaction['maxPriorityFeePerGas'] = self.w3.to_wei('1', 'gwei')
            
            signed_txn = self.w3.eth.account.sign_transaction(transaction, settings.BLOCKCHAIN_PRIVATE_KEY)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.raw_transaction)
            return tx_hash
        else:
            # Use transact for local Ganache
            return transaction.transact()
    
    def link_ngo_wallet(self, ngo_id, wallet_address, name, license_number):
        """Link NGO wallet address to blockchain"""
        if not self.contract or not self.is_connected:
            raise Exception("Blockchain not available")
        
        account = self.get_account()
        
        if hasattr(settings, 'BLOCKCHAIN_PRIVATE_KEY') and settings.BLOCKCHAIN_PRIVATE_KEY:
            # Sepolia - use signed transaction
            transaction = self.contract.functions.linkNGOWallet(
                int(ngo_id),
                Web3.to_checksum_address(wallet_address),
                name,
                license_number
            ).build_transaction({})
            tx_hash = self.send_transaction(transaction)
        else:
            # Local Ganache - use transact
            tx_hash = self.contract.functions.linkNGOWallet(
                int(ngo_id),
                Web3.to_checksum_address(wallet_address),
                name,
                license_number
            ).transact({'from': account})
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt.transactionHash.hex()
    
    def create_project(self, project_id, title, description, location, items):
        if not self.contract or not self.is_connected:
            raise Exception("Blockchain not available")
        
        account = self.get_account()
        
        if hasattr(settings, 'BLOCKCHAIN_PRIVATE_KEY') and settings.BLOCKCHAIN_PRIVATE_KEY:
            # Sepolia - use signed transaction
            transaction = self.contract.functions.createProject(
                int(project_id),
                title,
                description,
                location,
                json.dumps(items)
            ).build_transaction({})
            tx_hash = self.send_transaction(transaction)
        else:
            # Local Ganache - use transact
            tx_hash = self.contract.functions.createProject(
                int(project_id),
                title,
                description,
                location,
                json.dumps(items)
            ).transact({'from': account})
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt.transactionHash.hex()
    
    def record_funding(self, project_id, donor_wallet, ngo_wallet, amount):
        if not self.contract or not self.is_connected:
            raise Exception("Blockchain not available")
        
        # Handle empty or None wallet addresses
        if not donor_wallet or donor_wallet == '':
            donor_wallet = self.get_account()
        if not ngo_wallet or ngo_wallet == '':
            ngo_wallet = self.get_account()
        
        # Ensure addresses are valid and properly formatted
        try:
            donor_wallet = Web3.to_checksum_address(donor_wallet.lower())
            ngo_wallet = Web3.to_checksum_address(ngo_wallet.lower())
        except Exception as e:
            raise Exception(f"Invalid wallet address format: {e}")
        
        account = self.get_account()
        
        if hasattr(settings, 'BLOCKCHAIN_PRIVATE_KEY') and settings.BLOCKCHAIN_PRIVATE_KEY:
            # Sepolia - use signed transaction
            transaction = self.contract.functions.recordFunding(
                int(project_id),
                donor_wallet,
                ngo_wallet,
                int(float(amount))
            ).build_transaction({})
            tx_hash = self.send_transaction(transaction)
        else:
            # Local Ganache - use transact
            tx_hash = self.contract.functions.recordFunding(
                int(project_id),
                donor_wallet,
                ngo_wallet,
                int(float(amount))
            ).transact({'from': account})
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt.transactionHash.hex()
    
    def record_supplier_confirmation(self, project_id, supplier_address, signature):
        if not self.contract or not self.is_connected:
            raise Exception("Blockchain not available")
        
        # Handle empty or invalid supplier address
        if not supplier_address or supplier_address == '' or len(supplier_address) < 42:
            supplier_address = self.get_account()
        
        # Ensure address is valid
        try:
            supplier_address = Web3.to_checksum_address(supplier_address.lower())
        except Exception as e:
            raise Exception(f"Invalid supplier address format: {e}")
        
        account = self.get_account()
        
        if hasattr(settings, 'BLOCKCHAIN_PRIVATE_KEY') and settings.BLOCKCHAIN_PRIVATE_KEY:
            # Sepolia - use signed transaction
            transaction = self.contract.functions.recordSupplierConfirmation(
                int(project_id),
                supplier_address,
                signature
            ).build_transaction({})
            tx_hash = self.send_transaction(transaction)
        else:
            # Local Ganache - use transact
            tx_hash = self.contract.functions.recordSupplierConfirmation(
                int(project_id),
                supplier_address,
                signature
            ).transact({'from': account})
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt.transactionHash.hex()
    
    def record_field_officer_confirmation(self, project_id, officer_address, signature):
        if not self.contract or not self.is_connected:
            raise Exception("Blockchain not available")
        
        # Handle empty or invalid officer address
        if not officer_address or officer_address == '' or len(officer_address) < 42:
            officer_address = self.get_account()
        
        # Ensure address is valid
        try:
            officer_address = Web3.to_checksum_address(officer_address.lower())
        except Exception as e:
            raise Exception(f"Invalid officer address format: {e}")
        
        account = self.get_account()
        
        if hasattr(settings, 'BLOCKCHAIN_PRIVATE_KEY') and settings.BLOCKCHAIN_PRIVATE_KEY:
            # Sepolia - use signed transaction
            transaction = self.contract.functions.recordFieldOfficerConfirmation(
                int(project_id),
                officer_address,
                signature
            ).build_transaction({})
            tx_hash = self.send_transaction(transaction)
        else:
            # Local Ganache - use transact
            tx_hash = self.contract.functions.recordFieldOfficerConfirmation(
                int(project_id),
                officer_address,
                signature
            ).transact({'from': account})
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt.transactionHash.hex()

blockchain_service = BlockchainService()
