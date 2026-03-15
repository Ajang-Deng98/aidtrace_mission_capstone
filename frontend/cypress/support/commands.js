// Custom Cypress commands for AidTrace

/**
 * cy.loginAs(role) — bypasses the UI login by injecting token + user into
 * localStorage, exactly as the real Login component does after a successful
 * API response. This avoids repeating the login flow in every test.
 */
Cypress.Commands.add('loginAs', (role) => {
  const users = {
    NGO: { id: 1, username: 'test_ngo', email: 'ngo@test.com', role: 'NGO', name: 'Test NGO' },
    DONOR: { id: 2, username: 'test_donor', email: 'donor@test.com', role: 'DONOR', name: 'Test Donor' },
    SUPPLIER: { id: 3, username: 'test_supplier', email: 'supplier@test.com', role: 'SUPPLIER', name: 'Test Supplier' },
    FIELD_OFFICER: { id: 4, username: 'test_fo', email: 'fo@test.com', role: 'FIELD_OFFICER', name: 'Test Officer' },
    ADMIN: { id: 5, username: 'test_admin', email: 'admin@test.com', role: 'ADMIN', name: 'Test Admin' },
  };

  const user = users[role];
  window.localStorage.setItem('token', `mock-token-${role.toLowerCase()}`);
  window.localStorage.setItem('user', JSON.stringify(user));
});

/**
 * cy.clearAuth() — clears auth state from localStorage
 */
Cypress.Commands.add('clearAuth', () => {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
});
