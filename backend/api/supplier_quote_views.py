# Supplier Quote Views
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import *
from .serializers import *
from .auth import require_auth
from .blockchain import blockchain_service

@require_http_methods(["GET"])
@require_auth(['SUPPLIER'])
def get_available_quote_requests(request):
    """Get all available quote requests for suppliers"""
    # Get quote requests that are still open
    quote_requests = SupplyQuoteRequest.objects.filter(
        status='OPEN'
    ).order_by('-created_at')
    
    supplier = User.objects.get(id=request.user_data['user_id'])
    
    data = []
    for qr in quote_requests:
        # Check if this supplier already submitted a quote
        existing_quote = SupplierQuote.objects.filter(
            quote_request=qr, 
            supplier=supplier
        ).first()
        
        # Count total quotes for this request
        quotes_count = SupplierQuote.objects.filter(quote_request=qr).count()
        
        data.append({
            'id': qr.id,
            'project_id': qr.project.id,
            'project_title': qr.project.title,
            'project_location': qr.project.location,
            'ngo_name': qr.ngo.name,
            'delivery_location': qr.delivery_location,
            'delivery_date': str(qr.delivery_date),
            'proposed_budget': str(qr.proposed_budget),
            'items': qr.items,
            'additional_requirements': qr.additional_requirements,
            'status': qr.status,
            'quotes_count': quotes_count,
            'blockchain_tx': qr.blockchain_tx,
            'has_submitted_quote': bool(existing_quote),
            'submitted_quote_id': existing_quote.id if existing_quote else None,
            'created_at': qr.created_at
        })
    
    return JsonResponse(data, safe=False)

