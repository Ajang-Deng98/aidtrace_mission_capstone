# AidTrace Testing

## Test Structure

### Backend Tests
- **Location**: `backend/tests/`
- **File**: `test_api.py`
- **Tests**: 13 tests
- **Run**: `cd backend && python manage.py test tests`

### Frontend Tests  
- **Location**: `frontend/src/tests/`
- **File**: `App.test.js`
- **Tests**: 6 tests
- **Run**: `cd frontend && npm test`

## Test Results

### Frontend: ✓ 6/6 PASSED
- App renders without crashing
- Theme management works
- Language/direction handling works
- API service exports correctly
- Auth API methods exist
- Public API methods exist

### Backend: ✓ 13/13 PASSED
- User authentication (login success, invalid credentials, unapproved users)
- Project creation and retrieval
- Public report submission and retrieval
- Model creation (User, Project)
- API endpoint availability
- User role validation

## Important Notes

- Frontend tests use React Testing Library
- Backend tests use Django's TestCase (separate test database)
- All tests are non-destructive and safe to run
- No existing functionality was modified
- Tests are organized in dedicated test folders
