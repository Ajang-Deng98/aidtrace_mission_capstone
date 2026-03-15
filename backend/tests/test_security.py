"""
Security Tests — Authentication & Authorization
Tests that protected endpoints enforce tokens and role restrictions.
Run with: python manage.py test tests.test_security
"""
from django.test import TestCase, Client
from api.models import User, Project, Funding, Beneficiary
from api.auth import create_token
import json


def make_token(user):
    return create_token(user)


class AuthenticationEnforcementTests(TestCase):
    """Every protected endpoint must return 401 when no token is provided."""

    def setUp(self):
        self.client = Client()

    def _assert_401(self, method, url, data=None):
        fn = getattr(self.client, method)
        kwargs = {'content_type': 'application/json'}
        if data:
            kwargs['data'] = json.dumps(data)
        response = fn(url, **kwargs)
        self.assertEqual(response.status_code, 401, f"{method.upper()} {url} should return 401 without token")

    def test_ngo_projects_list_requires_auth(self):
        self._assert_401('get', '/api/ngo/projects/list/')

    def test_ngo_dashboard_requires_auth(self):
        self._assert_401('get', '/api/ngo/dashboard/')

    def test_donor_projects_requires_auth(self):
        self._assert_401('get', '/api/donor/projects/')

    def test_donor_fund_project_requires_auth(self):
        self._assert_401('post', '/api/donor/fund-project/', {'project_id': 1, 'amount': 100})

    def test_supplier_assignments_requires_auth(self):
        self._assert_401('get', '/api/supplier/assignments/')

    def test_supplier_quote_requests_requires_auth(self):
        self._assert_401('get', '/api/supplier/quote-requests/')

    def test_field_officer_assignments_requires_auth(self):
        self._assert_401('get', '/api/field-officer/assignments/')

    def test_add_beneficiary_requires_auth(self):
        self._assert_401('post', '/api/field-officer/beneficiary/', {'name': 'Test', 'phone_number': '123'})

    def test_admin_dashboard_requires_auth(self):
        self._assert_401('get', '/api/admin/dashboard/')

    def test_admin_users_requires_auth(self):
        self._assert_401('get', '/api/admin/users/')

    def test_admin_pending_users_requires_auth(self):
        self._assert_401('get', '/api/admin/pending-users/')

    def test_approve_user_requires_auth(self):
        self._assert_401('post', '/api/admin/approve-user/', {'user_id': 1})

    def test_ngo_field_officers_requires_auth(self):
        self._assert_401('get', '/api/ngo/field-officers/list/')

    def test_ngo_quote_requests_requires_auth(self):
        self._assert_401('get', '/api/ngo/quote-requests/list/')


class RoleAuthorizationTests(TestCase):
    """Users cannot access endpoints outside their role."""

    def setUp(self):
        self.client = Client()

        self.donor = User.objects.create(username='donor', email='donor@t.com', role='DONOR', name='Donor', is_approved=True)
        self.donor.set_password('pass'); self.donor.save()

        self.ngo = User.objects.create(username='ngo', email='ngo@t.com', role='NGO', name='NGO', is_approved=True)
        self.ngo.set_password('pass'); self.ngo.save()

        self.supplier = User.objects.create(username='supplier', email='sup@t.com', role='SUPPLIER', name='Supplier', is_approved=True)
        self.supplier.set_password('pass'); self.supplier.save()

        self.field_officer = User.objects.create(username='fo', email='fo@t.com', role='FIELD_OFFICER', name='FO', is_approved=True)
        self.field_officer.set_password('pass'); self.field_officer.save()

        self.admin = User.objects.create(username='admin', email='admin@t.com', role='ADMIN', name='Admin', is_approved=True)
        self.admin.set_password('pass'); self.admin.save()

    def _auth(self, user):
        return {'HTTP_AUTHORIZATION': f'Bearer {make_token(user)}'}

    def test_donor_cannot_access_ngo_projects(self):
        response = self.client.get('/api/ngo/projects/list/', **self._auth(self.donor))
        self.assertEqual(response.status_code, 403)

    def test_donor_cannot_access_admin_dashboard(self):
        response = self.client.get('/api/admin/dashboard/', **self._auth(self.donor))
        self.assertEqual(response.status_code, 403)

    def test_ngo_cannot_access_donor_fund_endpoint(self):
        response = self.client.post(
            '/api/donor/fund-project/',
            json.dumps({'project_id': 1, 'amount': 100}),
            content_type='application/json',
            **self._auth(self.ngo)
        )
        self.assertEqual(response.status_code, 403)

    def test_supplier_cannot_access_admin_users(self):
        response = self.client.get('/api/admin/users/', **self._auth(self.supplier))
        self.assertEqual(response.status_code, 403)

    def test_supplier_cannot_access_ngo_dashboard(self):
        response = self.client.get('/api/ngo/dashboard/', **self._auth(self.supplier))
        self.assertEqual(response.status_code, 403)

    def test_field_officer_cannot_access_admin_endpoints(self):
        response = self.client.get('/api/admin/pending-users/', **self._auth(self.field_officer))
        self.assertEqual(response.status_code, 403)

    def test_field_officer_cannot_approve_users(self):
        response = self.client.post(
            '/api/admin/approve-user/',
            json.dumps({'user_id': self.donor.id}),
            content_type='application/json',
            **self._auth(self.field_officer)
        )
        self.assertEqual(response.status_code, 403)

    def test_ngo_cannot_access_supplier_assignments(self):
        response = self.client.get('/api/supplier/assignments/', **self._auth(self.ngo))
        self.assertEqual(response.status_code, 403)

    def test_donor_cannot_access_field_officer_assignments(self):
        response = self.client.get('/api/field-officer/assignments/', **self._auth(self.donor))
        self.assertEqual(response.status_code, 403)

    def test_admin_can_access_admin_dashboard(self):
        response = self.client.get('/api/admin/dashboard/', **self._auth(self.admin))
        self.assertEqual(response.status_code, 200)

    def test_ngo_can_access_ngo_projects(self):
        response = self.client.get('/api/ngo/projects/list/', **self._auth(self.ngo))
        self.assertEqual(response.status_code, 200)

    def test_donor_can_access_donor_projects(self):
        response = self.client.get('/api/donor/projects/', **self._auth(self.donor))
        self.assertEqual(response.status_code, 200)

    def test_supplier_can_access_supplier_assignments(self):
        response = self.client.get('/api/supplier/assignments/', **self._auth(self.supplier))
        self.assertEqual(response.status_code, 200)

    def test_field_officer_can_access_own_assignments(self):
        response = self.client.get('/api/field-officer/assignments/', **self._auth(self.field_officer))
        self.assertEqual(response.status_code, 200)


