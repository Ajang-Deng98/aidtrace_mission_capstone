import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aidtrace.settings')
django.setup()

from api.views import get_all_beneficiaries
from django.test import RequestFactory
from api.auth import create_token
from api.models import User

# Create a test request
factory = RequestFactory()
request = factory.get('/api/field-officer/beneficiary/all/', {'project_id': '1'})

# Create a mock user for authentication
try:
    user = User.objects.filter(role='FIELD_OFFICER').first()
    if not user:
        user = User.objects.filter(role='NGO').first()
    
    if user:
        token = create_token(user)
        request.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'
        request.user_data = {'user_id': user.id, 'role': user.role}
        
        # Call the view
        response = get_all_beneficiaries(request)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.content.decode()}")
    else:
        print("No user found to test with")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
