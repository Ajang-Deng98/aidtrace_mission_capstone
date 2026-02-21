# Quick Start Guide - New Features

## 🚀 Getting Started

### Prerequisites
- Backend server running
- Frontend server running
- Database migration completed

---

## Feature 1: Face Scanning (Field Officer)

### Step-by-Step:

1. **Login as Field Officer**
2. **Navigate to Beneficiaries Tab**
3. **Select a Project**
4. **Click "Register New Beneficiary"**
5. **Fill Form:**
   - Name: John Doe
   - Phone: +211123456789
   - **Upload Face Photo** (Required)
6. **Submit**
7. **Verify "✓ Verified" appears in list**

### Visual:
```
Beneficiaries Tab
├─ Select Project: [Dropdown]
├─ [Register New Beneficiary]
└─ Form:
   ├─ Name: [_______]
   ├─ Phone: [_______]
   └─ Face Photo: 📷 [Upload]
      └─ Preview shows after upload
```

---

## Feature 2: Funded Projects (Donor)

### Step-by-Step:

1. **Login as Donor**
2. **Navigate to Browse Projects**
3. **See Two Tabs:**
   - Available for Funding (Active projects)
   - Already Funded (Funded projects)
4. **Toggle Between Views**
5. **Available projects:** Blue, active buttons
6. **Funded projects:** Gray, disabled buttons

### Visual:
```
Browse Projects
├─ [Available for Funding (5)] [Already Funded (3)]
└─ Projects Display:
   ├─ Available: Blue theme, "Fund This Project"
   └─ Funded: Gray theme, "Not Available"
```

---

## Deployment Checklist

- [ ] Run: `run_migration.bat`
- [ ] Start backend: `python manage.py runserver`
- [ ] Start frontend: `npm start`
- [ ] Test face scanning
- [ ] Test funded projects filter

---

## Quick Test (2 Minutes)

**Face Scanning:**
```
Field Officer → Beneficiaries → Register → Upload Photo → Submit → See ✓
```

**Funded Projects:**
```
Donor → Browse Projects → Toggle tabs → See visual difference
```

---

## Need Help?

- Face Scanning: Read `README_FACE_SCANNING.md`
- Funded Projects: Read `FUNDED_PROJECTS_FILTERING.md`
- Full Details: Read `IMPLEMENTATION_SUMMARY.md`
