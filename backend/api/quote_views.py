# NGO Quote Request Views
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import *
from .serializers import *
from .auth import require_auth
from .blockchain import blockchain_service

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['NGO'])
def create_quote_request(request):
    """NGO creates supply quote request"""
    try:
        data = json.loads(request.body)
        ngo = User.objects.get(id=request.user_data['user_id'])
        project = Project.objects.get(id=data.get('project_id'))
        
        # Verify NGO owns the project
        if project.ngo != ngo:
            return JsonResponse({'error': 'Unauthorized'}, status=403)
        
        quote_request = SupplyQuoteRequest.objects.create(
            project=project,
            ngo=ngo,
            items=data.get('items'),
            delivery_location=data.get('delivery_location'),
            delivery_date=data.get('delivery_date'),
            proposed_budget=data.get('proposed_budget', 0),
            additional_requirements=data.get('additional_requirements', '')
        )
        
        # Set initial status as OPEN
        quote_request.status = 'OPEN'
        quote_request.save()
        
        # Record on blockchain
        try:
            tx_hash = blockchain_service.create_quote_request(
                project.id,
                project.title,
                quote_request.delivery_location,
                quote_request.items,
                str(quote_request.delivery_date)
            )
            quote_request.blockchain_tx = tx_hash
            quote_request.save()
            print(f"Quote request blockchain hash: {tx_hash}")
            
            # Update project status
            project.status = 'QUOTE_REQUESTED'
            project.save()
            
        except Exception as e:
            print(f"Blockchain quote request failed: {e}")
            import traceback
            print(traceback.format_exc())
        
        return JsonResponse({
            'message': 'Quote request created successfully and recorded on blockchain',
            'quote_request': {
                'id': quote_request.id,
                'project_title': project.title,
                'delivery_location': quote_request.delivery_location,
                'delivery_date': str(quote_request.delivery_date),
                'blockchain_tx': quote_request.blockchain_tx,
                'created_at': quote_request.created_at
            }
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
@require_auth(['NGO'])
def get_ngo_quote_requests(request):
    """Get all quote requests for NGO"""
    ngo = User.objects.get(id=request.user_data['user_id'])
    quote_requests = SupplyQuoteRequest.objects.filter(ngo=ngo).order_by('-created_at')
    
    data = []
    for qr in quote_requests:
        quotes = SupplierQuote.objects.filter(quote_request=qr)
        data.append({
            'id': qr.id,
            'project_id': qr.project.id,
            'project_title': qr.project.title,
            'delivery_location': qr.delivery_location,
            'delivery_date': str(qr.delivery_date),
            'proposed_budget': str(qr.proposed_budget),
            'items': qr.items,
            'additional_requirements': qr.additional_requirements,
            'status': getattr(qr, 'status', 'OPEN'),
            'blockchain_tx': qr.blockchain_tx,
            'quotes_count': quotes.count(),
            'created_at': qr.created_at
        })
    
    return JsonResponse(data, safe=False)

@require_http_methods(["GET"])
@require_auth(['NGO'])
def get_quote_request_quotes(request, quote_request_id):
    """Get all supplier quotes for a specific quote request"""
    try:
        ngo = User.objects.get(id=request.user_data['user_id'])
        quote_request = SupplyQuoteRequest.objects.get(id=quote_request_id, ngo=ngo)
        quotes = SupplierQuote.objects.filter(quote_request=quote_request).order_by('quoted_amount')
        
        # Check if any quote is selected
        selected_quote = QuoteSelection.objects.filter(quote_request=quote_request).first()
        
        data = []
        for quote in quotes:
            is_selected = selected_quote and selected_quote.selected_quote.id == quote.id
            data.append({
                'id': quote.id,
                'supplier_name': quote.supplier.name,
                'supplier_contact': quote.supplier.contact,
                'quoted_amount': str(quote.quoted_amount),
                'delivery_terms': quote.delivery_terms,
                'delivery_timeline': quote.delivery_timeline,
                'payment_terms': quote.payment_terms,
                'warranty_period': quote.warranty_period,
                'quality_certifications': quote.quality_certifications,
                'technical_specifications': quote.technical_specifications,
                'supplier_experience': quote.supplier_experience,
                'references': quote.references,
                'signature': quote.signature,
                'blockchain_tx': quote.blockchain_tx,
                'is_selected': is_selected,
                'created_at': quote.created_at
            })
        
        return JsonResponse({
            'request': {
                'id': quote_request.id,
                'project_title': quote_request.project.title,
                'project_location': quote_request.project.location,
                'delivery_location': quote_request.delivery_location,
                'delivery_date': str(quote_request.delivery_date),
                'proposed_budget': str(quote_request.proposed_budget),
                'items': quote_request.items,
                'additional_requirements': quote_request.additional_requirements,
                'status': quote_request.status,
                'blockchain_tx': quote_request.blockchain_tx,
                'has_selection': bool(selected_quote),
                'created_at': quote_request.created_at
            },
            'quotes': data
        })
        
    except SupplyQuoteRequest.DoesNotExist:
        return JsonResponse({'error': 'Quote request not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['NGO'])
def select_quote(request):
    """NGO selects winning supplier quote and assigns field officer"""
    try:
        data = json.loads(request.body)
        ngo = User.objects.get(id=request.user_data['user_id'])
        
        quote = SupplierQuote.objects.get(id=data.get('quote_id'))
        quote_request = quote.quote_request
        field_officer_id = data.get('field_officer_id')
        
        # Verify NGO owns the quote request
        if quote_request.ngo != ngo:
            return JsonResponse({'error': 'Unauthorized'}, status=403)
        
        # Verify field officer exists and belongs to NGO
        if field_officer_id:
            field_officer = User.objects.get(id=field_officer_id, created_by=ngo, role='FIELD_OFFICER')
        else:
            return JsonResponse({'error': 'Field officer assignment required'}, status=400)
        
        selection = QuoteSelection.objects.create(
            quote_request=quote_request,
            selected_quote=quote,
            ngo=ngo,
            ngo_signature=data.get('ngo_signature')
        )
        
        # Create field officer assignment
        field_assignment = FieldOfficerAssignment.objects.create(
            project=quote_request.project,
            field_officer=field_officer
        )
        
        # Record on blockchain
        try:
            supplier_address = quote.supplier.wallet_address if quote.supplier.wallet_address else blockchain_service.get_account()
            tx_hash = blockchain_service.select_quote(
                quote.id,
                quote_request.project.id,
                supplier_address,
                quote.quoted_amount,
                selection.ngo_signature
            )
            selection.blockchain_tx = tx_hash
            selection.save()
            print(f"Quote selection blockchain hash: {tx_hash}")
            
            # Update project status
            quote_request.project.status = 'QUOTE_SELECTED'
            quote_request.project.save()
            
            # Close the quote request
            quote_request.status = 'SELECTED'
            quote_request.save()
            
        except Exception as e:
            print(f"Blockchain quote selection failed: {e}")
            import traceback
            print(traceback.format_exc())
        
        return JsonResponse({
            'message': 'Quote selected and field officer assigned successfully',
            'selection': {
                'id': selection.id,
                'selected_supplier': quote.supplier.name,
                'selected_amount': str(quote.quoted_amount),
                'field_officer': field_officer.name,
                'blockchain_tx': selection.blockchain_tx,
                'created_at': selection.created_at
            }
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['NGO'])
def close_quote_request(request):
    """NGO closes quote request without selecting any quote"""
    try:
        data = json.loads(request.body)
        print(f"Close quote request data: {data}")  # Debug log
        
        ngo = User.objects.get(id=request.user_data['user_id'])
        
        quote_request_id = data.get('quote_request_id')
        print(f"Quote request ID: {quote_request_id}")  # Debug log
        
        if not quote_request_id:
            print("Missing quote_request_id")  # Debug log
            return JsonResponse({'error': 'Quote request ID is required'}, status=400)
        
        try:
            quote_request = SupplyQuoteRequest.objects.get(id=quote_request_id)
            print(f"Found quote request: {quote_request.id}, status: {quote_request.status}")  # Debug log
        except SupplyQuoteRequest.DoesNotExist:
            print(f"Quote request {quote_request_id} not found")  # Debug log
            return JsonResponse({'error': 'Quote request not found'}, status=404)
        
        # Verify NGO owns the quote request
        if quote_request.ngo != ngo:
            print(f"Unauthorized: NGO {ngo.id} doesn't own quote request {quote_request.id}")  # Debug log
            return JsonResponse({'error': 'Unauthorized'}, status=403)
        
        # Close the quote request (allowed even if quote is selected)
        quote_request.status = 'CLOSED'
        quote_request.save()
        print(f"Quote request {quote_request.id} closed successfully")  # Debug log
        
        return JsonResponse({
            'message': 'Quote request closed successfully',
            'quote_request': {
                'id': quote_request.id,
                'status': quote_request.status
            }
        })
        
    except Exception as e:
        print(f"Close quote error: {e}")  # Debug log
        return JsonResponse({'error': str(e)}, status=500)