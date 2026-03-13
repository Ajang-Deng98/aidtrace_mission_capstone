import os
import django
import sys

# Add the project directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aidtrace.settings')
django.setup()

from api.models import User, Project
from django.contrib.auth.hashers import make_password
import json

print("=== Adding Test Data to Database ===\n")

# Create test users if they don't exist
print("1. Creating test users...")

# Create NGO user
ngo_user, created = User.objects.get_or_create(
    username='testngo',
    defaults={
        'email': 'ngo@test.com',
        'name': 'Test NGO Organization',
        'role': 'NGO',
        'contact': '+211123456789',
        'password': make_password('password123'),
        'is_approved': True
    }
)
if created:
    print(f"   ✓ Created NGO user: {ngo_user.username}")
else:
    print(f"   - NGO user already exists: {ngo_user.username}")

# Create Donor user
donor_user, created = User.objects.get_or_create(
    username='testdonor',
    defaults={
        'email': 'donor@test.com',
        'name': 'Test Donor Foundation',
        'role': 'DONOR',
        'contact': '+211987654321',
        'password': make_password('password123'),
        'is_approved': True
    }
)
if created:
    print(f"   ✓ Created Donor user: {donor_user.username}")
else:
    print(f"   - Donor user already exists: {donor_user.username}")

# Create Supplier user
supplier_user, created = User.objects.get_or_create(
    username='testsupplier',
    defaults={
        'email': 'supplier@test.com',
        'name': 'Test Supplier Company',
        'role': 'SUPPLIER',
        'contact': '+211555666777',
        'password': make_password('password123'),
        'is_approved': True
    }
)
if created:
    print(f"   ✓ Created Supplier user: {supplier_user.username}")
else:
    print(f"   - Supplier user already exists: {supplier_user.username}")

# Create test projects
print("\n2. Creating test projects...")

projects_data = [
    {
        'title': 'Emergency Food Distribution - Juba',
        'description': 'Providing emergency food supplies to 500 families affected by flooding in Juba region',
        'location': 'Juba, Central Equatoria',
        'category': 'Food Distribution',
        'budget_amount': 25000.00,
        'duration_months': 3,
        'target_beneficiaries': 500,
        'required_items': ['Rice', 'Cooking Oil', 'Beans', 'Salt', 'Sugar'],
        'start_date': '2026-04-01',
        'end_date': '2026-06-30',
    },
    {
        'title': 'Medical Supplies for Rural Clinics',
        'description': 'Supplying essential medical equipment and medicines to 10 rural health clinics',
        'location': 'Unity State',
        'category': 'Medical Supplies',
        'budget_amount': 45000.00,
        'duration_months': 6,
        'target_beneficiaries': 2000,
        'required_items': ['Antibiotics', 'Bandages', 'Syringes', 'Thermometers', 'First Aid Kits'],
        'start_date': '2026-04-15',
        'end_date': '2026-10-15',
    },
    {
        'title': 'Clean Water Access Project',
        'description': 'Installing water purification systems and drilling boreholes in 5 villages',
        'location': 'Upper Nile State',
        'category': 'Water & Sanitation',
        'budget_amount': 60000.00,
        'duration_months': 8,
        'target_beneficiaries': 3000,
        'required_items': ['Water Pumps', 'Purification Tablets', 'Storage Tanks', 'Pipes', 'Tools'],
        'start_date': '2026-05-01',
        'end_date': '2026-12-31',
    },
    {
        'title': 'School Supplies for Displaced Children',
        'description': 'Providing educational materials and school supplies to children in IDP camps',
        'location': 'Bentiu, Unity State',
        'category': 'Education',
        'budget_amount': 15000.00,
        'duration_months': 4,
        'target_beneficiaries': 800,
        'required_items': ['Notebooks', 'Pens', 'Pencils', 'Textbooks', 'School Bags'],
        'start_date': '2026-04-01',
        'end_date': '2026-07-31',
    },
    {
        'title': 'Shelter Materials for Flood Victims',
        'description': 'Providing emergency shelter materials to families displaced by seasonal flooding',
        'location': 'Jonglei State',
        'category': 'Shelter',
        'budget_amount': 35000.00,
        'duration_months': 5,
        'target_beneficiaries': 600,
        'required_items': ['Tarpaulins', 'Ropes', 'Nails', 'Timber', 'Plastic Sheets'],
        'start_date': '2026-04-10',
        'end_date': '2026-09-10',
    }
]

created_count = 0
for project_data in projects_data:
    # Check if project already exists
    if not Project.objects.filter(title=project_data['title']).exists():
        project = Project.objects.create(
            ngo=ngo_user,
            desired_donors=[donor_user.id],
            is_approved=True,  # Pre-approve for testing
            status='CREATED',
            **project_data
        )
        created_count += 1
        print(f"   ✓ Created project: {project.title}")
    else:
        print(f"   - Project already exists: {project_data['title']}")

print(f"\n=== Summary ===")
print(f"Total projects in database: {Project.objects.count()}")
print(f"Approved projects: {Project.objects.filter(is_approved=True).count()}")
print(f"Total users: {User.objects.count()}")
print(f"\n=== Test Credentials ===")
print(f"NGO Login: username='testngo', password='password123'")
print(f"Donor Login: username='testdonor', password='password123'")
print(f"Supplier Login: username='testsupplier', password='password123'")
print(f"\nYou can now login with these credentials on your Vercel app!")
