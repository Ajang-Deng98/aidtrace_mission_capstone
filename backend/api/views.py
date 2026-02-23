from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import *
from .serializers import *
from .auth import create_token, require_auth
from .blockchain import blockchain_service
from .otp_service import otp_service

@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    data = json.loads(request.body)
    
    role = data.get('role')
    if role not in ['DONOR', 'NGO', 'SUPPLIER']:
        return JsonResponse({'error': 'Invalid role'}, status=400)
    
    if User.objects.filter(username=data.get('username')).exists():
        return JsonResponse({'error': 'Username already exists'}, status=400)
    
    if User.objects.filter(email=data.get('email')).exists():
        return JsonResponse({'error': 'Email already exists'}, status=400)
    
    user = User(
        username=data.get('username'),
        email=data.get('email'),
        role=role,
        name=data.get('name'),
        contact=data.get('contact', ''),
        wallet_address=data.get('wallet_address', ''),
        license_number=data.get('license_number', ''),
        is_approved=False
    )
    user.set_password(data.get('password'))
    user.save()
    
    return JsonResponse({
        'message': 'Registration successful. Please wait for admin approval before logging in.',
        'user': UserSerializer(user).data
    })

@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    data = json.loads(request.body)
    
    username_or_email = data.get('username')
    password = data.get('password')
    
    try:
        user = User.objects.filter(username=username_or_email).first() or \
               User.objects.filter(email=username_or_email).first()
        
        if not user or not user.check_password(password):
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
        
        # Check if user needs approval (DONOR, NGO, SUPPLIER)
        if user.role in ['DONOR', 'NGO', 'SUPPLIER'] and not user.is_approved:
            return JsonResponse({'error': 'Your account is pending admin approval'}, status=403)
        
        token = create_token(user)
        
        return JsonResponse({
            'token': token,
            'user': UserSerializer(user).data
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def submit_public_report(request):
    data = json.loads(request.body)
    
    report = PublicReport.objects.create(
        project_name=data.get('project_name'),
        location=data.get('location'),
        description=data.get('description'),
        contact_info=data.get('contact_info')
    )
    
    return JsonResponse(PublicReportSerializer(report).data)

@require_http_methods(["GET"])
def get_public_reports(request):
    reports = PublicReport.objects.all().order_by('-created_at')
    return JsonResponse(PublicReportSerializer(reports, many=True).data, safe=False)


# NGO Views
@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['NGO'])
def create_project(request):
    data = json.loads(request.body)
    
    ngo = User.objects.get(id=request.user_data['user_id'])
    
    project = Project.objects.create(
        title=data.get('title'),
        description=data.get('description'),
        location=data.get('location'),
        required_items=data.get('required_items'),
        budget_amount=data.get('budget_amount', 0),
        duration_months=data.get('duration_months', 1),
        target_beneficiaries=data.get('target_beneficiaries', 0),
        start_date=data.get('start_date'),
        end_date=data.get('end_date'),
        category=data.get('category', 'General Aid'),
        desired_donors=data.get('desired_donors', []),
        ngo=ngo,
        is_approved=True,
        status='PENDING_FUNDING'
    )
    
    # Generate project hash and record on blockchain
    import hashlib
    project_data = f"{project.id}{project.title}{project.budget_amount}{project.location}"
    project.project_hash = hashlib.sha256(project_data.encode()).hexdigest()
    
    try:
        tx_hash = blockchain_service.create_project(
            project.id,
            project.title,
            project.description,
            project.location,
            project.required_items
        )
        project.blockchain_tx = tx_hash
    except Exception as e:
        print(f"Blockchain transaction failed: {e}")
        # Continue without blockchain - store project anyway
    
    project.save()
    
    return JsonResponse({
        'message': 'Project created successfully and recorded on blockchain.',
        'project': ProjectSerializer(project).data
    })

@require_http_methods(["GET"])
@require_auth(['NGO'])
def get_ngo_projects(request):
    ngo = User.objects.get(id=request.user_data['user_id'])
    projects = Project.objects.filter(ngo=ngo).order_by('-created_at')
    return JsonResponse(ProjectSerializer(projects, many=True).data, safe=False)

@require_http_methods(["GET"])
@require_auth(['NGO'])
def get_ngo_dashboard(request):
    ngo = User.objects.get(id=request.user_data['user_id'])
    
    projects = Project.objects.filter(ngo=ngo)
    funded_projects = projects.filter(status__in=['FUNDED', 'SUPPLIER_ASSIGNED', 'SUPPLIER_CONFIRMED', 
                                                    'FIELD_OFFICER_ASSIGNED', 'FIELD_OFFICER_CONFIRMED',
                                                    'IN_DISTRIBUTION', 'COMPLETED'])
    
    field_officers = User.objects.filter(role='FIELD_OFFICER', created_by=ngo)
    
    return JsonResponse({
        'total_projects': projects.count(),
        'funded_projects': funded_projects.count(),
        'field_officers': field_officers.count(),
        'projects': ProjectSerializer(projects, many=True).data
    })

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['NGO'])
def create_field_officer(request):
    try:
        data = json.loads(request.body)
        
        ngo = User.objects.get(id=request.user_data['user_id'])
        
        if User.objects.filter(username=data.get('username')).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        
        if User.objects.filter(email=data.get('email')).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)
        
        field_officer = User(
            username=data.get('username'),
            email=data.get('email'),
            role='FIELD_OFFICER',
            name=data.get('name'),
            contact=data.get('contact', ''),
            created_by=ngo,
            is_approved=True  # Auto-approved by NGO
        )
        field_officer.set_password(data.get('password'))
        field_officer.save()
        
        return JsonResponse(UserSerializer(field_officer).data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@require_http_methods(["GET"])
@require_auth(['NGO'])
def get_field_officers(request):
    ngo = User.objects.get(id=request.user_data['user_id'])
    officers = User.objects.filter(role='FIELD_OFFICER', created_by=ngo)
    return JsonResponse(UserSerializer(officers, many=True).data, safe=False)

@require_http_methods(["GET"])
@require_auth(['NGO'])
def get_suppliers(request):
    suppliers = User.objects.filter(role='SUPPLIER')
    return JsonResponse(UserSerializer(suppliers, many=True).data, safe=False)

@require_http_methods(["GET"])
@require_auth(['NGO'])
def get_donors(request):
    donors = User.objects.filter(role='DONOR', is_approved=True)
    return JsonResponse(UserSerializer(donors, many=True).data, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['NGO'])
def assign_supplier(request):
    data = json.loads(request.body)
    
    project = Project.objects.get(id=data.get('project_id'))
    supplier = User.objects.get(id=data.get('supplier_id'))
    field_officer = None
    if data.get('field_officer_id'):
        field_officer = User.objects.get(id=data.get('field_officer_id'))
    
    assignment = SupplierAssignment.objects.create(
        project=project,
        supplier=supplier,
        items=data.get('items'),
        delivery_duration=data.get('delivery_duration', 0),
        delivery_location=data.get('delivery_location', ''),
        quantity=data.get('quantity', 0),
        field_officer_incharge=field_officer
    )
    
    project.status = 'SUPPLIER_ASSIGNED'
    project.save()
    
    return JsonResponse(SupplierAssignmentSerializer(assignment).data)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['NGO'])
