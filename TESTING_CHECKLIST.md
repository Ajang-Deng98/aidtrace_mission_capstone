# Testing Checklist: Face Scanning Feature

## Pre-Testing Setup

### 1. Run Database Migration
- [ ] Navigate to project root: `cd c:\dev\aidtrace_project`
- [ ] Run migration script: `run_migration.bat`
- [ ] Verify migration success message appears
- [ ] Check for any error messages

### 2. Start Backend Server
- [ ] Open terminal/command prompt
- [ ] Navigate to backend: `cd c:\dev\aidtrace_project\backend`
- [ ] Start server: `python manage.py runserver`
- [ ] Verify server starts on http://localhost:8000
- [ ] Check for any startup errors

### 3. Start Frontend Server
- [ ] Open new terminal/command prompt
- [ ] Navigate to frontend: `cd c:\dev\aidtrace_project\frontend`
- [ ] Start server: `npm start`
- [ ] Verify frontend opens in browser
- [ ] Check for any console errors

---

## Testing Scenarios

### Test 1: Login as Field Officer
- [ ] Navigate to login page
- [ ] Enter Field Officer credentials
- [ ] Click "Login"
- [ ] Verify successful login
- [ ] Verify Field Officer Dashboard loads

### Test 2: Navigate to Beneficiaries Tab
- [ ] Click "Beneficiaries" in sidebar
- [ ] Verify page loads correctly
- [ ] Verify "Select Project" dropdown appears
- [ ] Verify no errors in console

### Test 3: Select Project
- [ ] Click "Select Project" dropdown
- [ ] Verify list of confirmed projects appears
- [ ] Select a project from the list
- [ ] Verify "Register New Beneficiary" button appears
- [ ] Verify "Registered Beneficiaries" section appears

### Test 4: Open Registration Form
- [ ] Click "Register New Beneficiary" button
- [ ] Verify registration form appears
- [ ] Verify form contains:
  - [ ] "Beneficiary Name" field
  - [ ] "Phone Number" field
  - [ ] "Face Photo (Required)" section with camera icon
  - [ ] "Choose Photo" button
  - [ ] Helper text about facial recognition

### Test 5: Upload Face Photo
- [ ] Click "Choose Photo" button
- [ ] Verify file picker opens
- [ ] Select an image file (JPG, PNG, etc.)
- [ ] Verify image preview appears
- [ ] Verify "✓ Face photo uploaded" message appears
- [ ] Verify "Change Photo" button appears

### Test 6: Change Photo (Optional)
- [ ] Click "Change Photo" button
- [ ] Verify file picker opens again
- [ ] Select a different image
- [ ] Verify new image preview appears
- [ ] Verify preview updates correctly

### Test 7: Submit Without Photo (Validation Test)
- [ ] Clear the form (refresh page if needed)
- [ ] Fill in name: "Test User"
- [ ] Fill in phone: "+211123456789"
- [ ] Do NOT upload a photo
- [ ] Click "Register Beneficiary"
- [ ] Verify error message: "Please upload a face photo"
- [ ] Verify form does not submit

### Test 8: Submit With All Fields
- [ ] Fill in name: "John Doe"
- [ ] Fill in phone: "+211123456789"
- [ ] Upload a face photo
- [ ] Verify preview appears
- [ ] Click "Register Beneficiary"
- [ ] Verify success message: "Beneficiary registered successfully with face verification confirmed!"
- [ ] Verify form closes
- [ ] Verify form fields are cleared

### Test 9: Verify Beneficiary in List
- [ ] Check "Registered Beneficiaries" table
- [ ] Verify new beneficiary appears in list
- [ ] Verify columns show:
  - [ ] Name: "John Doe"
  - [ ] Phone Number: "+211123456789"
  - [ ] Face Verified: "✓ Verified" (in green)
  - [ ] Registered Date: Today's date
- [ ] Verify green checkmark is visible

### Test 10: Register Multiple Beneficiaries
- [ ] Click "Register New Beneficiary" again
- [ ] Register 2-3 more beneficiaries with different photos
- [ ] Verify each registration succeeds
- [ ] Verify all appear in the list
- [ ] Verify all show "✓ Verified" status

### Test 11: Check Database (Backend Verification)
- [ ] Open database management tool (pgAdmin, DBeaver, etc.)
- [ ] Connect to aidtrace_db database
- [ ] Query beneficiaries table:
  ```sql
  SELECT id, name, phone_number, face_verified, 
         LENGTH(face_photo) as photo_size
  FROM beneficiaries
  ORDER BY created_at DESC
  LIMIT 5;
  ```
- [ ] Verify face_verified = true for all new entries
- [ ] Verify face_photo contains data (photo_size > 0)

