from web3 import Web3
import json
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to Sepolia
alchemy_key = os.getenv('ALCHEMY_API_KEY')
w3 = Web3(Web3.HTTPProvider(f'https://eth-sepolia.g.alchemy.com/v2/{alchemy_key}'))

# Load contract ABI
contract_path = os.path.join(os.path.dirname(__file__), '..', 'blockchain', 'build', 'contracts', 'AidTrace.json')
with open(contract_path) as f:
    contract_json = json.load(f)
    abi = contract_json['abi']

contract_address = os.getenv('SEPOLIA_CONTRACT_ADDRESS')
contract = w3.eth.contract(address=Web3.to_checksum_address(contract_address), abi=abi)

print("=" * 80)
print("BLOCKCHAIN INPUT DATA DECODER")
print("=" * 80)

# Example: Check a transaction hash (replace with actual tx hash from your database)
tx_hash = input("\nEnter transaction hash to decode (or press Enter to skip): ").strip()

if tx_hash:
    try:
        tx = w3.eth.get_transaction(tx_hash)
        print(f"\n{'='*80}")
        print(f"Transaction: {tx_hash}")
        print(f"{'='*80}")
        print(f"From: {tx['from']}")
        print(f"To: {tx['to']}")
        print(f"Value: {w3.from_wei(tx['value'], 'ether')} ETH")
        print(f"Gas Used: {tx['gas']}")
        print(f"\nInput Data (Raw):")
        print(tx['input'][:200] + "..." if len(tx['input']) > 200 else tx['input'])
        
        # Decode input data
        try:
            func_obj, func_params = contract.decode_function_input(tx['input'])
            print(f"\n{'='*80}")
            print(f"DECODED FUNCTION: {func_obj.fn_name}")
            print(f"{'='*80}")
            print("\nParameters:")
            for param, value in func_params.items():
                print(f"  {param}: {value}")
        except Exception as e:
            print(f"\nCould not decode: {e}")
            
    except Exception as e:
        print(f"Error fetching transaction: {e}")

# Show all available functions
print(f"\n{'='*80}")
print("AVAILABLE CONTRACT FUNCTIONS & THEIR INPUT DATA")
print(f"{'='*80}")

functions = [
    {
        'name': 'linkNGOWallet',
        'params': ['uint256 ngoId', 'address wallet', 'string name', 'string licenseNumber'],
        'stores': 'NGO registration details'
    },
    {
        'name': 'createProject',
        'params': ['uint256 projectId', 'string title', 'string description', 'string location', 'string items', 'uint256 fundingGoal'],
        'stores': 'Complete project details'
    },
    {
        'name': 'recordFunding',
        'params': ['uint256 projectId', 'address donorWallet', 'address ngoWallet', 'uint256 amount'],
        'stores': 'Funding transaction details'
    },
    {
        'name': 'confirmFunding',
        'params': ['uint256 projectId', 'uint256 fundingId', 'string ngoSignature', 'string donorSignature'],
        'stores': 'Digital signatures confirming funding'
    },
    {
        'name': 'createQuoteRequest',
        'params': ['uint256 projectId', 'string projectTitle', 'string location', 'string items', 'string deliveryDate'],
        'stores': 'Supply request details'
    },
    {
        'name': 'submitSupplierQuote',
        'params': ['uint256 quoteRequestId', 'uint256 projectId', 'uint256 quotedAmount', 'string deliveryTerms', 'string signature'],
        'stores': 'Supplier bid and terms'
    },
    {
        'name': 'selectQuote',
        'params': ['uint256 quoteId', 'uint256 projectId', 'address selectedSupplier', 'uint256 selectedAmount', 'string ngoSignature'],
        'stores': 'Selected supplier and contract amount'
    },
    {
        'name': 'recordSupplierConfirmation',
        'params': ['uint256 projectId', 'string projectTitle', 'string deliveryLocation', 'address supplierAddress', 'string signature'],
        'stores': 'Supplier delivery confirmation'
    },
    {
        'name': 'recordFieldOfficerConfirmation',
        'params': ['uint256 projectId', 'string projectTitle', 'string projectLocation', 'address officerAddress', 'string signature'],
        'stores': 'Field officer receipt confirmation'
    }
]

for func in functions:
    print(f"\n{func['name']}()")
    print(f"  Stores: {func['stores']}")
    print(f"  Input Data Contains:")
    for param in func['params']:
        print(f"    - {param}")

print(f"\n{'='*80}")
print("NOTE: All input data is ABI-encoded and stored permanently on Sepolia blockchain")
print("Each transaction hash can be verified at: https://sepolia.etherscan.io/tx/<hash>")
print(f"{'='*80}\n")
