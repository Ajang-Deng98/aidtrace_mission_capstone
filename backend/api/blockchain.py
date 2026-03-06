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
    
    def create_project(self, project_id, title, description, location, items, funding_goal=0):
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
                json.dumps(items),
                int(float(funding_goal))
            ).build_transaction({})
            tx_hash = self.send_transaction(transaction)
        else:
            # Local Ganache - use transact
            tx_hash = self.contract.functions.createProject(
                int(project_id),
                title,
                description,
                location,
                json.dumps(items),
                int(float(funding_goal))
            ).transact({'from': account})
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt.transactionHash.hex()
    
    def record_funding(self, project_id, donor_wallet, ngo_wallet, amount):
        if not self.contract or not self.is_connected:
            raise Exception("Blockchain not available")
        
        # Handle empty or invalid wallet addresses - use default account
        account = self.get_account()
        if not donor_wallet or len(donor_wallet) < 42:
            donor_wallet = account
        if not ngo_wallet or len(ngo_wallet) < 42:
            ngo_wallet = account
        
        # Ensure addresses are valid Ethereum addresses
        try:
            donor_wallet = Web3.to_checksum_address(donor_wallet)
            ngo_wallet = Web3.to_checksum_address(ngo_wallet)
        except Exception as e:
            # If invalid, use default account
            donor_wallet = account
            ngo_wallet = account
        
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
    
    def confirm_funding(self, project_id, funding_id, ngo_signature, donor_signature):
        """Record NGO funding confirmation on blockchain"""
        print(f"[BLOCKCHAIN] confirm_funding called: project={project_id}, funding={funding_id}")
        if not self.contract or not self.is_connected:
            print("[BLOCKCHAIN] ERROR: Not connected or no contract")
            raise Exception("Blockchain not available")
        
        account = self.get_account()
        print(f"[BLOCKCHAIN] Using account: {account}")
        
        if hasattr(settings, 'BLOCKCHAIN_PRIVATE_KEY') and settings.BLOCKCHAIN_PRIVATE_KEY:
            print("[BLOCKCHAIN] Building transaction for Sepolia...")
            transaction = self.contract.functions.confirmFunding(
                int(project_id),
                int(funding_id),
                ngo_signature,
                donor_signature
            ).build_transaction({})
            print("[BLOCKCHAIN] Sending transaction...")
            tx_hash = self.send_transaction(transaction)
            print(f"[BLOCKCHAIN] Transaction sent: {tx_hash.hex()}")
        else:
            print("[BLOCKCHAIN] Using local Ganache...")
            tx_hash = self.contract.functions.confirmFunding(
                int(project_id),
                int(funding_id),
                ngo_signature,
                donor_signature
            ).transact({'from': account})
        
        print("[BLOCKCHAIN] Waiting for receipt...")
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        result = receipt.transactionHash.hex()
        print(f"[BLOCKCHAIN] SUCCESS! Hash: {result}")
        return result
    
    def create_quote_request(self, project_id, project_title, location, items, delivery_date):
        if not self.contract or not self.is_connected:
            raise Exception("Blockchain not available")
        
        account = self.get_account()
        
        if hasattr(settings, 'BLOCKCHAIN_PRIVATE_KEY') and settings.BLOCKCHAIN_PRIVATE_KEY:
            transaction = self.contract.functions.createQuoteRequest(
                int(project_id),
                project_title,
                location,
                json.dumps(items),
                delivery_date
            ).build_transaction({})
            tx_hash = self.send_transaction(transaction)
        else:
            tx_hash = self.contract.functions.createQuoteRequest(
                int(project_id),
                project_title,
                location,
                json.dumps(items),
                delivery_date
            ).transact({'from': account})
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt.transactionHash.hex()
    
    def submit_supplier_quote(self, quote_request_id, project_id, quoted_amount, delivery_terms, signature):
        if not self.contract or not self.is_connected:
            raise Exception("Blockchain not available")
        
        account = self.get_account()
        
        if hasattr(settings, 'BLOCKCHAIN_PRIVATE_KEY') and settings.BLOCKCHAIN_PRIVATE_KEY:
            transaction = self.contract.functions.submitSupplierQuote(
                int(quote_request_id),
                int(project_id),
                int(float(quoted_amount)),
                delivery_terms,
                signature
            ).build_transaction({})
            tx_hash = self.send_transaction(transaction)
        else:
            tx_hash = self.contract.functions.submitSupplierQuote(
                int(quote_request_id),
                int(project_id),
                int(float(quoted_amount)),
                delivery_terms,
                signature
            ).transact({'from': account})
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt.transactionHash.hex()
    
    def select_quote(self, quote_id, project_id, selected_supplier, selected_amount, ngo_signature):
        if not self.contract or not self.is_connected:
            raise Exception("Blockchain not available")
        
        if not selected_supplier or len(selected_supplier) < 42:
            selected_supplier = self.get_account()
        
        try:
            selected_supplier = Web3.to_checksum_address(selected_supplier.lower())
        except Exception as e:
            raise Exception(f"Invalid supplier address format: {e}")
        
        account = self.get_account()
        
        if hasattr(settings, 'BLOCKCHAIN_PRIVATE_KEY') and settings.BLOCKCHAIN_PRIVATE_KEY:
            transaction = self.contract.functions.selectQuote(
                int(quote_id),
                int(project_id),
                selected_supplier,
                int(float(selected_amount)),
                ngo_signature
            ).build_transaction({})
            tx_hash = self.send_transaction(transaction)
        else:
            tx_hash = self.contract.functions.selectQuote(
                int(quote_id),
                int(project_id),
                selected_supplier,
                int(float(selected_amount)),
                ngo_signature
            ).transact({'from': account})
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt.transactionHash.hex()

    def record_supplier_confirmation(self, project_id, project_title, delivery_location, supplier_address, signature):
        if not self.contract or not self.is_connected:
            raise Exception("Blockchain not available")
        
        if not supplier_address or supplier_address == '' or len(supplier_address) < 42:
            supplier_address = self.get_account()
        
        try:
            supplier_address = Web3.to_checksum_address(supplier_address.lower())
        except Exception as e:
            raise Exception(f"Invalid supplier address format: {e}")
        
        account = self.get_account()
        
        if hasattr(settings, 'BLOCKCHAIN_PRIVATE_KEY') and settings.BLOCKCHAIN_PRIVATE_KEY:
            transaction = self.contract.functions.recordSupplierConfirmation(
                int(project_id),
                project_title,
                delivery_location,
                supplier_address,
                signature
            ).build_transaction({})
            tx_hash = self.send_transaction(transaction)
        else:
            tx_hash = self.contract.functions.recordSupplierConfirmation(
                int(project_id),
                project_title,
                delivery_location,
                supplier_address,
                signature
            ).transact({'from': account})
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt.transactionHash.hex()
    
    def record_field_officer_confirmation(self, project_id, project_title, project_location, officer_address, signature):
        if not self.contract or not self.is_connected:
            raise Exception("Blockchain not available")
        
        if not officer_address or officer_address == '' or len(officer_address) < 42:
            officer_address = self.get_account()
        
        try:
            officer_address = Web3.to_checksum_address(officer_address.lower())
        except Exception as e:
            raise Exception(f"Invalid officer address format: {e}")
        
        account = self.get_account()
        
        if hasattr(settings, 'BLOCKCHAIN_PRIVATE_KEY') and settings.BLOCKCHAIN_PRIVATE_KEY:
            transaction = self.contract.functions.recordFieldOfficerConfirmation(
                int(project_id),
                project_title,
                project_location,
                officer_address,
                signature
            ).build_transaction({})
            tx_hash = self.send_transaction(transaction)
        else:
            tx_hash = self.contract.functions.recordFieldOfficerConfirmation(
                int(project_id),
                project_title,
                project_location,
                officer_address,
                signature
            ).transact({'from': account})
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt.transactionHash.hex()

blockchain_service = BlockchainService()
