from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class User(models.Model):
    ROLE_CHOICES = [
        ('DONOR', 'Donor'),
        ('NGO', 'NGO'),
        ('SUPPLIER', 'Supplier'),
        ('FIELD_OFFICER', 'Field Officer'),
        ('ADMIN', 'Admin'),
    ]
    
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    name = models.CharField(max_length=255)
    contact = models.CharField(max_length=50, blank=True)
    wallet_address = models.CharField(max_length=255, blank=True)
    license_number = models.CharField(max_length=255, blank=True)
    is_approved = models.BooleanField(default=False)
    blockchain_tx = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    class Meta:
        db_table = 'users'

class Project(models.Model):
    STATUS_CHOICES = [
        ('PENDING_FUNDING', 'Pending Funding'),
        ('FUNDED', 'Funded'),
        ('SUPPLIER_ASSIGNED', 'Supplier Assigned'),
        ('SUPPLIER_CONFIRMED', 'Supplier Confirmed'),
        ('FIELD_OFFICER_ASSIGNED', 'Field Officer Assigned'),
        ('FIELD_OFFICER_CONFIRMED', 'Field Officer Confirmed'),
        ('IN_DISTRIBUTION', 'In Distribution'),
        ('COMPLETED', 'Completed'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    required_items = models.JSONField()
    budget_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    duration_months = models.IntegerField(default=1)
    target_beneficiaries = models.IntegerField(default=0)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    category = models.CharField(max_length=100, default='General Aid')
    is_approved = models.BooleanField(default=False)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING_FUNDING')
    ngo = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_projects')
    project_hash = models.CharField(max_length=255, blank=True)
    blockchain_tx = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'projects'

class Funding(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='fundings')
    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fundings')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    donor_signature = models.CharField(max_length=255, blank=True)
    ngo_signature = models.CharField(max_length=255, blank=True)
    blockchain_tx = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'fundings'

class SupplierAssignment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='supplier_assignments')
    supplier = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignments')
    items = models.JSONField()
    delivery_duration = models.IntegerField(default=0)
    delivery_location = models.CharField(max_length=255, blank=True)
    quantity = models.IntegerField(default=0)
    field_officer_incharge = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='supervised_assignments')
    confirmed = models.BooleanField(default=False)
    signature = models.CharField(max_length=255, blank=True)
    blockchain_tx = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'supplier_assignments'

class FieldOfficerAssignment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='field_officer_assignments')
    field_officer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='field_assignments')
    confirmed = models.BooleanField(default=False)
    signature = models.CharField(max_length=255, blank=True)
    blockchain_tx = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'field_officer_assignments'

class Beneficiary(models.Model):
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='beneficiaries')
    face_photo = models.TextField(blank=True)  # Base64 encoded image
    face_verified = models.BooleanField(default=False)
    confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'beneficiaries'

class Distribution(models.Model):
    beneficiary = models.ForeignKey(Beneficiary, on_delete=models.CASCADE, related_name='distributions')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='distributions')
    field_officer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='distributions')
    face_scan_photo = models.TextField(blank=True)  # Face scan during distribution
    face_scan_verified = models.BooleanField(default=False)
    otp_verified = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'distributions'

class OTP(models.Model):
    phone_number = models.CharField(max_length=50)
    code = models.CharField(max_length=6)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    class Meta:
        db_table = 'otps'

class PublicReport(models.Model):
    project_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    contact_info = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'public_reports'