@require_http_methods(["GET"])
@require_auth(['SUPPLIER'])
def get_quote_request_details(request, request_id):
    """Get specific quote request details regardless of status"""
    try:
        quote_request = SupplyQuoteRequest.objects.get(id=request_id)
        supplier = User.objects.get(id=request.user_data['user_id'])
        
        # Check if this supplier already submitted a quote
        existing_quote = SupplierQuote.objects.filter(
            quote_request=quote_request, 
            supplier=supplier
        ).first()
        
        # Count total quotes for this request
        quotes_count = SupplierQuote.objects.filter(quote_request=quote_request).count()
        
        data = {
            'id': quote_request.id,
            'project_id': quote_request.project.id,
            'project_title': quote_request.project.title,
            'project_location': quote_request.project.location,
            'project_status': quote_request.project.status,
            'ngo_name': quote_request.ngo.name,
            'delivery_location': quote_request.delivery_location,
            'delivery_date': str(quote_request.delivery_date),
            'proposed_budget': str(quote_request.proposed_budget),
            'items': quote_request.items,
            'additional_requirements': quote_request.additional_requirements,
            'status': quote_request.status,
            'quotes_count': quotes_count,
            'blockchain_tx': quote_request.blockchain_tx,
            'has_submitted_quote': bool(existing_quote),
            'submitted_quote_id': existing_quote.id if existing_quote else None,
            'created_at': quote_request.created_at
        }
        
        return JsonResponse(data)
        
    except SupplyQuoteRequest.DoesNotExist:
        return JsonResponse({'error': 'Quote request not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['SUPPLIER'])
def submit_quote(request):
    """Supplier submits quote for a quote request"""
    try:
        data = json.loads(request.body)
        supplier = User.objects.get(id=request.user_data['user_id'])
        quote_request = SupplyQuoteRequest.objects.get(id=data.get('quote_request_id'))
        
        # Check if quote request is still open
        if quote_request.status != 'OPEN':
            return JsonResponse({'error': 'This quote request is no longer accepting submissions'}, status=400)
        
        # Check if supplier already submitted a quote
        existing_quote = SupplierQuote.objects.filter(
            quote_request=quote_request,
            supplier=supplier
        ).first()
        
        if existing_quote:
            return JsonResponse({'error': 'You have already submitted a quote for this request'}, status=400)
        
        quote = SupplierQuote.objects.create(
            quote_request=quote_request,
            supplier=supplier,
            quoted_amount=data.get('quoted_amount'),
            delivery_terms=data.get('delivery_terms'),
            delivery_timeline=data.get('delivery_timeline', ''),
            quality_certifications=data.get('quality_certifications', ''),
            payment_terms=data.get('payment_terms', ''),
            warranty_period=data.get('warranty_period', ''),
            technical_specifications=data.get('technical_specifications', ''),
            supplier_experience=data.get('supplier_experience', ''),
            references=data.get('references', ''),
            signature=data.get('supplier_signature')
        )
        
        # Record on blockchain
        try:
            tx_hash = blockchain_service.submit_supplier_quote(
                quote_request.id,
                quote_request.project.id,
                quote.quoted_amount,
                quote.delivery_terms,
                quote.signature
            )
            quote.blockchain_tx = tx_hash
            quote.save()
            
            # Update project status if this is the first quote
            if SupplierQuote.objects.filter(quote_request=quote_request).count() == 1:
                quote_request.project.status = 'QUOTES_RECEIVED'
                quote_request.project.save()
            
        except Exception as e:
            print(f"Blockchain quote submission failed: {e}")
        
        return JsonResponse({
            'message': 'Quote submitted successfully and recorded on blockchain',
            'quote': {
                'id': quote.id,
                'quote_request_id': quote_request.id,
                'project_title': quote_request.project.title,
                'quoted_amount': str(quote.quoted_amount),
                'delivery_terms': quote.delivery_terms,
                'blockchain_tx': quote.blockchain_tx,
                'created_at': quote.created_at
            }
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
@require_auth(['SUPPLIER'])
def get_supplier_quotes(request):
    """Get all quotes submitted by supplier"""
    supplier = User.objects.get(id=request.user_data['user_id'])
    quotes = SupplierQuote.objects.filter(supplier=supplier).order_by('-created_at')
    
    data = []
    for quote in quotes:
        # Check if this quote was selected
        selection = QuoteSelection.objects.filter(selected_quote=quote).first()
        
        # Check if delivery was confirmed
        delivery_confirmation = None
        if selection:
            delivery_confirmation = SupplierDeliveryConfirmation.objects.filter(quote_selection=selection).first()
        
        data.append({
            'id': quote.id,
            'quote_request_id': quote.quote_request.id,
            'project_title': quote.quote_request.project.title,
            'ngo_name': quote.quote_request.ngo.name,
            'quoted_amount': str(quote.quoted_amount),
            'delivery_terms': quote.delivery_terms,
            'signature': quote.signature,
            'blockchain_tx': quote.blockchain_tx,
            'is_selected': bool(selection),
            'selection_id': selection.id if selection else None,
            'delivery_confirmed': bool(delivery_confirmation),
            'delivery_blockchain_tx': delivery_confirmation.blockchain_tx if delivery_confirmation else None,
            'created_at': quote.created_at
        })
    
    return JsonResponse(data, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['SUPPLIER'])
def confirm_delivery_to_field_officer(request):
    """Supplier confirms delivery to field officer"""
    try:
        data = json.loads(request.body)
        supplier = User.objects.get(id=request.user_data['user_id'])
        
        selection_id = data.get('selection_id')
        if not selection_id:
            return JsonResponse({'error': 'selection_id is required'}, status=400)
        
        try:
            selection = QuoteSelection.objects.get(id=selection_id)
        except QuoteSelection.DoesNotExist:
            return JsonResponse({'error': f'Quote selection {selection_id} not found'}, status=404)
        
        quote = selection.selected_quote
        
        # Verify this supplier owns the selected quote
        if quote.supplier.id != supplier.id:
            return JsonResponse({'error': 'Unauthorized - quote belongs to different supplier'}, status=403)
        
        # Check if already confirmed
        existing = SupplierDeliveryConfirmation.objects.filter(quote_selection=selection).first()
        if existing:
            return JsonResponse({'error': 'Delivery already confirmed'}, status=400)
        
        # Get field officer assignment - get the most recent confirmed one
        try:
            field_assignment = FieldOfficerAssignment.objects.filter(
                project=selection.quote_request.project,
                confirmed=True
            ).order_by('-created_at').first()
            
            if not field_assignment:
                # If no confirmed assignment, get the most recent one
                field_assignment = FieldOfficerAssignment.objects.filter(
                    project=selection.quote_request.project
                ).order_by('-created_at').first()
            
            if not field_assignment:
                return JsonResponse({'error': 'No field officer assigned to this project yet'}, status=400)
            
            field_officer = field_assignment.field_officer
        except Exception as e:
            return JsonResponse({'error': f'Error getting field officer: {str(e)}'}, status=400)
        
        # Create delivery confirmation
        delivery_confirmation = SupplierDeliveryConfirmation.objects.create(
            quote_selection=selection,
            supplier=supplier,
            field_officer=field_officer,
            delivery_signature=data.get('delivery_signature', ''),
            delivery_notes=data.get('delivery_notes', '')
        )
        
        # Record on blockchain
        try:
            supplier_address = supplier.wallet_address if supplier.wallet_address else blockchain_service.get_account()
            tx_hash = blockchain_service.record_supplier_confirmation(
                selection.quote_request.project.id,
                selection.quote_request.project.title,
                selection.quote_request.delivery_location,
                supplier_address,
                delivery_confirmation.delivery_signature
            )
            delivery_confirmation.blockchain_tx = tx_hash
            delivery_confirmation.save()
            
            # Update project status
            selection.quote_request.project.status = 'SUPPLIER_DELIVERED'
            selection.quote_request.project.save()
            
        except Exception as e:
            print(f"Blockchain delivery confirmation failed: {e}")
        
        return JsonResponse({
            'message': 'Delivery confirmed successfully',
            'delivery': {
                'id': delivery_confirmation.id,
                'project_title': selection.quote_request.project.title,
                'field_officer': field_officer.name,
                'blockchain_tx': delivery_confirmation.blockchain_tx,
                'created_at': delivery_confirmation.created_at
            }
        })
        
    except Exception as e:
        import traceback
        print(f"Error in confirm_delivery_to_field_officer: {str(e)}")
        print(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)