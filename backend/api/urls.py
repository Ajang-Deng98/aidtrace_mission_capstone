from django.urls import path
from django.http import JsonResponse
from . import views
from .blockchain_verify import verify_transaction, get_contract_info
from .quote_views import create_quote_request, get_ngo_quote_requests, get_quote_request_quotes, select_quote, close_quote_request
from .supplier_quote_views import get_available_quote_requests, submit_quote, get_supplier_quotes, confirm_delivery_to_field_officer, get_quote_request_details

from .bulk_beneficiary import bulk_upload_beneficiaries

def api_root(request):
    return JsonResponse({'message': 'AidTrace API', 'version': '1.0'})

urlpatterns = [
    path('', api_root),
    # Auth
    path('register/', views.register),
    path('login/', views.login),
    path('forgot-password/', views.forgot_password),
    path('reset-password/', views.reset_password),
    
    # Blockchain Verification
    path('blockchain/verify/<str:tx_hash>/', verify_transaction),
    path('blockchain/contract/', get_contract_info),
    
    # NGO Quote System
    path('ngo/quote-requests/', create_quote_request),
    path('ngo/quote-requests/list/', get_ngo_quote_requests),
    path('ngo/quote-requests/<int:quote_request_id>/', get_quote_request_quotes),
    path('ngo/select-quote/', select_quote),
    path('ngo/close-quote/', close_quote_request),
    
    # Supplier Quote System
    path('supplier/quote-requests/', get_available_quote_requests),
    path('supplier/quote-requests/<int:request_id>/', get_quote_request_details),
    path('supplier/submit-quote/', submit_quote),
    path('supplier/quotes/', get_supplier_quotes),
    path('supplier/confirm-selection/', confirm_delivery_to_field_officer),
    
    # Public
    path('public-reports/', views.submit_public_report),
    path('public-reports/list/', views.get_public_reports),
    
    # NGO
    path('ngo/projects/', views.create_project),
    path('ngo/projects/list/', views.get_ngo_projects),
    path('ngo/projects/<int:project_id>/beneficiaries/', views.get_ngo_project_beneficiaries),
    path('ngo/projects/<int:project_id>/beneficiaries/upload/', views.upload_project_beneficiaries),
    path('ngo/beneficiaries/upload/', views.upload_beneficiaries_standalone),
    path('ngo/dashboard/', views.get_ngo_dashboard),
    path('ngo/field-officers/', views.create_field_officer),
    path('ngo/field-officers/list/', views.get_field_officers),
    path('ngo/suppliers/', views.get_suppliers),
    path('ngo/donors/', views.get_donors),
    path('ngo/assign-supplier/', views.assign_supplier),
    path('ngo/assign-field-officer/', views.assign_field_officer),
    path('ngo/confirm-funding/', views.confirm_funding),
    path('ngo/project/<int:project_id>/', views.get_project_details),
    
    # Donor
    path('donor/projects/', views.get_all_projects),
    path('donor/funded-projects/', views.get_donor_funded_projects),
    path('donor/fund-project/', views.fund_project),
    path('donor/funding-report/<int:funding_id>/', views.get_funding_report),
    path('donor/project/<int:project_id>/', views.get_project_details),
    path('project/<int:project_id>/workflow/', views.get_project_workflow_status),
    
    # NGO - Download supplier quote
    path('ngo/download-quote/<int:quote_id>/', views.download_supplier_quote),
    
    # Project Documents
    path('project/<int:project_id>/document/<int:doc_number>/', views.download_project_document),
    
    # Supplier
    path('supplier/assignments/', views.get_supplier_assignments),
    path('supplier/confirm/', views.confirm_assignment),
    
    # Field Officer
    path('field-officer/assignments/', views.get_field_officer_assignments),
    path('field-officer/confirm/', views.confirm_field_officer_assignment),
    path('field-officer/beneficiary/', views.add_beneficiary),
    path('field-officer/beneficiary/bulk-upload/', bulk_upload_beneficiaries),
    path('field-officer/beneficiary/search/', views.search_beneficiary),
    path('field-officer/beneficiary/all/', views.get_all_beneficiaries),
    path('field-officer/beneficiary/confirmed/', views.get_confirmed_beneficiaries),
    path('field-officer/face-scan/', views.mock_face_scan),
    path('field-officer/verify-face/', views.verify_face_match),
    path('field-officer/send-otp/', views.send_otp),
    path('field-officer/verify-otp/', views.verify_otp),
    path('field-officer/distributions/', views.get_distributions),
    
    # Admin
    path('admin/users/', views.get_all_users),
    path('admin/dashboard/', views.get_admin_dashboard),
    path('admin/projects/', views.get_admin_projects),
    path('admin/pending-users/', views.get_pending_users),
    path('admin/approve-user/', views.approve_user),
    path('admin/reject-user/', views.reject_user),
    path('admin/pending-projects/', views.get_pending_projects),
    path('admin/approve-project/', views.approve_project),
    path('admin/reject-project/', views.reject_project),
    path('activity-log/', views.get_activity_log),
]