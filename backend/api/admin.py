from django.contrib import admin
from .models import *

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'name', 'email', 'role', 'is_approved', 'created_at')
    list_filter = ('role', 'is_approved')
    search_fields = ('username', 'name', 'email')
    ordering = ('-created_at',)
    verbose_name = 'User'
    verbose_name_plural = 'Users'

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'ngo', 'location', 'status', 'budget_amount', 'is_approved', 'created_at')
    list_filter = ('status', 'is_approved', 'category')
    search_fields = ('title', 'location', 'ngo__name')
    ordering = ('-created_at',)
    verbose_name = 'Project'
    verbose_name_plural = 'Projects'

@admin.register(Funding)
class FundingAdmin(admin.ModelAdmin):
    list_display = ('project', 'donor', 'amount', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('project__title', 'donor__name')
    ordering = ('-created_at',)
    verbose_name = 'Funding'
    verbose_name_plural = 'Fundings'

@admin.register(SupplierAssignment)
class SupplierAssignmentAdmin(admin.ModelAdmin):
    list_display = ('project', 'supplier', 'confirmed', 'created_at')
    list_filter = ('confirmed',)
    search_fields = ('project__title', 'supplier__name')
    ordering = ('-created_at',)
    verbose_name = 'Supplier Assignment'
    verbose_name_plural = 'Supplier Assignments'

@admin.register(FieldOfficerAssignment)
class FieldOfficerAssignmentAdmin(admin.ModelAdmin):
    list_display = ('project', 'field_officer', 'confirmed', 'created_at')
    list_filter = ('confirmed',)
    search_fields = ('project__title', 'field_officer__name')
    ordering = ('-created_at',)
    verbose_name = 'Field Officer Assignment'
    verbose_name_plural = 'Field Officer Assignments'

@admin.register(Beneficiary)
class BeneficiaryAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'project', 'face_verified', 'confirmed', 'created_at')
    list_filter = ('face_verified', 'confirmed')
    search_fields = ('name', 'phone_number', 'project__title')
    ordering = ('-created_at',)
    verbose_name = 'Beneficiary'
    verbose_name_plural = 'Beneficiaries'

@admin.register(Distribution)
class DistributionAdmin(admin.ModelAdmin):
    list_display = ('beneficiary', 'project', 'field_officer', 'completed', 'created_at')
    list_filter = ('completed', 'otp_verified', 'face_scan_verified')
    search_fields = ('beneficiary__name', 'project__title', 'field_officer__name')
    ordering = ('-created_at',)
    verbose_name = 'Distribution'
    verbose_name_plural = 'Distributions'

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'code', 'verified', 'created_at', 'expires_at')
    list_filter = ('verified',)
    search_fields = ('phone_number',)
    ordering = ('-created_at',)
    verbose_name = 'OTP'
    verbose_name_plural = 'OTPs'

@admin.register(PublicReport)
class PublicReportAdmin(admin.ModelAdmin):
    list_display = ('project_name', 'location', 'created_at')
    search_fields = ('project_name', 'location', 'description')
    ordering = ('-created_at',)
    verbose_name = 'Public Report'
    verbose_name_plural = 'Public Reports'

