from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import *
from .serializers import *
from .auth import create_token, require_auth
from .blockchain import blockchain_service
from .otp_service import otp_service
from django.core.mail import send_mail
from django.conf import settings

@csrf_exempt
@require_http_methods(["POST"])
def forgot_password(request):
    data = json.loads(request.body)
    email = data.get('email')
    
    try:
        user = User.objects.get(email=email)
        token = PasswordResetToken.objects.create(user=user)
        
        reset_link = f"http://localhost:3000/reset-password/{token.token}"
        send_mail(
            'AidTrace - Password Reset',
            f'Click this link to reset your password: {reset_link}\n\nThis link expires in 24 hours.',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )
        return JsonResponse({'message': 'Password reset link sent to your email'})
    except User.DoesNotExist:
        return JsonResponse({'message': 'Password reset link sent to your email'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def reset_password(request):
    data = json.loads(request.body)
    token = data.get('token')
    new_password = data.get('password')
    
    try:
        reset_token = PasswordResetToken.objects.get(token=token)
        if not reset_token.is_valid():
            return JsonResponse({'error': 'Reset link has expired'}, status=400)
        
        user = reset_token.user
        user.set_password(new_password)
        user.save()
        reset_token.delete()
        
        return JsonResponse({'message': 'Password reset successful'})
    except PasswordResetToken.DoesNotExist:
        return JsonResponse({'error': 'Invalid reset link'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

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
        document1=data.get('document1', ''),
        document1_name=data.get('document1_name', ''),
        document2=data.get('document2', ''),
        document2_name=data.get('document2_name', ''),
        document3=data.get('document3', ''),
        document3_name=data.get('document3_name', ''),
        ngo=ngo,
        is_approved=False,
        status='CREATED'
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
            project.required_items,
            project.budget_amount
        )
        project.blockchain_tx = tx_hash
    except Exception as e:
        print(f"Blockchain transaction failed: {e}")
        # Continue without blockchain - store project anyway
    
    project.save()
    
    return JsonResponse({
        'message': 'Project created successfully. Waiting for admin approval before it appears to donors.',
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
    import sys
    sys.stderr.write("\n\n*** CONFIRM FUNDING CALLED ***\n\n")
    sys.stderr.flush()
    
    data = json.loads(request.body)
    
    funding = Funding.objects.get(id=data.get('funding_id'))
    funding.ngo_signature = data.get('signature')
    
    sys.stderr.write(f"Funding ID: {funding.id}, Signature: {funding.ngo_signature}\n")
    sys.stderr.flush()
    
    # Record NGO funding confirmation on blockchain
    try:
        sys.stderr.write("Calling blockchain...\n")
        sys.stderr.flush()
        tx_hash = blockchain_service.confirm_funding(
            funding.project.id,
            funding.id,
            funding.ngo_signature,
            funding.donor_signature
        )
        sys.stderr.write(f"Blockchain returned: {tx_hash}\n")
        sys.stderr.flush()
        if tx_hash:
            funding.ngo_confirmation_tx = tx_hash
    except Exception as e:
        sys.stderr.write(f"ERROR: {e}\n")
        sys.stderr.flush()
        import traceback
        traceback.print_exc(file=sys.stderr)
    
    funding.save()
    sys.stderr.write(f"Saved. ngo_confirmation_tx = {funding.ngo_confirmation_tx}\n\n")
    sys.stderr.flush()
    
    # Update project status to FUNDED
    funding.project.status = 'FUNDED'
    funding.project.save()
    
    return JsonResponse(FundingSerializer(funding).data)


# Donor Views
@require_http_methods(["GET"])
@require_auth(['DONOR'])
def get_all_projects(request):
    donor = User.objects.get(id=request.user_data['user_id'])
    # Show projects that are approved and available for funding
    projects = Project.objects.filter(
        is_approved=True, 
        status__in=['PENDING_FUNDING', 'CREATED']
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
        tx_hash = ''
        try:
            donor_wallet = donor.wallet_address if donor.wallet_address else blockchain_service.get_account()
            ngo_wallet = project.ngo.wallet_address if project.ngo.wallet_address else blockchain_service.get_account()
            
            tx_hash = blockchain_service.record_funding(
                project.id,
                donor_wallet,
                ngo_wallet,
                data.get('amount')
            )
            print(f"Donor funding blockchain hash: {tx_hash}")
        except Exception as e:
            print(f"Blockchain funding record failed: {e}")
            import traceback
            print(traceback.format_exc())
        
        funding = Funding.objects.create(
            project=project,
            donor=donor,
            amount=data.get('amount'),
            donor_signature=data.get('signature', ''),
            ngo_signature='',
            blockchain_tx=tx_hash
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
@require_auth(['NGO'])
def download_supplier_quote(request, quote_id):
    from django.http import HttpResponse
    try:
        quote = SupplierQuote.objects.get(id=quote_id)
        quote_request = quote.quote_request
        project = quote_request.project
        
        html_content = f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Supplier Quote - {quote.supplier.name}</title>
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
            <h1 style="margin: 10px 0; color: #333;">Supplier Quote</h1>
            <p style="color: #666; margin: 5px 0;">Blockchain-Verified Supply Quote</p>
        </div>

        <div class="section">
            <div class="section-title">Project Information</div>
            <div class="info-row"><div class="info-label">Project:</div><div class="info-value">{project.title}</div></div>
            <div class="info-row"><div class="info-label">Location:</div><div class="info-value">{project.location}</div></div>
            <div class="info-row"><div class="info-label">NGO:</div><div class="info-value">{project.ngo.name}</div></div>
            <div class="info-row"><div class="info-label">Delivery Location:</div><div class="info-value">{quote_request.delivery_location}</div></div>
            <div class="info-row"><div class="info-label">Required Delivery Date:</div><div class="info-value">{quote_request.delivery_date}</div></div>
        </div>

        <div class="section">
            <div class="section-title">Supplier Information</div>
            <div class="info-row"><div class="info-label">Supplier Name:</div><div class="info-value">{quote.supplier.name}</div></div>
            <div class="info-row"><div class="info-label">Contact:</div><div class="info-value">{quote.supplier.contact}</div></div>
            <div class="info-row"><div class="info-label">Email:</div><div class="info-value">{quote.supplier.email}</div></div>
        </div>

        <div class="section">
            <div class="section-title">Quote Details</div>
            <div class="info-row"><div class="info-label">Quoted Amount:</div><div class="info-value"><span class="amount">${quote.quoted_amount}</span></div></div>
            <div class="info-row"><div class="info-label">Delivery Timeline:</div><div class="info-value">{quote.delivery_timeline if quote.delivery_timeline else 'As per terms'}</div></div>
            <div class="info-row"><div class="info-label">Payment Terms:</div><div class="info-value">{quote.payment_terms if quote.payment_terms else 'Standard'}</div></div>
            <div class="info-row"><div class="info-label">Warranty Period:</div><div class="info-value">{quote.warranty_period if quote.warranty_period else 'N/A'}</div></div>
            <div class="info-row"><div class="info-label">Quote Date:</div><div class="info-value">{quote.created_at.strftime('%B %d, %Y at %I:%M %p')}</div></div>
        </div>

        <div class="section">
            <div class="section-title">Delivery Terms</div>
            <p style="color: #333; line-height: 1.6;">{quote.delivery_terms}</p>
        </div>

        {f'<div class="section"><div class="section-title">Quality Certifications</div><p style="color: #333; line-height: 1.6;">{quote.quality_certifications}</p></div>' if quote.quality_certifications else ''}
        {f'<div class="section"><div class="section-title">Technical Specifications</div><p style="color: #333; line-height: 1.6;">{quote.technical_specifications}</p></div>' if quote.technical_specifications else ''}

        <div class="section">
            <div class="section-title">Digital Signature</div>
            <div class="signature-box">{quote.signature}</div>
        </div>

        {f'<div class="section"><div class="section-title">Blockchain Verification</div><div class="info-row"><div class="info-label">Transaction Hash:</div><div class="info-value" style="word-break: break-all; font-family: monospace; font-size: 11px;">{quote.blockchain_tx}</div></div><div style="margin-top: 10px; padding: 10px; background: #e8f5e9; border-radius: 5px; color: #2e7d32;">✓ This quote is verified and recorded on the blockchain</div></div>' if quote.blockchain_tx else ''}

        <div class="footer">
            <p>This is an official supplier quote generated by AidTrace</p>
            <p>Quote ID: {quote.id} | Generated on {quote.created_at.strftime('%Y-%m-%d')}</p>
        </div>
    </div>
</body>
</html>'''
        
        response = HttpResponse(html_content, content_type='text/html')
        response['Content-Disposition'] = f'attachment; filename="AidTrace_Supplier_Quote_{quote.supplier.name}_{quote.id}.html"'
        return response
    except SupplierQuote.DoesNotExist:
        return JsonResponse({'error': 'Quote not found'}, status=404)
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
def confirm_assignment(request):
    data = json.loads(request.body)
    
    supplier = User.objects.get(id=request.user_data['user_id'])
    assignment = SupplierAssignment.objects.get(id=data.get('assignment_id'))
    
    # Verify this supplier owns the assignment
    if assignment.supplier != supplier:
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    
    assignment.confirmed = True
    assignment.signature = data.get('signature')
    
    # Record on blockchain
    try:
        supplier_address = supplier.wallet_address if supplier.wallet_address else blockchain_service.get_account()
        tx_hash = blockchain_service.record_supplier_confirmation(
            assignment.project.id,
            assignment.project.title,
            assignment.delivery_location,
            supplier_address,
            assignment.signature
        )
        if tx_hash:
            assignment.blockchain_tx = tx_hash
    except Exception as e:
        print(f"Blockchain supplier confirmation failed: {e}")
    
    assignment.save()
    assignment.project.status = 'SUPPLIER_CONFIRMED'
    assignment.project.save()
    
    return JsonResponse({
        'message': 'Assignment confirmed successfully and recorded on blockchain',
        'assignment': {
            'id': assignment.id,
            'project_title': assignment.project.title,
            'blockchain_tx': assignment.blockchain_tx
        }
    })


# Field Officer Views
@require_http_methods(["GET"])
@require_auth(['FIELD_OFFICER'])
def get_field_officer_assignments(request):
    officer = User.objects.get(id=request.user_data['user_id'])
    assignments = FieldOfficerAssignment.objects.filter(field_officer=officer)
    
    data = []
    for assignment in assignments:
        project = assignment.project
        
        # Get quote selection information
        quote_selection = QuoteSelection.objects.filter(quote_request__project=project).first()
        supplier_info = None
        supplier_items = []
        delivery_info = None
        
        if quote_selection:
            supplier_info = {
                'name': quote_selection.selected_quote.supplier.name,
                'contact': quote_selection.selected_quote.supplier.contact,
                'quoted_amount': str(quote_selection.selected_quote.quoted_amount),
                'delivery_terms': quote_selection.selected_quote.delivery_terms
            }
            supplier_items = quote_selection.quote_request.items
            
            # Get supplier delivery confirmation
            delivery_confirmation = SupplierDeliveryConfirmation.objects.filter(quote_selection=quote_selection).first()
            if delivery_confirmation:
                delivery_info = {
                    'delivery_signature': delivery_confirmation.delivery_signature,
                    'delivery_notes': delivery_confirmation.delivery_notes,
                    'blockchain_tx': delivery_confirmation.blockchain_tx,
                    'delivered_at': delivery_confirmation.created_at
                }
        
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
            'supplier_info': supplier_info,
            'supplier_items': supplier_items,
            'delivery_info': delivery_info,
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
    
    # Verify field officer owns the assignment
    if assignment.field_officer != officer:
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    
    # Require signature from field officer
    signature = data.get('signature', '')
    if not signature:
        return JsonResponse({'error': 'Digital signature is required'}, status=400)
    
    assignment.confirmed = True
    assignment.signature = signature
    
    # Record on blockchain - Final confirmation step
    try:
        officer_address = officer.wallet_address if officer.wallet_address else blockchain_service.get_account()
        tx_hash = blockchain_service.record_field_officer_confirmation(
            assignment.project.id,
            assignment.project.title,
            assignment.project.location,
            officer_address,
            assignment.signature
        )
        if tx_hash:
            assignment.blockchain_tx = tx_hash
    except Exception as e:
        print(f"Blockchain field officer confirmation failed: {e}")
        # Continue without blockchain
    
    assignment.save()
    # Final step - project is now ready for distribution
    assignment.project.status = 'READY_FOR_DISTRIBUTION'
    assignment.project.save()
    
    return JsonResponse({
        'message': 'Final confirmation completed - Project ready for distribution',
        'assignment': {
            'id': assignment.id,
            'project_title': assignment.project.title,
            'blockchain_tx': assignment.blockchain_tx,
            'status': assignment.project.status
        }
    })

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
    project.status = 'PENDING_FUNDING'
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

@require_http_methods(["GET"])
@require_auth(['DONOR', 'NGO'])
def get_project_workflow_status(request, project_id):
    """Get complete workflow status for a project"""
    try:
        project = Project.objects.get(id=project_id)
        
        # Get funding information
        funding = Funding.objects.filter(project=project).first()
        
        # Get quote request
        quote_request = SupplyQuoteRequest.objects.filter(project=project).first()
        
        # Get quote selection
        quote_selection = QuoteSelection.objects.filter(quote_request__project=project).first()
        
        # Get field officer assignment
        field_assignment = FieldOfficerAssignment.objects.filter(project=project).first()
        
        # Get supplier delivery confirmation
        delivery_confirmation = None
        if quote_selection:
            delivery_confirmation = SupplierDeliveryConfirmation.objects.filter(quote_selection=quote_selection).first()
        
        workflow_data = {
            'project_id': project.id,
            'project_title': project.title,
            'project_status': project.status,
            'project_blockchain_tx': project.blockchain_tx,
            'funding': None,
            'quote_request': None,
            'quote_selection': None,
            'field_officer_assignment': None,
            'supplier_delivery': None,
            'field_officer_confirmation': None
        }
        
        # Add funding information
        if funding:
            workflow_data['funding'] = {
                'id': funding.id,
                'donor_name': funding.donor.name,
                'amount': str(funding.amount),
                'donor_signature': funding.donor_signature,
                'ngo_signature': funding.ngo_signature,
                'blockchain_tx': funding.blockchain_tx,
                'ngo_confirmation_tx': funding.ngo_confirmation_tx,
                'created_at': funding.created_at
            }
        
        if quote_request:
            workflow_data['quote_request'] = {
                'id': quote_request.id,
                'delivery_location': quote_request.delivery_location,
                'delivery_date': quote_request.delivery_date,
                'proposed_budget': str(quote_request.proposed_budget),
                'status': quote_request.status,
                'blockchain_tx': quote_request.blockchain_tx,
                'created_at': quote_request.created_at,
                'quotes_count': SupplierQuote.objects.filter(quote_request=quote_request).count()
            }
        
        if quote_selection:
            workflow_data['quote_selection'] = {
                'id': quote_selection.id,
                'supplier_name': quote_selection.selected_quote.supplier.name,
                'quoted_amount': str(quote_selection.selected_quote.quoted_amount),
                'ngo_signature': quote_selection.ngo_signature,
                'blockchain_tx': quote_selection.blockchain_tx,
                'created_at': quote_selection.created_at
            }
        
        if field_assignment:
            workflow_data['field_officer_assignment'] = {
                'id': field_assignment.id,
                'field_officer_name': field_assignment.field_officer.name,
                'confirmed': field_assignment.confirmed,
                'signature': field_assignment.signature,
                'blockchain_tx': field_assignment.blockchain_tx,
                'created_at': field_assignment.created_at
            }
        
        if delivery_confirmation:
            workflow_data['supplier_delivery'] = {
                'id': delivery_confirmation.id,
                'supplier_name': delivery_confirmation.supplier.name,
                'field_officer_name': delivery_confirmation.field_officer.name,
                'delivery_signature': delivery_confirmation.delivery_signature,
                'delivery_notes': delivery_confirmation.delivery_notes,
                'blockchain_tx': delivery_confirmation.blockchain_tx,
                'created_at': delivery_confirmation.created_at
            }
        
        if field_assignment:
            workflow_data['field_officer_confirmation'] = {
                'confirmed': field_assignment.confirmed,
                'signature': field_assignment.signature if field_assignment.confirmed else None,
                'blockchain_tx': field_assignment.blockchain_tx if field_assignment.confirmed else None,
                'confirmed_at': field_assignment.created_at if field_assignment.confirmed else None,
                'field_officer_name': field_assignment.field_officer.name
            }
        
        return JsonResponse(workflow_data)
        
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
