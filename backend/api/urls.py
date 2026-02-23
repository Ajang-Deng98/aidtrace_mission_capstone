from django.urls import path
from . import views
from .blockchain_verify import verify_transaction, get_contract_info

urlpatterns = [
    # Auth
    path('register/', views.register),
    path('login/', views.login),
    
    # Blockchain Verification
    path('blockchain/verify/<str:tx_hash>/', verify_transaction),
    path('blockchain/contract/', get_contract_info),
    
    # Public
    path('public-reports/', views.submit_public_report),
    path('public-reports/list/', views.get_public_reports),
    
    # NGO
    path('ngo/projects/', views.create_project),
    path('ngo/projects/list/', views.get_ngo_projects),
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
    
    # Supplier
    path('supplier/assignments/', views.get_supplier_assignments),
    path('supplier/confirm/', views.confirm_supplier_assignment),
    
    # Field Officer
    path('field-officer/assignments/', views.get_field_officer_assignments),
    path('field-officer/confirm/', views.confirm_field_officer_assignment),
    path('field-officer/beneficiary/', views.add_beneficiary),
    path('field-officer/beneficiary/search/', views.search_beneficiary),
    path('field-officer/beneficiary/all/', views.get_all_beneficiaries),
    path('field-officer/beneficiary/confirmed/', views.get_confirmed_beneficiaries),
    path('field-officer/face-scan/', views.mock_face_scan),
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
]