def assign_field_officer(request):
    data = json.loads(request.body)
    
    project = Project.objects.get(id=data.get('project_id'))
    officer = User.objects.get(id=data.get('field_officer_id'))
    
    assignment = FieldOfficerAssignment.objects.create(
        project=project,
        field_officer=officer
    )
    
    project.status = 'FIELD_OFFICER_ASSIGNED'
    project.save()
    
    return JsonResponse(FieldOfficerAssignmentSerializer(assignment).data)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['NGO'])
def confirm_funding(request):
    data = json.loads(request.body)
    
    funding = Funding.objects.get(id=data.get('funding_id'))
    funding.ngo_signature = data.get('signature')
    funding.save()
    
    # Update project status to FUNDED
    funding.project.status = 'FUNDED'
    funding.project.save()
    
    return JsonResponse(FundingSerializer(funding).data)


# Donor Views
@require_http_methods(["GET"])
@require_auth(['DONOR'])
def get_all_projects(request):
    donor = User.objects.get(id=request.user_data['user_id'])
    # Show projects that are PENDING_FUNDING and either have no desired donors or include this donor
    projects = Project.objects.filter(
        is_approved=True, 
        status='PENDING_FUNDING'
    ).order_by('-created_at')
    
    # Filter to show only projects where donor is in desired_donors list or desired_donors is empty
    filtered_projects = []
    for project in projects:
        if not project.desired_donors or donor.id in project.desired_donors:
            filtered_projects.append(project)
    
    return JsonResponse(ProjectSerializer(filtered_projects, many=True).data, safe=False)