### Test 12: API Response Check (Developer Test)
- [ ] Open browser Developer Tools (F12)
- [ ] Go to Network tab
- [ ] Register a new beneficiary
- [ ] Find the API request to `/api/field-officer/beneficiaries/add`
- [ ] Check Response:
  - [ ] Verify status code: 200
  - [ ] Verify response contains face_photo field
  - [ ] Verify face_verified: true
  - [ ] Verify face_photo starts with "data:image/"

### Test 13: Different Image Formats
- [ ] Test with JPG image - [ ] Success
- [ ] Test with PNG image - [ ] Success
- [ ] Test with JPEG image - [ ] Success
- [ ] Test with large image (>5MB) - [ ] Check behavior
- [ ] Test with small image (<100KB) - [ ] Success

### Test 14: Edge Cases
- [ ] Try uploading non-image file (PDF, TXT) - [ ] Should reject
- [ ] Try very long name (>255 chars) - [ ] Check validation
- [ ] Try invalid phone format - [ ] Check validation
- [ ] Try duplicate phone number - [ ] Check behavior

### Test 15: UI/UX Verification
- [ ] Verify upload area has dashed border
- [ ] Verify camera icon (📷) is visible
- [ ] Verify colors match theme (blue #1CABE2)
- [ ] Verify buttons are clickable
- [ ] Verify hover effects work
- [ ] Verify responsive design (resize browser)

### Test 16: Cross-Browser Testing (Optional)
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Edge
- [ ] Test in Safari (if available)

---

## Expected Results Summary

### ✅ What Should Work:
1. Face photo upload is REQUIRED
2. Image preview shows before submission
3. Automatic verification (mockup - always True)
4. Success message confirms verification
5. Beneficiary list shows "✓ Verified" status
6. Database stores base64 encoded image
7. face_verified field is set to true

### ❌ What Should NOT Happen:
1. Registration without photo should fail
2. No errors in console
3. No blockchain modifications
4. No changes to other features
5. No impact on existing beneficiaries

---

## Troubleshooting

### Issue: Migration Fails
**Solution:**
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Issue: Image Not Uploading
**Check:**
- File input accepts "image/*"
- FileReader is working
- Base64 conversion is successful
- Check browser console for errors

### Issue: Verification Status Not Showing
**Check:**
- Serializer includes face_verified field
- API response contains face_verified
- Frontend is reading face_verified from response
- Table column is rendering correctly

### Issue: Database Error
**Check:**
- Migration was run successfully
- PostgreSQL is running
- Database connection is working
- Table has new columns

---

## Performance Testing

### Test 17: Large Image Upload
- [ ] Upload 5MB image
- [ ] Measure upload time
- [ ] Verify preview loads
- [ ] Verify submission succeeds
- [ ] Check if any lag occurs

### Test 18: Multiple Rapid Registrations
- [ ] Register 5 beneficiaries quickly
- [ ] Verify all succeed
- [ ] Check for any race conditions
- [ ] Verify all appear in list

---

## Security Testing

### Test 19: SQL Injection (Basic)
- [ ] Try entering SQL in name field: `'; DROP TABLE beneficiaries; --`
- [ ] Verify it's treated as text, not SQL
- [ ] Verify registration succeeds or fails gracefully

### Test 20: XSS Prevention (Basic)
- [ ] Try entering script in name: `<script>alert('XSS')</script>`
- [ ] Verify it's escaped/sanitized
- [ ] Verify no script execution

---

## Final Verification

### Checklist:
- [ ] All tests passed
- [ ] No console errors
- [ ] No database errors
- [ ] UI looks professional
- [ ] Face verification works
- [ ] Documentation is clear
- [ ] Ready for production use

---

## Test Results Log

**Date:** _______________
**Tester:** _______________
**Environment:** Development / Staging / Production

### Summary:
- Total Tests: 20
- Passed: _____ / 20
- Failed: _____ / 20
- Skipped: _____ / 20

### Issues Found:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Notes:
_______________________________________________
_______________________________________________
_______________________________________________

### Sign-off:
- [ ] Feature is working as expected
- [ ] Ready for deployment
- [ ] Documentation is complete

**Signature:** _______________
**Date:** _______________

---

## Quick Test (5 Minutes)

If you're short on time, run this quick test:

1. [ ] Run migration: `run_migration.bat`
2. [ ] Start backend: `python manage.py runserver`
3. [ ] Start frontend: `npm start`
4. [ ] Login as Field Officer
5. [ ] Go to Beneficiaries tab
6. [ ] Select a project
7. [ ] Click "Register New Beneficiary"
8. [ ] Upload a photo
9. [ ] Fill name and phone
10. [ ] Submit
11. [ ] Verify "✓ Verified" appears in list

✅ If all 11 steps work, the feature is functional!
