from django.db import models
from django.contrib.auth.hashers import make_password, check_password
import uuid
from django.utils import timezone
from datetime import timedelta

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
    
    def __str__(self):
        return f"{self.name} ({self.role})"
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

class Project(models.Model):
    STATUS_CHOICES = [
        ('CREATED', 'Created'),
        ('PENDING_FUNDING', 'Pending Funding'),
        ('FUNDED', 'Funded'),
        ('QUOTE_REQUESTED', 'Quote Requested'),
        ('QUOTES_RECEIVED', 'Quotes Received'),
        ('QUOTE_SELECTED', 'Quote Selected'),
        ('SUPPLIER_DELIVERED', 'Supplier Delivered'),
        ('FIELD_OFFICER_CONFIRMED', 'Field Officer Confirmed'),
        ('READY_FOR_DISTRIBUTION', 'Ready for Distribution'),
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
    desired_donors = models.JSONField(default=list, blank=True)
    project_hash = models.CharField(max_length=255, blank=True)
    blockchain_tx = models.CharField(max_length=255, blank=True)
    document1 = models.TextField(blank=True)  # Base64 encoded document
    document1_name = models.CharField(max_length=255, blank=True)
    document2 = models.TextField(blank=True)
    document2_name = models.CharField(max_length=255, blank=True)
    document3 = models.TextField(blank=True)
    document3_name = models.CharField(max_length=255, blank=True)
    beneficiaries_csv = models.TextField(blank=True)  # Base64 encoded CSV file
    beneficiaries_csv_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'projects'
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

class Funding(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='fundings')
    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fundings')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    donor_signature = models.CharField(max_length=255, blank=True)
    ngo_signature = models.CharField(max_length=255, blank=True)
    blockchain_tx = models.CharField(max_length=255, blank=True)
    ngo_confirmation_tx = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.donor.name} funded {self.project.title} - ${self.amount}"
    
    class Meta:
        db_table = 'fundings'
        verbose_name = 'Funding'
        verbose_name_plural = 'Fundings'

class SupplyQuoteRequest(models.Model):
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('SELECTED', 'Selected'),
        ('CLOSED', 'Closed'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='quote_requests')
    ngo = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quote_requests')
    items = models.JSONField()
    delivery_location = models.CharField(max_length=255)
    delivery_date = models.DateField()
    proposed_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    additional_requirements = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    blockchain_tx = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Quote Request - {self.project.title}"
    
    class Meta:
        db_table = 'supply_quote_requests'
        verbose_name = 'Supply Quote Request'
        verbose_name_plural = 'Supply Quote Requests'

class SupplierQuote(models.Model):
    quote_request = models.ForeignKey(SupplyQuoteRequest, on_delete=models.CASCADE, related_name='supplier_quotes')
    supplier = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submitted_quotes')
    quoted_amount = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_terms = models.TextField()
    delivery_timeline = models.CharField(max_length=255, blank=True)
    quality_certifications = models.TextField(blank=True)
    payment_terms = models.CharField(max_length=255, blank=True)
    warranty_period = models.CharField(max_length=255, blank=True)
    technical_specifications = models.TextField(blank=True)
    supplier_experience = models.TextField(blank=True)
    references = models.TextField(blank=True)
    signature = models.CharField(max_length=255)
    blockchain_tx = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.supplier.name} - ${self.quoted_amount}"
    
    class Meta:
        db_table = 'supplier_quotes'
        verbose_name = 'Supplier Quote'
        verbose_name_plural = 'Supplier Quotes'

class QuoteSelection(models.Model):
    quote_request = models.ForeignKey(SupplyQuoteRequest, on_delete=models.CASCADE, related_name='selections')
    selected_quote = models.ForeignKey(SupplierQuote, on_delete=models.CASCADE, related_name='selections')
    ngo = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quote_selections')
    ngo_signature = models.CharField(max_length=255)
    blockchain_tx = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Selected: {self.selected_quote.supplier.name} - ${self.selected_quote.quoted_amount}"
    
    class Meta:
        db_table = 'quote_selections'
        verbose_name = 'Quote Selection'
        verbose_name_plural = 'Quote Selections'

class SupplierDeliveryConfirmation(models.Model):
    quote_selection = models.ForeignKey(QuoteSelection, on_delete=models.CASCADE, related_name='delivery_confirmations')
    supplier = models.ForeignKey(User, on_delete=models.CASCADE, related_name='delivery_confirmations')
    field_officer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_deliveries')
    delivery_signature = models.CharField(max_length=255)
    delivery_notes = models.TextField(blank=True)
    blockchain_tx = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Delivery: {self.supplier.name} to {self.field_officer.name}"
    
    class Meta:
        db_table = 'supplier_delivery_confirmations'
        verbose_name = 'Supplier Delivery Confirmation'
        verbose_name_plural = 'Supplier Delivery Confirmations'

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
    
    def __str__(self):
        return f"{self.supplier.name} - {self.project.title}"
    
    class Meta:
        db_table = 'supplier_assignments'
        verbose_name = 'Supplier Assignment'
        verbose_name_plural = 'Supplier Assignments'

class FieldOfficerAssignment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='field_officer_assignments')
    field_officer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='field_assignments')
    confirmed = models.BooleanField(default=False)
    signature = models.CharField(max_length=255, blank=True)
    blockchain_tx = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.field_officer.name} - {self.project.title}"
    
    class Meta:
        db_table = 'field_officer_assignments'
        verbose_name = 'Field Officer Assignment'
        verbose_name_plural = 'Field Officer Assignments'

class Beneficiary(models.Model):
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=50)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='beneficiaries')
    face_photo = models.TextField(blank=True)  # Base64 encoded image
    face_descriptor = models.TextField(blank=True)  # JSON array of 128 numbers from Face-API.js
    face_verified = models.BooleanField(default=False)
    confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.phone_number}"
    
    class Meta:
        db_table = 'beneficiaries'
        verbose_name = 'Beneficiary'
        verbose_name_plural = 'Beneficiaries'

class Distribution(models.Model):
    beneficiary = models.ForeignKey(Beneficiary, on_delete=models.CASCADE, related_name='distributions')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='distributions')
    field_officer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='distributions')
    face_scan_photo = models.TextField(blank=True)  # Face scan during distribution
    face_scan_verified = models.BooleanField(default=False)
    otp_verified = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.beneficiary.name} - {self.project.title}"
    
    class Meta:
        db_table = 'distributions'
        verbose_name = 'Distribution'
        verbose_name_plural = 'Distributions'

class OTP(models.Model):
    phone_number = models.CharField(max_length=50)
    code = models.CharField(max_length=6)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def __str__(self):
        return f"{self.phone_number} - {self.code}"
    
    class Meta:
        db_table = 'otps'
        verbose_name = 'OTP'
        verbose_name_plural = 'OTPs'

class PublicReport(models.Model):
    project_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    contact_info = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.project_name} - {self.location}"
    
    class Meta:
        db_table = 'public_reports'
        verbose_name = 'Public Report'
        verbose_name_plural = 'Public Reports'

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def is_valid(self):
        return timezone.now() < self.created_at + timedelta(hours=24)
    
    class Meta:
        db_table = 'password_reset_tokens'

class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activity_logs'
        ordering = ['-created_at']