@require_http_methods(["GET"])
@require_auth(['DONOR'])
def get_donor_funded_projects(request):
    donor = User.objects.get(id=request.user_data['user_id'])
    fundings = Funding.objects.filter(donor=donor)
    projects = [f.project for f in fundings]
    return JsonResponse(ProjectSerializer(projects, many=True).data, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['DONOR'])
def fund_project(request):
    try:
        data = json.loads(request.body)
        
        donor = User.objects.get(id=request.user_data['user_id'])
        project = Project.objects.get(id=data.get('project_id'))
        
        # Record on blockchain first
        tx_hash = None
        try:
            # Only attempt blockchain if both wallets exist and are valid
            if donor.wallet_address and project.ngo.wallet_address:
                tx_hash = blockchain_service.record_funding(
                    project.id,
                    donor.wallet_address,
                    project.ngo.wallet_address,
                    data.get('amount')
                )
        except Exception as e:
            print(f"Blockchain funding record failed: {e}")
            # Continue without blockchain
        
        funding = Funding.objects.create(
            project=project,
            donor=donor,
            amount=data.get('amount'),
            donor_signature=data.get('signature', ''),
            ngo_signature='',
            blockchain_tx=tx_hash or ''
        )
        
        project.status = 'FUNDED'
        project.save()
        
        return JsonResponse(FundingSerializer(funding).data)
    except Exception as e:
        import traceback
        print(f"Error in fund_project: {str(e)}")
        print(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
@require_auth(['DONOR', 'NGO'])
def get_funding_report(request, funding_id):
    from django.http import HttpResponse
    try:
        funding = Funding.objects.get(id=funding_id)
        project = funding.project
        
        html_content = f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AidTrace Funding Report</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }}
        .container {{ max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }}
        .header {{ text-align: center; border-bottom: 3px solid #1CABE2; padding-bottom: 20px; margin-bottom: 30px; }}
        .logo {{ font-size: 32px; font-weight: bold; color: #1CABE2; margin-bottom: 10px; }}
        .section {{ margin-bottom: 30px; }}
        .section-title {{ font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px; }}
        .info-row {{ display: flex; margin-bottom: 10px; }}
        .info-label {{ font-weight: bold; width: 200px; color: #666; }}
        .info-value {{ color: #333; }}
        .signature-box {{ background: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #e0e0e0; margin-top: 10px; word-break: break-all; }}
        .footer {{ text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #999; font-size: 12px; }}
        .amount {{ font-size: 24px; color: #1CABE2; font-weight: bold; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">AidTrace</div>
            <h1 style="margin: 10px 0; color: #333;">Funding Report</h1>
            <p style="color: #666; margin: 5px 0;">Blockchain-Verified Humanitarian Aid Transaction</p>
        </div>

        <div class="section">
            <div class="section-title">Project Information</div>
            <div class="info-row"><div class="info-label">Project Title:</div><div class="info-value">{project.title}</div></div>
            <div class="info-row"><div class="info-label">Location:</div><div class="info-value">{project.location}</div></div>
            <div class="info-row"><div class="info-label">Category:</div><div class="info-value">{project.category}</div></div>
            <div class="info-row"><div class="info-label">Duration:</div><div class="info-value">{project.duration_months} months</div></div>
            <div class="info-row"><div class="info-label">Target Beneficiaries:</div><div class="info-value">{project.target_beneficiaries}</div></div>
            <div class="info-row"><div class="info-label">NGO:</div><div class="info-value">{project.ngo.name}</div></div>
        </div>

        <div class="section">
            <div class="section-title">Funding Details</div>
            <div class="info-row"><div class="info-label">Donor:</div><div class="info-value">{funding.donor.name}</div></div>
            <div class="info-row"><div class="info-label">Amount Funded:</div><div class="info-value"><span class="amount">${funding.amount}</span></div></div>
            <div class="info-row"><div class="info-label">Date:</div><div class="info-value">{funding.created_at.strftime('%B %d, %Y at %I:%M %p')}</div></div>
        </div>

        <div class="section">
            <div class="section-title">Digital Signatures</div>
            <div style="margin-bottom: 15px;"><strong style="color: #666;">Donor Signature:</strong><div class="signature-box">{funding.donor_signature}</div></div>
            <div><strong style="color: #666;">NGO Confirmation Signature:</strong><div class="signature-box">{funding.ngo_signature if funding.ngo_signature else 'Pending NGO Confirmation'}</div></div>
        </div>

        {f'<div class="section"><div class="section-title">Blockchain Verification</div><div class="info-row"><div class="info-label">Transaction Hash:</div><div class="info-value" style="word-break: break-all; font-family: monospace; font-size: 11px;">{funding.blockchain_tx}</div></div><div style="margin-top: 10px; padding: 10px; background: #e8f5e9; border-radius: 5px; color: #2e7d32;">✓ This transaction has been verified and recorded on the blockchain</div></div>' if funding.blockchain_tx else ''}

        <div class="footer">
            <p>This is an official funding report generated by AidTrace</p>
            <p>Report ID: {funding.id} | Generated on {funding.created_at.strftime('%Y-%m-%d')}</p>
        </div>
    </div>
</body>
</html>'''
        
        response = HttpResponse(html_content, content_type='text/html')
        response['Content-Disposition'] = f'attachment; filename="AidTrace_Funding_Report_{funding_id}.html"'
        return response
    except Funding.DoesNotExist:
        return JsonResponse({'error': 'Funding not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
@require_auth(['DONOR', 'NGO'])
def get_project_details(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
        
        fundings = Funding.objects.filter(project=project)
        supplier_assignments = SupplierAssignment.objects.filter(project=project)
        field_officer_assignments = FieldOfficerAssignment.objects.filter(project=project)
        distributions = Distribution.objects.filter(project=project)
        
        return JsonResponse({
            'project': ProjectSerializer(project).data,
            'fundings': FundingSerializer(fundings, many=True).data,
            'supplier_assignments': SupplierAssignmentSerializer(supplier_assignments, many=True).data,
            'field_officer_assignments': FieldOfficerAssignmentSerializer(field_officer_assignments, many=True).data,
            'distributions': DistributionSerializer(distributions, many=True).data
        })
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# Supplier Views
@require_http_methods(["GET"])
@require_auth(['SUPPLIER'])
def get_supplier_assignments(request):
    supplier = User.objects.get(id=request.user_data['user_id'])
    assignments = SupplierAssignment.objects.filter(supplier=supplier)
    return JsonResponse(SupplierAssignmentSerializer(assignments, many=True).data, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['SUPPLIER'])
def confirm_supplier_assignment(request):
    data = json.loads(request.body)
    
    supplier = User.objects.get(id=request.user_data['user_id'])
    assignment = SupplierAssignment.objects.get(id=data.get('assignment_id'))
    
    assignment.confirmed = True
    assignment.signature = data.get('signature')
    
    # Record on blockchain
    try:
        # Use supplier wallet address if available, otherwise use a default address
        supplier_address = supplier.wallet_address if supplier.wallet_address else blockchain_service.get_account()
        tx_hash = blockchain_service.record_supplier_confirmation(
            assignment.project.id,
            supplier_address,
            assignment.signature
        )
        if tx_hash:
            assignment.blockchain_tx = tx_hash
    except Exception as e:
        print(f"Blockchain supplier confirmation failed: {e}")
        # Continue without blockchain
    
    assignment.save()
    assignment.project.status = 'SUPPLIER_CONFIRMED'
    assignment.project.save()
    
    return JsonResponse(SupplierAssignmentSerializer(assignment).data)


# Field Officer Views
@require_http_methods(["GET"])
@require_auth(['FIELD_OFFICER'])
def get_field_officer_assignments(request):
    officer = User.objects.get(id=request.user_data['user_id'])
    assignments = FieldOfficerAssignment.objects.filter(field_officer=officer)
    
    data = []
    for assignment in assignments:
        project = assignment.project
        supplier_assignment = SupplierAssignment.objects.filter(project=project).first()
        fundings = Funding.objects.filter(project=project)
        
        data.append({
            'id': assignment.id,
            'project': project.id,
            'project_title': project.title,
            'project_description': project.description,
            'project_location': project.location,
            'project_category': project.category,
            'budget_amount': str(project.budget_amount),
            'target_beneficiaries': project.target_beneficiaries,
            'duration_months': project.duration_months,
            'start_date': project.start_date,
            'end_date': project.end_date,
            'required_items': project.required_items,
            'status': project.status,
            'confirmed': assignment.confirmed,
            'signature': assignment.signature,
            'blockchain_tx': assignment.blockchain_tx,
            'created_at': assignment.created_at,
            'ngo_name': project.ngo.name,
            'supplier_name': supplier_assignment.supplier.name if supplier_assignment else None,
            'supplier_items': supplier_assignment.items if supplier_assignment else [],
            'total_funding': sum([float(f.amount) for f in fundings])
        })
    
    return JsonResponse(data, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['FIELD_OFFICER'])
def confirm_field_officer_assignment(request):
    data = json.loads(request.body)
    
    officer = User.objects.get(id=request.user_data['user_id'])
    assignment = FieldOfficerAssignment.objects.get(id=data.get('assignment_id'))
    
    assignment.confirmed = True
    assignment.signature = data.get('signature')
    
    # Record on blockchain
    try:
        # Use field officer wallet address if available, otherwise use a default address
        officer_address = officer.wallet_address if officer.wallet_address else blockchain_service.get_account()
        tx_hash = blockchain_service.record_field_officer_confirmation(
            assignment.project.id,
            officer_address,
            assignment.signature
        )
        if tx_hash:
            assignment.blockchain_tx = tx_hash
    except Exception as e:
        print(f"Blockchain field officer confirmation failed: {e}")
        # Continue without blockchain
    
    assignment.save()
    assignment.project.status = 'FIELD_OFFICER_CONFIRMED'
    assignment.project.save()
    
    return JsonResponse(FieldOfficerAssignmentSerializer(assignment).data)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['FIELD_OFFICER', 'NGO'])
def add_beneficiary(request):
    data = json.loads(request.body)
    
    project = Project.objects.get(id=data.get('project_id'))
    face_photo = data.get('face_photo', '')
    
    # Mock face verification - always returns True
    face_verified = bool(face_photo)
    
    beneficiary = Beneficiary.objects.create(
        name=data.get('name'),
        phone_number=data.get('phone_number'),
        project=project,
        face_photo=face_photo,
        face_verified=face_verified
    )
    
    return JsonResponse(BeneficiarySerializer(beneficiary).data)

@require_http_methods(["GET"])
@require_auth(['FIELD_OFFICER', 'NGO'])
def search_beneficiary(request):
    name = request.GET.get('name', '')
    project_id = request.GET.get('project_id')
    
    # Exclude confirmed beneficiaries from search results (for distribution)
    beneficiaries = Beneficiary.objects.filter(
        name__icontains=name,
        project_id=project_id,
        confirmed=False
    )
    
    return JsonResponse(BeneficiarySerializer(beneficiaries, many=True).data, safe=False)

@require_http_methods(["GET"])
@require_auth(['FIELD_OFFICER', 'NGO'])
def get_all_beneficiaries(request):
    project_id = request.GET.get('project_id')
    
    # Get all beneficiaries including confirmed ones (for beneficiaries list page)
    beneficiaries = Beneficiary.objects.filter(project_id=project_id)
    
    return JsonResponse(BeneficiarySerializer(beneficiaries, many=True).data, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['FIELD_OFFICER'])
def mock_face_scan(request):
    # Always returns True - mock implementation
    return JsonResponse({'verified': True})

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['FIELD_OFFICER'])
def send_otp(request):
    data = json.loads(request.body)
    phone_number = data.get('phone_number')
    
    code = otp_service.generate_otp(phone_number)
    
    return JsonResponse({'message': 'OTP sent'})

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['FIELD_OFFICER'])
def verify_otp(request):
    data = json.loads(request.body)
    
    phone_number = data.get('phone_number')
    code = data.get('code')
    face_scan_photo = data.get('face_scan_photo', '')
    
    verified = otp_service.verify_otp(phone_number, code)
    
    if verified:
        beneficiary_id = data.get('beneficiary_id')
        project_id = data.get('project_id')
        officer = User.objects.get(id=request.user_data['user_id'])
        
        distribution = Distribution.objects.create(
            beneficiary_id=beneficiary_id,
            project_id=project_id,
            field_officer=officer,
            face_scan_photo=face_scan_photo,
            face_scan_verified=True,
            otp_verified=True,
            completed=True
        )
        
        # Mark beneficiary as confirmed
        beneficiary = Beneficiary.objects.get(id=beneficiary_id)
        beneficiary.confirmed = True
        beneficiary.save()
        
        # Update project status
        project = Project.objects.get(id=project_id)
        if project.status == 'FIELD_OFFICER_CONFIRMED':
            project.status = 'IN_DISTRIBUTION'
            project.save()
        
        return JsonResponse({'verified': True, 'distribution': DistributionSerializer(distribution).data})
    
    return JsonResponse({'verified': False}, status=400)

@require_http_methods(["GET"])
@require_auth(['FIELD_OFFICER'])
def get_distributions(request):
    project_id = request.GET.get('project_id')
    distributions = Distribution.objects.filter(project_id=project_id)
    return JsonResponse(DistributionSerializer(distributions, many=True).data, safe=False)

@require_http_methods(["GET"])
@require_auth(['FIELD_OFFICER', 'NGO'])
def get_confirmed_beneficiaries(request):
    project_id = request.GET.get('project_id')
    beneficiaries = Beneficiary.objects.filter(project_id=project_id, confirmed=True)
    return JsonResponse(BeneficiarySerializer(beneficiaries, many=True).data, safe=False)


# Admin Views
@require_http_methods(["GET"])
@require_auth(['ADMIN'])
def get_all_users(request):
    role = request.GET.get('role', '')
    
    if role:
        users = User.objects.filter(role=role)
    else:
        users = User.objects.all()
    
    return JsonResponse(UserSerializer(users, many=True).data, safe=False)

@require_http_methods(["GET"])
@require_auth(['ADMIN'])
def get_admin_dashboard(request):
    donors = User.objects.filter(role='DONOR').count()
    ngos = User.objects.filter(role='NGO').count()
    suppliers = User.objects.filter(role='SUPPLIER').count()
    field_officers = User.objects.filter(role='FIELD_OFFICER').count()
    projects = Project.objects.all().count()
    reports = PublicReport.objects.all().count()
    
    return JsonResponse({
        'donors': donors,
        'ngos': ngos,
        'suppliers': suppliers,
        'field_officers': field_officers,
        'projects': projects,
        'reports': reports
    })

@require_http_methods(["GET"])
@require_auth(['ADMIN'])
def get_admin_projects(request):
    projects = Project.objects.all().order_by('-created_at')
    return JsonResponse(ProjectSerializer(projects, many=True).data, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['ADMIN'])
def approve_user(request):
    data = json.loads(request.body)
    user_id = data.get('user_id')
    
    user = User.objects.get(id=user_id)
    user.is_approved = True
    
    # Link NGO wallet to blockchain
    if user.role == 'NGO' and user.wallet_address:
        tx_hash = blockchain_service.link_ngo_wallet(
            str(user.id),
            user.wallet_address,
            user.name,
            user.license_number
        )
        if tx_hash:
            user.blockchain_tx = tx_hash
    
    user.save()
    
    return JsonResponse({'message': 'User approved successfully', 'user': UserSerializer(user).data})

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['ADMIN'])
def reject_user(request):
    data = json.loads(request.body)
    user_id = data.get('user_id')
    
    user = User.objects.get(id=user_id)
    user.delete()
    
    return JsonResponse({'message': 'User rejected and deleted'})

@require_http_methods(["GET"])
@require_auth(['ADMIN'])
def get_pending_users(request):
    pending_users = User.objects.filter(is_approved=False, role__in=['DONOR', 'NGO', 'SUPPLIER'])
    return JsonResponse(UserSerializer(pending_users, many=True).data, safe=False)

@require_http_methods(["GET"])
@require_auth(['ADMIN'])
def get_pending_projects(request):
    pending_projects = Project.objects.filter(is_approved=False).order_by('-created_at')
    return JsonResponse(ProjectSerializer(pending_projects, many=True).data, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['ADMIN'])
def approve_project(request):
    data = json.loads(request.body)
    project_id = data.get('project_id')
    
    project = Project.objects.get(id=project_id)
    project.is_approved = True
    project.save()
    
    return JsonResponse({'message': 'Project approved successfully', 'project': ProjectSerializer(project).data})

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['ADMIN'])
def reject_project(request):
    data = json.loads(request.body)
    project_id = data.get('project_id')
    
    project = Project.objects.get(id=project_id)
    project.delete()
    
    return JsonResponse({'message': 'Project rejected and deleted'})