class CrossUserDataAccessTests(TestCase):
    """Users cannot modify or read data belonging to other users."""

    def setUp(self):
        self.client = Client()

        self.ngo1 = User.objects.create(username='ngo1', email='ngo1@t.com', role='NGO', name='NGO1', is_approved=True)
        self.ngo1.set_password('pass'); self.ngo1.save()

        self.ngo2 = User.objects.create(username='ngo2', email='ngo2@t.com', role='NGO', name='NGO2', is_approved=True)
        self.ngo2.set_password('pass'); self.ngo2.save()

        self.supplier1 = User.objects.create(username='sup1', email='sup1@t.com', role='SUPPLIER', name='Sup1', is_approved=True)
        self.supplier1.set_password('pass'); self.supplier1.save()

        self.supplier2 = User.objects.create(username='sup2', email='sup2@t.com', role='SUPPLIER', name='Sup2', is_approved=True)
        self.supplier2.set_password('pass'); self.supplier2.save()

        self.project = Project.objects.create(
            title='Test Project', description='Test', location='Juba',
            required_items=['Food'], budget_amount=5000, ngo=self.ngo1, status='FUNDED'
        )

    def _auth(self, user):
        return {'HTTP_AUTHORIZATION': f'Bearer {make_token(user)}'}

    def test_ngo_only_sees_own_projects(self):
        # ngo2 has no projects — list should be empty
        response = self.client.get('/api/ngo/projects/list/', **self._auth(self.ngo2))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 0)

    def test_ngo1_sees_own_project(self):
        response = self.client.get('/api/ngo/projects/list/', **self._auth(self.ngo1))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], 'Test Project')

    def test_ngo_cannot_access_beneficiaries_of_other_ngo_project(self):
        response = self.client.get(
            f'/api/ngo/projects/{self.project.id}/beneficiaries/',
            **self._auth(self.ngo2)
        )
        # Should return 404 (project not found for this NGO) not 200
        self.assertEqual(response.status_code, 404)


class InvalidTokenTests(TestCase):
    """Malformed or expired tokens must be rejected."""

    def setUp(self):
        self.client = Client()

    def test_malformed_token_returns_401(self):
        response = self.client.get(
            '/api/ngo/projects/list/',
            HTTP_AUTHORIZATION='Bearer not.a.valid.jwt'
        )
        self.assertEqual(response.status_code, 401)

    def test_missing_bearer_prefix_returns_401(self):
        response = self.client.get(
            '/api/ngo/projects/list/',
            HTTP_AUTHORIZATION='just-a-token-no-bearer'
        )
        self.assertEqual(response.status_code, 401)

    def test_empty_authorization_header_returns_401(self):
        response = self.client.get(
            '/api/ngo/projects/list/',
            HTTP_AUTHORIZATION=''
        )
        self.assertEqual(response.status_code, 401)


class PublicEndpointAccessTests(TestCase):
    """Public endpoints must remain accessible without authentication."""

    def setUp(self):
        self.client = Client()

    def test_login_endpoint_is_public(self):
        # Login is public — wrong credentials return 401 (bad creds), not blocked.
        # The key check is that it does NOT return 403 (forbidden/role-blocked).
        response = self.client.post(
            '/api/login/',
            json.dumps({'username': 'nobody', 'password': 'wrong'}),
            content_type='application/json'
        )
        self.assertNotEqual(response.status_code, 403)
        self.assertNotEqual(response.status_code, 404)

    def test_register_endpoint_is_public(self):
        response = self.client.post(
            '/api/register/',
            json.dumps({'username': 'u', 'email': 'u@u.com', 'password': 'p', 'role': 'DONOR', 'name': 'U'}),
            content_type='application/json'
        )
        self.assertNotEqual(response.status_code, 401)

    def test_public_reports_list_is_public(self):
        response = self.client.get('/api/public-reports/list/')
        self.assertEqual(response.status_code, 200)

    def test_submit_public_report_is_public(self):
        response = self.client.post(
            '/api/public-reports/',
            json.dumps({'project_name': 'Test', 'location': 'Juba', 'description': 'Issue', 'contact_info': ''}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
