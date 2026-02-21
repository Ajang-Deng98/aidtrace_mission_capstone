# Funded Projects Filtering Feature

## Overview
Donors can now see which projects are already funded and which are available for funding. Funded projects are clearly marked and cannot be funded again.

## Changes Made

### Backend Changes (`backend/api/views.py`)

**Updated `get_all_projects` endpoint:**
- Now filters projects to only show those with `status='PENDING_FUNDING'`
- Funded projects (status changed to 'FUNDED') are excluded from the available list
- This prevents donors from attempting to fund already funded projects

```python
@require_http_methods(["GET"])
@require_auth(['DONOR'])
def get_all_projects(request):
    # Only show projects that are PENDING_FUNDING (not yet funded)
    projects = Project.objects.filter(is_approved=True, status='PENDING_FUNDING').order_by('-created_at')
    return JsonResponse(ProjectSerializer(projects, many=True).data, safe=False)
```

### Frontend Changes (`frontend/src/pages/DonorDashboard.js`)

**Updated `AllProjects` component:**

1. **Added State Management:**
   - `fundedProjects` - stores already funded projects
   - `showFunded` - toggles between available and funded views

2. **Added Toggle Buttons:**
   - "Available for Funding" - shows projects ready to be funded
   - "Already Funded" - shows projects that have been funded
   - Each button displays count of projects

3. **Visual Indicators for Funded Projects:**
   - Grayed out appearance (opacity: 0.8)
   - Yellow warning badge: "✓ Already Funded"
   - Disabled "Not Available for Funding" button
   - Different color scheme (gray instead of blue)

## User Experience

### Available Projects View
```
┌─────────────────────────────────────────┐
│ [Available for Funding (5)]             │
│ [Already Funded (3)]                    │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ Project Title (Blue)             │   │
│ │ Category Badge                   │   │
│ │ Description...                   │   │
│ │ Location, Budget, etc.           │   │
│ │ Status: Ready for Funding        │   │
│ │ [Fund This Project] (Active)     │   │
│ └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Already Funded View
```
┌─────────────────────────────────────────┐
│ [Available for Funding (5)]             │
│ [Already Funded (3)] (Active)           │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ Project Title (Gray)             │   │
│ │ Category Badge (Gray)            │   │
│ │ Description... (Grayed)          │   │
│ │ Location, Budget, etc.           │   │
│ │ ⚠ ✓ Already Funded               │   │
│ │ This project has received funding│   │
│ │ [Not Available] (Disabled)       │   │
│ └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

## How It Works

### Funding Flow:
1. Donor views "Available for Funding" projects
2. Donor funds a project
3. Backend changes project status from 'PENDING_FUNDING' to 'FUNDED'
4. Project disappears from "Available for Funding" list
5. Project appears in "Already Funded" list
6. Other donors see it as unavailable

### Status Transitions:
```
PENDING_FUNDING → (Donor funds) → FUNDED → (Supplier assigned) → SUPPLIER_ASSIGNED → ...
```

## Benefits

### For Donors:
✅ Clear visibility of which projects need funding
✅ No confusion about project availability
✅ Can see all funded projects for transparency
✅ Prevents accidental duplicate funding attempts

### For System:
✅ Prevents multiple funding of same project
✅ Clear project lifecycle management
✅ Better data organization
✅ Improved user experience

## Visual Design

### Available Projects:
- **Border:** Blue (#1CABE2)
- **Title:** Blue color
- **Badge:** Green "Ready for Funding"
- **Button:** Active blue button
- **Opacity:** 100%

### Funded Projects:
- **Border:** Gray (#e0e0e0)
- **Title:** Gray color
- **Badge:** Gray category badge
- **Warning:** Yellow badge "✓ Already Funded"
- **Button:** Disabled gray button
- **Opacity:** 80%
- **Background:** Light gray (#f9f9f9)

## Testing

### Test Scenarios:

1. **View Available Projects:**
   - Login as Donor
   - Go to "Browse Projects"
   - Verify only PENDING_FUNDING projects appear
   - Verify "Fund This Project" button is active

2. **Fund a Project:**
   - Select a project
   - Enter amount and signature
   - Submit funding
   - Verify project disappears from available list

3. **View Funded Projects:**
   - Click "Already Funded" tab
   - Verify funded project appears
   - Verify "✓ Already Funded" badge shows
   - Verify button is disabled

4. **Toggle Between Views:**
   - Click between tabs
   - Verify correct projects show in each view
   - Verify counts are accurate

## API Behavior

### Before Change:
```
GET /api/donor/projects
Returns: All approved projects (regardless of funding status)
```

### After Change:
```
GET /api/donor/projects
Returns: Only projects with status='PENDING_FUNDING'
```

### Funded Projects:
```
GET /api/donor/funded-projects
Returns: Projects the current donor has funded
```

## Database Impact

**No database changes required** - uses existing `status` field:
- `PENDING_FUNDING` - Available for funding
- `FUNDED` - Already funded (not available)
- Other statuses - Also not available for new funding

## Summary

✅ **Completed:** Funded projects filtering
✅ **Backend:** Filter by PENDING_FUNDING status
✅ **Frontend:** Toggle view with visual indicators
✅ **UX:** Clear distinction between available and funded
✅ **Prevention:** No duplicate funding attempts
✅ **Transparency:** Donors can see all funded projects

## Files Modified

1. `backend/api/views.py` - Updated get_all_projects filter
2. `frontend/src/pages/DonorDashboard.js` - Added toggle and visual indicators

## No Changes To:
- Database schema
- Models
- Blockchain integration
- Other user roles
- Authentication
- API endpoints (except filtering logic)

---

**Status:** ✅ Complete and Ready to Use
**Impact:** Improved donor experience and prevented duplicate funding
