# FIXING SLOW PAGE LOADING ISSUES

## Problem
Pages take long to load or don't show at all after login

## Solutions Applied

### 1. Frontend Configuration (.env file created)
- Created `frontend/.env` with API URL
- Added 10-second timeout to API requests
- Added error handling for network issues

### 2. Backend Database Configuration
- Removed SSL requirement for local PostgreSQL
- Added connection pooling (CONN_MAX_AGE=60)
- This speeds up database queries

### 3. How to Test

#### Step 1: Test Backend Speed
```bash
cd c:\dev\aidtrace_project
python test_backend_speed.py
```

Expected output:
- Response time < 2 seconds = GOOD
- Response time > 2 seconds = SLOW (needs fixing)

#### Step 2: Start Backend
```bash
cd c:\dev\aidtrace_project\backend
python manage.py runserver
```

#### Step 3: Start Frontend (NEW TERMINAL)
```bash
cd c:\dev\aidtrace_project\frontend
npm start
```

## Common Causes of Slow Loading

### 1. Backend Not Running
**Symptom:** Pages never load, network errors in browser console
**Fix:** Start backend with `python manage.py runserver`

### 2. Database Connection Issues
**Symptom:** Backend starts but API calls timeout
**Fix:** 
- Check PostgreSQL is running
- Verify credentials in `backend/.env`
- Test connection: `psql -U postgres -d aidtrace_db`

### 3. Blockchain Service Timeout
**Symptom:** Some pages load, others timeout
**Fix:**
- Blockchain calls have 10-second timeout
- If Sepolia is slow, switch to local:
  ```
  # In backend/.env
  BLOCKCHAIN_NETWORK=development
  ```

### 4. Too Many API Calls on Dashboard
**Symptom:** Dashboard loads slowly
**Current Status:** 
- Donor dashboard makes multiple API calls
- NGO dashboard loads project details
- This is NORMAL for first load

## Quick Fixes

### If Backend is Slow:
1. Check database connection
2. Restart PostgreSQL service
3. Clear old sessions: `python manage.py clearsessions`

### If Frontend is Slow:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check browser console for errors (F12)
3. Restart frontend: `npm start`

### If Both are Slow:
1. Restart computer (clears memory)
2. Check antivirus isn't blocking ports
3. Check Windows Firewall settings

## Testing Checklist

- [ ] Backend responds in < 2 seconds
- [ ] Frontend .env file exists
- [ ] PostgreSQL is running
- [ ] Login works and redirects
- [ ] Dashboard loads within 5 seconds
- [ ] No console errors in browser

## Performance Expectations

**Normal Loading Times:**
- Login: 1-2 seconds
- Dashboard first load: 2-5 seconds
- Dashboard subsequent loads: < 1 second (cached)
- Project details: 1-3 seconds

**If slower than this, investigate:**
1. Network issues
2. Database performance
3. Too many records in database
4. Blockchain service timeout

## Need Help?

Run the test script and share the output:
```bash
python test_backend_speed.py
```
