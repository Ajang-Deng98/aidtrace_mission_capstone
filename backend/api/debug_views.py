from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from .auth import require_auth

@require_http_methods(["GET"])
@require_auth(['DONOR', 'NGO'])
def debug_project_data(request, project_id):
    """Debug endpoint to check project data"""
    try:
        project = Project.objects.get(id=project_id)
        funding = Funding.objects.filter(project=project).first()
        quote_request = SupplyQuoteRequest.objects.filter(project=project).first()
        quote_selection = QuoteSelection.objects.filter(quote_request__project=project).first()
        field_assignment = FieldOfficerAssignment.objects.filter(project=project).first()
        delivery_confirmation = None
        if quote_selection:
            delivery_confirmation = SupplierDeliveryConfirmation.objects.filter(quote_selection=quote_selection).first()
        
        debug_data = {
            'project': {
                'id': project.id,
                'title': project.title,
                'blockchain_tx': project.blockchain_tx,
                'blockchain_tx_length': len(project.blockchain_tx) if project.blockchain_tx else 0
            },
            'funding': None,
            'quote_request': None,
            'quote_selection': None,
            'field_assignment': None,
            'delivery_confirmation': None
        }
        
        if funding:
            debug_data['funding'] = {
                'id': funding.id,
                'blockchain_tx': funding.blockchain_tx,
                'blockchain_tx_length': len(funding.blockchain_tx) if funding.blockchain_tx else 0,
                'ngo_confirmation_tx': funding.ngo_confirmation_tx,
                'ngo_confirmation_tx_length': len(funding.ngo_confirmation_tx) if funding.ngo_confirmation_tx else 0
            }
        
        if quote_request:
            debug_data['quote_request'] = {
                'id': quote_request.id,
                'blockchain_tx': quote_request.blockchain_tx,
                'blockchain_tx_length': len(quote_request.blockchain_tx) if quote_request.blockchain_tx else 0
            }
        
        if quote_selection:
            debug_data['quote_selection'] = {
                'id': quote_selection.id,
                'blockchain_tx': quote_selection.blockchain_tx,
                'blockchain_tx_length': len(quote_selection.blockchain_tx) if quote_selection.blockchain_tx else 0
            }
        
        if field_assignment:
            debug_data['field_assignment'] = {
                'id': field_assignment.id,
                'blockchain_tx': field_assignment.blockchain_tx,
                'blockchain_tx_length': len(field_assignment.blockchain_tx) if field_assignment.blockchain_tx else 0
            }
        
        if delivery_confirmation:
            debug_data['delivery_confirmation'] = {
                'id': delivery_confirmation.id,
                'blockchain_tx': delivery_confirmation.blockchain_tx,
                'blockchain_tx_length': len(delivery_confirmation.blockchain_tx) if delivery_confirmation.blockchain_tx else 0
            }
        
        return JsonResponse(debug_data)
        
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)