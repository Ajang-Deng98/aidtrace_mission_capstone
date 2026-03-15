import {
  validateLoginForm,
  validateBeneficiaryForm,
  validateAidRecord,
  validateProjectForm,
  isValidWalletAddress,
  hasErrors,
} from '../utils/validation';

// ─── Login Validation ────────────────────────────────────────────────────────

describe('validateLoginForm', () => {
  test('returns no errors for valid credentials', () => {
    const errors = validateLoginForm({ username: 'testuser', password: 'secret123' });
    expect(hasErrors(errors)).toBe(false);
  });

  test('requires username', () => {
    const errors = validateLoginForm({ username: '', password: 'secret123' });
    expect(errors.username).toBeDefined();
  });

  test('requires password', () => {
    const errors = validateLoginForm({ username: 'testuser', password: '' });
    expect(errors.password).toBeDefined();
  });

  test('rejects password shorter than 6 characters', () => {
    const errors = validateLoginForm({ username: 'testuser', password: 'abc' });
    expect(errors.password).toBeDefined();
  });

  test('accepts password of exactly 6 characters', () => {
    const errors = validateLoginForm({ username: 'testuser', password: 'abc123' });
    expect(hasErrors(errors)).toBe(false);
  });

  test('rejects whitespace-only username', () => {
    const errors = validateLoginForm({ username: '   ', password: 'secret123' });
    expect(errors.username).toBeDefined();
  });

  test('returns errors for both fields when both empty', () => {
    const errors = validateLoginForm({ username: '', password: '' });
    expect(errors.username).toBeDefined();
    expect(errors.password).toBeDefined();
  });
});

// ─── Beneficiary Registration Validation ─────────────────────────────────────

describe('validateBeneficiaryForm', () => {
  test('returns no errors for valid beneficiary data', () => {
    const errors = validateBeneficiaryForm({ name: 'John Doe', phone_number: '+211912345678' });
    expect(hasErrors(errors)).toBe(false);
  });

  test('requires name', () => {
    const errors = validateBeneficiaryForm({ name: '', phone_number: '+211912345678' });
    expect(errors.name).toBeDefined();
  });

  test('requires phone number', () => {
    const errors = validateBeneficiaryForm({ name: 'John Doe', phone_number: '' });
    expect(errors.phone_number).toBeDefined();
  });

  test('rejects invalid phone number format', () => {
    const errors = validateBeneficiaryForm({ name: 'John Doe', phone_number: 'abc' });
    expect(errors.phone_number).toBeDefined();
  });

  test('accepts phone number with spaces and dashes', () => {
    const errors = validateBeneficiaryForm({ name: 'John Doe', phone_number: '+211 912 345 678' });
    expect(hasErrors(errors)).toBe(false);
  });

  test('accepts plain numeric phone number', () => {
    const errors = validateBeneficiaryForm({ name: 'John Doe', phone_number: '0912345678' });
    expect(hasErrors(errors)).toBe(false);
  });

  test('rejects whitespace-only name', () => {
    const errors = validateBeneficiaryForm({ name: '   ', phone_number: '+211912345678' });
    expect(errors.name).toBeDefined();
  });
});

// ─── Aid Record Creation Validation ──────────────────────────────────────────

describe('validateAidRecord', () => {
  test('returns no errors for valid aid record', () => {
    const errors = validateAidRecord({ project_id: 1, beneficiary_id: 5, field_officer_id: 3 });
    expect(hasErrors(errors)).toBe(false);
  });

  test('requires project_id', () => {
    const errors = validateAidRecord({ project_id: null, beneficiary_id: 5, field_officer_id: 3 });
    expect(errors.project_id).toBeDefined();
  });

  test('requires beneficiary_id', () => {
    const errors = validateAidRecord({ project_id: 1, beneficiary_id: null, field_officer_id: 3 });
    expect(errors.beneficiary_id).toBeDefined();
  });

  test('requires field_officer_id', () => {
    const errors = validateAidRecord({ project_id: 1, beneficiary_id: 5, field_officer_id: null });
    expect(errors.field_officer_id).toBeDefined();
  });

  test('returns all errors when all fields missing', () => {
    const errors = validateAidRecord({ project_id: null, beneficiary_id: null, field_officer_id: null });
    expect(errors.project_id).toBeDefined();
    expect(errors.beneficiary_id).toBeDefined();
    expect(errors.field_officer_id).toBeDefined();
  });
});

// ─── Project Form Validation ──────────────────────────────────────────────────

describe('validateProjectForm', () => {
  const valid = { title: 'Food Aid', description: 'Distribute food', location: 'Juba', budget_amount: 5000 };

  test('returns no errors for valid project', () => {
    expect(hasErrors(validateProjectForm(valid))).toBe(false);
  });

  test('requires title', () => {
    expect(validateProjectForm({ ...valid, title: '' }).title).toBeDefined();
  });

  test('requires description', () => {
    expect(validateProjectForm({ ...valid, description: '' }).description).toBeDefined();
  });

  test('requires location', () => {
    expect(validateProjectForm({ ...valid, location: '' }).location).toBeDefined();
  });

  test('requires positive budget', () => {
    expect(validateProjectForm({ ...valid, budget_amount: 0 }).budget_amount).toBeDefined();
  });

  test('rejects negative budget', () => {
    expect(validateProjectForm({ ...valid, budget_amount: -100 }).budget_amount).toBeDefined();
  });

  test('rejects non-numeric budget', () => {
    expect(validateProjectForm({ ...valid, budget_amount: 'abc' }).budget_amount).toBeDefined();
  });
});

// ─── Wallet Address Validation ────────────────────────────────────────────────

describe('isValidWalletAddress', () => {
  test('accepts valid Ethereum address', () => {
    expect(isValidWalletAddress('0x1234567890123456789012345678901234567890')).toBe(true);
  });

  test('accepts checksummed address', () => {
    expect(isValidWalletAddress('0xAbCdEf1234567890AbCdEf1234567890AbCdEf12')).toBe(true);
  });

  test('rejects address without 0x prefix', () => {
    expect(isValidWalletAddress('1234567890123456789012345678901234567890')).toBe(false);
  });

  test('rejects address that is too short', () => {
    expect(isValidWalletAddress('0x1234')).toBe(false);
  });

  test('rejects address with invalid characters', () => {
    expect(isValidWalletAddress('0xinvalid_address_here_xxxxxxxxxxxxxxxxxxxx')).toBe(false);
  });

  test('rejects empty string', () => {
    expect(isValidWalletAddress('')).toBe(false);
  });
});

// ─── hasErrors helper ─────────────────────────────────────────────────────────

describe('hasErrors', () => {
  test('returns false for empty object', () => {
    expect(hasErrors({})).toBe(false);
  });

  test('returns true when errors exist', () => {
    expect(hasErrors({ username: 'required' })).toBe(true);
  });
});
