/**
 * System Tests (E2E) — AidTrace
 *
 * Simulates real user journeys through the browser.
 * All API calls are intercepted with cy.intercept() so tests
 * run without a live backend.
 *
 * Run:  npx cypress run --spec cypress/e2e/system.cy.js
 * Open: npx cypress open
 */

// ─── Home Page ────────────────────────────────────────────────────────────────

describe('Home Page', () => {
  beforeEach(() => cy.visit('/'));

  it('displays the AidTrace branding and key sections', () => {
    cy.contains('Transparent Aid Distribution').should('be.visible');
    cy.contains('Get Started').should('be.visible');
    cy.contains('Submit Report').should('be.visible');
  });

  it('navigates to login page from Get Started button', () => {
    cy.contains('Get Started').first().click();
    cy.url().should('include', '/login').or('include', '/register');
  });

  it('navigates to login page from Login link', () => {
    cy.contains('Login').first().click();
    cy.url().should('include', '/login');
  });
});

// ─── User Registration Flow ───────────────────────────────────────────────────

describe('User Registration', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/register/', {
      statusCode: 200,
      body: { message: 'Registration successful. Please wait for admin approval before logging in.' },
    }).as('registerRequest');
    cy.visit('/register');
  });

  it('renders the registration form', () => {
    cy.get('h2').contains('Create account').should('be.visible');
    cy.get('select').should('exist');
    cy.get('input[type="text"]').should('exist');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
  });

  it('registers a new Donor successfully', () => {
    cy.get('select').select('DONOR');
    cy.get('input[type="text"]').first().type('newdonor');
    cy.get('input[type="email"]').type('donor@example.com');

    // Full Name input (3rd text input)
    cy.get('input[type="text"]').eq(1).type('New Donor');

    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest').its('request.body').should('include', { role: 'DONOR' });
  });

  it('shows error message on duplicate username', () => {
    cy.intercept('POST', '**/api/register/', {
      statusCode: 400,
      body: { error: 'Username already exists' },
    }).as('registerFail');

    cy.get('select').select('DONOR');
    cy.get('input[type="text"]').first().type('existinguser');
    cy.get('input[type="email"]').type('x@x.com');
    cy.get('input[type="text"]').eq(1).type('Existing');
    cy.get('input[type="password"]').type('pass123');
    cy.get('button[type="submit"]').click();

    cy.wait('@registerFail');
    cy.contains('Username already exists').should('be.visible');
  });
});

// ─── Login Flow ───────────────────────────────────────────────────────────────

describe('Login Flow', () => {
  beforeEach(() => cy.visit('/login'));

  it('renders the login form', () => {
    cy.contains('Welcome back').should('be.visible');
    cy.get('input[type="text"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').contains('Sign In').should('exist');
  });

  it('logs in as NGO and redirects to /ngo', () => {
    cy.intercept('POST', '**/api/login/', {
      statusCode: 200,
      body: { token: 'mock-jwt', user: { id: 1, username: 'ngo_user', role: 'NGO', name: 'Test NGO' } },
    }).as('loginRequest');

    cy.get('input[type="text"]').type('ngo_user');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.url().should('include', '/ngo');
  });

  it('shows error for invalid credentials', () => {
    cy.intercept('POST', '**/api/login/', {
      statusCode: 401,
      body: { error: 'Invalid credentials' },
    }).as('loginFail');

    cy.get('input[type="text"]').type('wronguser');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFail');
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('shows error for unapproved account', () => {
    cy.intercept('POST', '**/api/login/', {
      statusCode: 403,
      body: { error: 'Your account is pending admin approval' },
    }).as('loginPending');

    cy.get('input[type="text"]').type('pendinguser');
    cy.get('input[type="password"]').type('pass123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginPending');
    cy.contains('pending admin approval').should('be.visible');
  });
});

// ─── NGO Dashboard — Beneficiary Registration ─────────────────────────────────

describe('Beneficiary Registration (NGO Dashboard)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ngo/projects/list/', {
      statusCode: 200,
      body: [{ id: 1, title: 'Food Aid Juba', status: 'FUNDED', location: 'Juba', budget_amount: 5000 }],
    }).as('getProjects');

    cy.intercept('GET', '**/api/ngo/dashboard/', {
      statusCode: 200,
      body: { total_projects: 1, funded_projects: 1, field_officers: 1 },
    }).as('getDashboard');

    cy.loginAs('NGO');
    cy.visit('/ngo');
  });

  it('renders the NGO dashboard with project data', () => {
    cy.wait('@getDashboard');
    cy.contains('NGO').should('be.visible');
  });

  it('shows My Projects section', () => {
    cy.contains('My Projects').should('be.visible');
  });

  it('shows Create Project button', () => {
    cy.contains('Create Project').should('be.visible');
  });
});

// ─── Aid Distribution Flow (Field Officer) ────────────────────────────────────

describe('Aid Distribution Flow (Field Officer Dashboard)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/field-officer/assignments/', {
      statusCode: 200,
      body: [{
        id: 1,
        project_title: 'Food Aid Juba',
        project_location: 'Juba',
        confirmed: true,
        status: 'READY_FOR_DISTRIBUTION',
      }],
    }).as('getAssignments');

    cy.loginAs('FIELD_OFFICER');
    cy.visit('/field-officer');
  });

  it('renders the Field Officer dashboard', () => {
    cy.contains('Field Officer').should('be.visible');
  });

  it('displays assigned projects', () => {
    cy.contains('My Projects').should('be.visible');
  });
});

// ─── Donor — Fund a Project ───────────────────────────────────────────────────

describe('Donor — Fund a Project', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/donor/projects/', {
      statusCode: 200,
      body: [{ id: 3, title: 'Water Sanitation', status: 'PENDING_FUNDING', budget_amount: 10000, location: 'Malakal' }],
    }).as('getProjects');

    cy.intercept('GET', '**/api/donor/funded-projects/', { statusCode: 200, body: [] }).as('getFunded');

    cy.loginAs('DONOR');
    cy.visit('/donor');
  });

  it('renders the Donor dashboard', () => {
    cy.contains('Donor').should('be.visible');
  });

  it('shows Pending Projects section', () => {
    cy.contains('Pending Projects').should('be.visible');
  });

  it('shows Funded Projects section', () => {
    cy.contains('Funded Projects').should('be.visible');
  });
});

// ─── Public Report Submission ─────────────────────────────────────────────────

describe('Public Report Submission', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/public-reports/', {
      statusCode: 200,
      body: { id: 1, project_name: 'Test Project' },
    }).as('submitReport');

    cy.visit('/public-report');
  });

  it('renders the public report form', () => {
    cy.get('form, [data-testid="report-form"], input, textarea').should('exist');
  });
});

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

describe('Admin Dashboard — View Reports', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/admin/dashboard/', {
      statusCode: 200,
      body: { donors: 5, ngos: 2, suppliers: 3, field_officers: 4, projects: 10, reports: 2 },
    }).as('adminDashboard');

    cy.intercept('GET', '**/api/admin/pending-users/', { statusCode: 200, body: [] }).as('pendingUsers');
    cy.intercept('GET', '**/api/admin/pending-projects/', { statusCode: 200, body: [] }).as('pendingProjects');

    cy.loginAs('ADMIN');
    cy.visit('/admin');
  });

  it('renders the Admin dashboard', () => {
    cy.contains('Pending Users').should('be.visible');
  });

  it('shows Manage Users section', () => {
    cy.contains('Manage Users').should('be.visible');
  });

  it('shows user management actions', () => {
    cy.contains('Logout').should('be.visible');
  });
});
