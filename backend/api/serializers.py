from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'name', 'contact', 'wallet_address', 'license_number', 'is_approved', 'blockchain_tx', 'created_at']

class ProjectSerializer(serializers.ModelSerializer):
    ngo_name = serializers.CharField(source='ngo.name', read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'

class FundingSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source='donor.name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = Funding
        fields = '__all__'

class SupplierAssignmentSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = SupplierAssignment
        fields = '__all__'

class FieldOfficerAssignmentSerializer(serializers.ModelSerializer):
    field_officer_name = serializers.CharField(source='field_officer.name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = FieldOfficerAssignment
        fields = '__all__'

class BeneficiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiary
        fields = '__all__'

class DistributionSerializer(serializers.ModelSerializer):
    beneficiary_name = serializers.CharField(source='beneficiary.name', read_only=True)
    
    class Meta:
        model = Distribution
        fields = '__all__'

class PublicReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicReport
        fields = '__all__'
