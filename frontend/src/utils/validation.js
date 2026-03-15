// Pure validation functions — used by forms and unit tests

export function validateLoginForm({ username, password }) {
  const errors = {};
  if (!username || username.trim() === '') errors.username = 'Username is required';
  if (!password || password.trim() === '') errors.password = 'Password is required';
  if (password && password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
}

export function validateBeneficiaryForm({ name, phone_number }) {
  const errors = {};
  if (!name || name.trim() === '') errors.name = 'Name is required';
  if (!phone_number || phone_number.trim() === '') errors.phone_number = 'Phone number is required';
  if (phone_number && !/^\+?[\d\s\-]{7,15}$/.test(phone_number.trim())) {
    errors.phone_number = 'Invalid phone number format';
  }
  return errors;
}

export function validateAidRecord({ project_id, beneficiary_id, field_officer_id }) {
  const errors = {};
  if (!project_id) errors.project_id = 'Project is required';
  if (!beneficiary_id) errors.beneficiary_id = 'Beneficiary is required';
  if (!field_officer_id) errors.field_officer_id = 'Field officer is required';
  return errors;
}

export function validateProjectForm({ title, description, location, budget_amount }) {
  const errors = {};
  if (!title || title.trim() === '') errors.title = 'Title is required';
  if (!description || description.trim() === '') errors.description = 'Description is required';
  if (!location || location.trim() === '') errors.location = 'Location is required';
  if (!budget_amount || isNaN(budget_amount) || Number(budget_amount) <= 0) {
    errors.budget_amount = 'Budget must be a positive number';
  }
  return errors;
}

export function isValidWalletAddress(address) {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

export function hasErrors(errorsObj) {
  return Object.keys(errorsObj).length > 0;
}
