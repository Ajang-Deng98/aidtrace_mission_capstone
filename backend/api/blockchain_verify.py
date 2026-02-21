from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .blockchain import blockchain_service
import json

@require_http_methods(["GET"])
def verify_transaction(request, tx_hash):
    """Verify transaction hash on blockchain"""
    try:
        if not blockchain_service.is_connected:
            return JsonResponse({'error': 'Blockchain not connected'}, status=503)
        
        # Get transaction receipt
        receipt = blockchain_service.w3.eth.get_transaction_receipt(tx_hash)
        transaction = blockchain_service.w3.eth.get_transaction(tx_hash)
        
        # Get current block for confirmations
        current_block = blockchain_service.w3.eth.block_number
        confirmations = current_block - receipt.blockNumber
        
        return JsonResponse({
            'verified': True,
            'transaction_hash': tx_hash,
            'block_number': receipt.blockNumber,
            'confirmations': confirmations,
            'gas_used': receipt.gasUsed,
            'status': receipt.status,
            'from_address': transaction['from'],
            'to_address': transaction['to'],
            'network': 'Sepolia' if blockchain_service.w3.eth.chain_id == 11155111 else 'Local',
            'etherscan_url': f"https://sepolia.etherscan.io/tx/{tx_hash}" if blockchain_service.w3.eth.chain_id == 11155111 else None
        })
    
    except Exception as e:
        return JsonResponse({'verified': False, 'error': str(e)}, status=400)

@require_http_methods(["GET"])
def get_contract_info(request):
    """Get contract information and verification"""
    try:
        if not blockchain_service.contract:
            return JsonResponse({'error': 'Contract not loaded'}, status=503)
        
        return JsonResponse({
            'contract_address': blockchain_service.contract.address,
            'network': 'Sepolia' if blockchain_service.w3.eth.chain_id == 11155111 else 'Local',
            'chain_id': blockchain_service.w3.eth.chain_id,
            'latest_block': blockchain_service.w3.eth.block_number,
            'etherscan_url': f"https://sepolia.etherscan.io/address/{blockchain_service.contract.address}" if blockchain_service.w3.eth.chain_id == 11155111 else None
        })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)