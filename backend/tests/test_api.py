"""
Backend Unit Tests - Safe for Production
Tests use Django's test database (separate from production)
Run with: python manage.py test tests
"""
from django.test import TestCase, Client
from api.models import User, Project
import json

class UserAuthenticationTests(TestCase):
    """Test user registration and login"""
    
    def setUp(self):
        """Create test data"""
        self.client = Client()
        self.test_user = User.objects.create(
            username='test_ngo',
            email='test@ngo.com',
            role='NGO',
            name='Test NGO',
            is_approved=True
        )
        self.test_user.set_password('testpass123')
        self.test_user.save()
    
    def test_login_success(self):
        """Test successful login"""
        response = self.client.post('/api/login/', 
            json.dumps({
                'username': 'test_ngo',
                'password': 'testpass123'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('token', data)
        self.assertIn('user', data)
    
    def test_login_invalid_credentials(self):
        """Test login with wrong password"""
        response = self.client.post('/api/login/',
            json.dumps({
                'username': 'test_ngo',
                'password': 'wrongpass'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 401)
    
    def test_login_unapproved_user(self):
        """Test login with unapproved user"""
        unapproved = User.objects.create(
            username='unapproved',
            email='unapproved@test.com',
            role='DONOR',
            name='Unapproved User',
            is_approved=False
        )
        unapproved.set_password('testpass')
        unapproved.save()
        
        response = self.client.post('/api/login/',
            json.dumps({
                'username': 'unapproved',
                'password': 'testpass'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)


class ProjectTests(TestCase):
    """Test project creation and management"""
    
    def setUp(self):
        """Create test NGO user"""
        self.client = Client()
        self.ngo = User.objects.create(
            username='test_ngo',
            email='ngo@test.com',
            role='NGO',
            name='Test NGO',
            is_approved=True
        )
        self.ngo.set_password('testpass')
        self.ngo.save()
        
        # Login to get token
        response = self.client.post('/api/login/',
            json.dumps({
                'username': 'test_ngo',
                'password': 'testpass'
            }),
            content_type='application/json'
        )
        self.token = response.json()['token']
    
    def test_create_project(self):
        """Test project creation"""
        response = self.client.post('/api/ngo/projects/',
            json.dumps({
                'title': 'Test Project',
                'description': 'Test Description',
                'location': 'Test Location',
                'required_items': ['Food', 'Water'],
                'budget_amount': 1000,
                'duration_months': 6,
                'target_beneficiaries': 100,
                'start_date': '2024-01-01',
                'end_date': '2024-06-30',
                'category': 'General Aid'
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.token}'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('project', data)
        self.assertEqual(data['project']['title'], 'Test Project')
    
    def test_get_ngo_projects(self):
        """Test retrieving NGO projects"""
        # Create a test project
        Project.objects.create(
            title='Test Project',
            description='Test',
            location='Test Location',
            required_items=['Food'],
            budget_amount=1000,
            ngo=self.ngo,
            status='CREATED'
        )
        
        response = self.client.get('/api/ngo/projects/list/',
            HTTP_AUTHORIZATION=f'Bearer {self.token}'
        )
        self.assertEqual(response.status_code, 200)
        projects = response.json()
        self.assertIsInstance(projects, list)
        self.assertGreater(len(projects), 0)


class PublicReportTests(TestCase):
    """Test public reporting functionality"""
    
    def setUp(self):
        self.client = Client()
    
    def test_submit_public_report(self):
        """Test submitting a public report"""
        response = self.client.post('/api/public-reports/',
            json.dumps({
                'project_name': 'Test Project',
                'location': 'Test Location',
                'description': 'Test report',
                'contact_info': 'test@example.com'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
    
    def test_get_public_reports(self):
        """Test retrieving public reports"""
        response = self.client.get('/api/public-reports/list/')
        self.assertEqual(response.status_code, 200)
        reports = response.json()
        self.assertIsInstance(reports, list)


class ModelTests(TestCase):
    """Test database models"""
    
    def test_user_creation(self):
        """Test creating a user"""
        user = User.objects.create(
            username='testuser',
            email='test@example.com',
            role='NGO',
            name='Test User'
        )
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.role, 'NGO')
    
    def test_project_creation(self):
        """Test creating a project"""
        ngo = User.objects.create(
            username='ngo',
            email='ngo@test.com',
            role='NGO',
            name='NGO'
        )
        
        project = Project.objects.create(
            title='Test Project',
            description='Description',
            location='Location',
            required_items=['Item1'],
            budget_amount=5000,
            ngo=ngo,
            status='CREATED'
        )
        
        self.assertEqual(project.title, 'Test Project')
        self.assertEqual(project.budget_amount, 5000)
        self.assertEqual(project.ngo, ngo)


class APIEndpointTests(TestCase):
    """Test API endpoint availability"""
    
    def setUp(self):
        self.client = Client()
    
    def test_login_endpoint_exists(self):
        """Test login endpoint is accessible"""
        response = self.client.post('/api/login/',
            json.dumps({'username': 'test', 'password': 'test'}),
            content_type='application/json'
        )
        # Should return 401 (unauthorized) not 404 (not found)
        self.assertNotEqual(response.status_code, 404)
    
    def test_register_endpoint_exists(self):
        """Test register endpoint is accessible"""
        response = self.client.post('/api/register/',
            json.dumps({
                'username': 'test',
                'email': 'test@test.com',
                'password': 'test',
                'role': 'DONOR',
                'name': 'Test'
            }),
            content_type='application/json'
        )
        # Should not return 404
        self.assertNotEqual(response.status_code, 404)
    
    def test_public_reports_endpoint_exists(self):
        """Test public reports endpoint is accessible"""
        response = self.client.get('/api/public-reports/list/')
        self.assertEqual(response.status_code, 200)


class UserRoleTests(TestCase):
    """Test user role validation"""
    
    def test_valid_roles(self):
        """Test creating users with valid roles"""
        valid_roles = ['ADMIN', 'NGO', 'DONOR', 'SUPPLIER', 'FIELD_OFFICER']
        for role in valid_roles:
            user = User.objects.create(
                username=f'user_{role.lower()}',
                email=f'{role.lower()}@test.com',
                role=role,
                name=f'Test {role}'
            )
            self.assertEqual(user.role, role)
