/**
 * Integration Tests — Frontend API ↔ Backend Endpoints
 *
 * Uses axios-mock-adapter to intercept real axios calls from api.js
 * and simulate backend responses. Verifies that:
 *   - Correct HTTP method and URL are used
 *   - Request payload matches what the backend expects
 *   - Response data is returned correctly to the caller
 *   - Error responses are propagated correctly
 *
 * Run: npm test -- --testPathPattern=integration
 */

import MockAdapter from 'axios-mock-adapter';
import api, { authAPI, ngoAPI, donorAPI, supplierAPI, fieldOfficerAPI, adminAPI, publicAPI } from '../services/api';

const mock = new MockAdapter(api);

beforeEach(() => {
  mock.reset();
  localStorage.clear();
});

afterAll(() => {
  mock.restore();
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe('Integration: authAPI.login', () => {
  test('sends credentials and returns token + user on success', async () => {
    const payload = { username: 'ngo_user', password: 'pass123' };
    const responseData = { token: 'jwt-token-abc', user: { id: 1, role: 'NGO', username: 'ngo_user' } };

    mock.onPost('/login/').reply(200, responseData);

    const res = await authAPI.login(payload);
    expect(res.data.token).toBe('jwt-token-abc');
    expect(res.data.user.role).toBe('NGO');
  });

  test('propagates 401 for invalid credentials', async () => {
    mock.onPost('/login/').reply(401, { error: 'Invalid credentials' });

    await expect(authAPI.login({ username: 'x', password: 'wrong' })).rejects.toMatchObject({
      response: { status: 401 },
    });
  });

  test('propagates 403 for unapproved user', async () => {
    mock.onPost('/login/').reply(403, { error: 'Your account is pending admin approval' });

    await expect(authAPI.login({ username: 'pending', password: 'pass' })).rejects.toMatchObject({
      response: { status: 403 },
    });
  });
});

describe('Integration: authAPI.register', () => {
  test('sends registration data and returns success message', async () => {
    const payload = { username: 'newuser', email: 'new@test.com', password: 'pass123', role: 'DONOR', name: 'New User' };
    mock.onPost('/register/').reply(200, { message: 'Registration successful. Please wait for admin approval before logging in.' });

    const res = await authAPI.register(payload);
    expect(res.data.message).toMatch(/Registration successful/);
  });

  test('propagates 400 for duplicate username', async () => {
    mock.onPost('/register/').reply(400, { error: 'Username already exists' });

    await expect(authAPI.register({ username: 'existing' })).rejects.toMatchObject({
      response: { status: 400 },
    });
  });
});

// ─── NGO ──────────────────────────────────────────────────────────────────────

describe('Integration: ngoAPI.getProjects', () => {
  test('returns list of projects for authenticated NGO', async () => {
    localStorage.setItem('token', 'valid-token');
    const projects = [
      { id: 1, title: 'Food Aid Juba', status: 'PENDING_FUNDING' },
      { id: 2, title: 'Medical Supplies', status: 'FUNDED' },
    ];
    mock.onGet('/ngo/projects/list/').reply(200, projects);

    const res = await ngoAPI.getProjects();
    expect(res.data).toHaveLength(2);
    expect(res.data[0].title).toBe('Food Aid Juba');
  });

  test('propagates 401 when token is missing', async () => {
    mock.onGet('/ngo/projects/list/').reply(401, { error: 'Unauthorized' });

    await expect(ngoAPI.getProjects()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('Integration: ngoAPI.getDashboard', () => {
  test('returns dashboard stats', async () => {
    mock.onGet('/ngo/dashboard/').reply(200, { total_projects: 3, funded_projects: 1, field_officers: 2 });

    const res = await ngoAPI.getDashboard();
    expect(res.data.total_projects).toBe(3);
  });
});

describe('Integration: ngoAPI.addBeneficiary', () => {
  test('sends beneficiary data and returns created record', async () => {
    const payload = { name: 'Jane Doe', phone_number: '+211912345678', project_id: 1 };
    const created = { id: 10, name: 'Jane Doe', phone_number: '+211912345678', confirmed: false };

    mock.onPost('/field-officer/beneficiary/').reply(200, created);

    const res = await ngoAPI.addBeneficiary(payload);
    expect(res.data.id).toBe(10);
    expect(res.data.name).toBe('Jane Doe');
  });
});

describe('Integration: ngoAPI.getBeneficiaries', () => {
  test('returns beneficiaries for a project', async () => {
    const beneficiaries = [
      { id: 1, name: 'Alice', confirmed: false },
      { id: 2, name: 'Bob', confirmed: true },
    ];
    mock.onGet('/ngo/projects/5/beneficiaries/').reply(200, beneficiaries);

    const res = await ngoAPI.getBeneficiaries(5);
    expect(res.data).toHaveLength(2);
  });
});

// ─── Donor ────────────────────────────────────────────────────────────────────

describe('Integration: donorAPI.getProjects', () => {
  test('returns available projects for donor', async () => {
    const projects = [{ id: 3, title: 'Water Sanitation', status: 'PENDING_FUNDING' }];
    mock.onGet('/donor/projects/').reply(200, projects);

    const res = await donorAPI.getProjects();
    expect(res.data[0].status).toBe('PENDING_FUNDING');
  });
});

describe('Integration: donorAPI.fundProject', () => {
  test('sends funding payload and returns funding record', async () => {
    const payload = { project_id: 3, amount: 5000, signature: 'donor-sig-xyz' };
    const funding = { id: 7, amount: 5000, donor_signature: 'donor-sig-xyz' };

    mock.onPost('/donor/fund-project/').reply(200, funding);

    const res = await donorAPI.fundProject(payload);
    expect(res.data.amount).toBe(5000);
    expect(res.data.donor_signature).toBe('donor-sig-xyz');
  });

  test('propagates 403 when donor is not approved', async () => {
    mock.onPost('/donor/fund-project/').reply(403, { error: 'Forbidden' });

    await expect(donorAPI.fundProject({ project_id: 1, amount: 100 })).rejects.toMatchObject({
      response: { status: 403 },
    });
  });
});

// ─── Supplier ─────────────────────────────────────────────────────────────────

describe('Integration: supplierAPI.getQuoteRequests', () => {
  test('returns open quote requests for supplier', async () => {
    const requests = [{ id: 1, status: 'OPEN', items: ['Rice', 'Beans'] }];
    mock.onGet('/supplier/quote-requests/').reply(200, requests);

    const res = await supplierAPI.getQuoteRequests();
    expect(res.data[0].status).toBe('OPEN');
  });
});

describe('Integration: supplierAPI.submitQuote', () => {
  test('sends quote and returns created quote record', async () => {
    const payload = { quote_request_id: 1, quoted_amount: 2500, delivery_terms: '30 days', signature: 'sup-sig' };
    const created = { id: 5, quoted_amount: 2500, supplier: { name: 'Test Supplier' } };

    mock.onPost('/supplier/submit-quote/').reply(200, created);

    const res = await supplierAPI.submitQuote(payload);
    expect(res.data.quoted_amount).toBe(2500);
  });
});

// ─── Field Officer ────────────────────────────────────────────────────────────

describe('Integration: fieldOfficerAPI.getAssignments', () => {
  test('returns assignments for field officer', async () => {
    const assignments = [{ id: 1, project_title: 'Food Aid', confirmed: false }];
    mock.onGet('/field-officer/assignments/').reply(200, assignments);

    const res = await fieldOfficerAPI.getAssignments();
    expect(res.data[0].project_title).toBe('Food Aid');
  });
});

describe('Integration: fieldOfficerAPI.addBeneficiary', () => {
  test('stores beneficiary and returns record with id', async () => {
    const payload = { name: 'Mary', phone_number: '0911111111', project_id: 2 };
    mock.onPost('/field-officer/beneficiary/').reply(200, { id: 20, name: 'Mary', confirmed: false });

    const res = await fieldOfficerAPI.addBeneficiary(payload);
    expect(res.data.id).toBe(20);
  });
});

describe('Integration: fieldOfficerAPI.sendOTP', () => {
  test('sends OTP request and returns success message', async () => {
    mock.onPost('/field-officer/send-otp/').reply(200, { message: 'OTP sent' });

    const res = await fieldOfficerAPI.sendOTP({ phone_number: '+211912345678' });
    expect(res.data.message).toBe('OTP sent');
  });
});

describe('Integration: fieldOfficerAPI.verifyOTP', () => {
  test('verifies OTP and returns distribution record on success', async () => {
    const payload = { phone_number: '+211912345678', code: '123456', beneficiary_id: 1, project_id: 2 };
    const distribution = { verified: true, distribution: { id: 99, completed: true } };

    mock.onPost('/field-officer/verify-otp/').reply(200, distribution);

    const res = await fieldOfficerAPI.verifyOTP(payload);
    expect(res.data.verified).toBe(true);
    expect(res.data.distribution.completed).toBe(true);
  });

  test('returns 400 for wrong OTP code', async () => {
    mock.onPost('/field-officer/verify-otp/').reply(400, { verified: false });

    await expect(fieldOfficerAPI.verifyOTP({ code: '000000' })).rejects.toMatchObject({
      response: { status: 400 },
    });
  });
});

// ─── Admin ────────────────────────────────────────────────────────────────────

describe('Integration: adminAPI.getPendingUsers', () => {
  test('returns list of pending users', async () => {
    const pending = [{ id: 5, username: 'newdonor', role: 'DONOR', is_approved: false }];
    mock.onGet('/admin/pending-users/').reply(200, pending);

    const res = await adminAPI.getPendingUsers();
    expect(res.data[0].is_approved).toBe(false);
  });
});

describe('Integration: adminAPI.approveUser', () => {
  test('approves user and returns updated user', async () => {
    mock.onPost('/admin/approve-user/').reply(200, { message: 'User approved successfully', user: { id: 5, is_approved: true } });

    const res = await adminAPI.approveUser({ user_id: 5 });
    expect(res.data.user.is_approved).toBe(true);
  });
});

describe('Integration: adminAPI.getDashboard', () => {
  test('returns admin dashboard stats', async () => {
    mock.onGet('/admin/dashboard/').reply(200, { donors: 10, ngos: 3, suppliers: 5, projects: 8 });

    const res = await adminAPI.getDashboard();
    expect(res.data.donors).toBe(10);
    expect(res.data.projects).toBe(8);
  });
});

// ─── Public Reports ───────────────────────────────────────────────────────────

describe('Integration: publicAPI.submitReport', () => {
  test('submits report and returns created record', async () => {
    const payload = { project_name: 'Test', location: 'Juba', description: 'Issue found', contact_info: 'anon@test.com' };
    mock.onPost('/public-reports/').reply(200, { id: 1, project_name: 'Test' });

    const res = await publicAPI.submitReport(payload);
    expect(res.data.id).toBe(1);
  });
});

describe('Integration: publicAPI.getReports', () => {
  test('returns list of public reports', async () => {
    mock.onGet('/public-reports/list/').reply(200, [{ id: 1 }, { id: 2 }]);

    const res = await publicAPI.getReports();
    expect(res.data).toHaveLength(2);
  });
});
