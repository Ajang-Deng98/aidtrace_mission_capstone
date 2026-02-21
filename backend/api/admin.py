from django.contrib import admin
from .models import *

admin.site.register(User)
admin.site.register(Project)
admin.site.register(Funding)
admin.site.register(SupplierAssignment)
admin.site.register(FieldOfficerAssignment)
admin.site.register(Beneficiary)
admin.site.register(Distribution)
admin.site.register(OTP)
admin.site.register(PublicReport)
