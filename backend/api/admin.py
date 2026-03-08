from django.contrib import admin
from django.utils.html import format_html
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
    readonly_fields = ('document1_display', 'document2_display', 'document3_display')
    verbose_name = 'Project'
    verbose_name_plural = 'Projects'
    
    def document1_display(self, obj):
        if obj.document1 and obj.document1_name:
            return format_html(
                '<a href="/api/project/{}/document/1/" target="_blank">{}</a>',
                obj.id, obj.document1_name
            )
        return "No document"
    document1_display.short_description = 'Document 1'
    
    def document2_display(self, obj):
        if obj.document2 and obj.document2_name:
            return format_html(
                '<a href="/api/project/{}/document/2/" target="_blank">{}</a>',
                obj.id, obj.document2_name
            )
        return "No document"
    document2_display.short_description = 'Document 2'
    
    def document3_display(self, obj):
        if obj.document3 and obj.document3_name:
            return format_html(
                '<a href="/api/project/{}/document/3/" target="_blank">{}</a>',
                obj.id, obj.document3_name
            )
        return "No document"
    document3_display.short_description = 'Document 3'

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

@admin.register(SupplyQuoteRequest)
class SupplyQuoteRequestAdmin(admin.ModelAdmin):
    list_display = ('project', 'ngo', 'delivery_date', 'created_at')
    list_filter = ('delivery_date', 'created_at')
    search_fields = ('project__title', 'ngo__name', 'delivery_location')
    ordering = ('-created_at',)

@admin.register(SupplierQuote)
class SupplierQuoteAdmin(admin.ModelAdmin):
    list_display = ('quote_request', 'supplier', 'quoted_amount', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('quote_request__project__title', 'supplier__name')
    ordering = ('-created_at',)

@admin.register(QuoteSelection)
class QuoteSelectionAdmin(admin.ModelAdmin):
    list_display = ('quote_request', 'selected_quote', 'ngo', 'created_at')
    search_fields = ('quote_request__project__title', 'ngo__name', 'selected_quote__supplier__name')
    ordering = ('-created_at',)

