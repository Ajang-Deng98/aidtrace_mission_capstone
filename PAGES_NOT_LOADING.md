# 🚨 PAGES NOT LOADING? READ THIS! 🚨

## The Problem
Your pages take long to load or don't show because **THE BACKEND IS NOT RUNNING**.

## The Solution (2 Simple Steps)

### Step 1: Start Backend
Open a terminal and run:
```bash
cd c:\dev\aidtrace_project\backend
python manage.py runserver
```

**Wait for this message:**
```
Starting development server at http://127.0.0.1:8000/
```

✅ Backend is now running! **KEEP THIS TERMINAL OPEN**

---

### Step 2: Start Frontend
Open a **NEW** terminal (don't close the first one!) and run:
```bash
cd c:\dev\aidtrace_project\frontend
npm start
```

Browser will automatically open at `http://localhost:3000`

✅ Frontend is now running! **KEEP THIS TERMINAL OPEN TOO**

---

## ✅ How to Know It's Working

1. **Backend terminal** shows: `"GET /api/..." 200 OK`
2. **Frontend** loads in browser
3. **Login works** and redirects to dashboard
4. **Dashboard shows data** within 2-5 seconds

---

## ❌ Common Mistakes

### Mistake 1: Only starting frontend
**Problem:** Pages never load, console shows network errors
**Fix:** Start backend first (Step 1 above)

### Mistake 2: Closing backend terminal
**Problem:** App works then suddenly stops
**Fix:** Keep both terminals open

### Mistake 3: Wrong directory
**Problem:** Commands don't work
**Fix:** Make sure you're in the correct directory:
- Backend: `c:\dev\aidtrace_project\backend`
- Frontend: `c:\dev\aidtrace_project\frontend`

---

## 🔧 Still Having Issues?

### Check 1: Is PostgreSQL running?
```bash
# Check if database is accessible
psql -U postgres -d aidtrace_db
```

### Check 2: Are ports available?
- Backend needs port **8000**
- Frontend needs port **3000**

### Check 3: Check backend terminal for errors
Look for:
- Database connection errors
- Port already in use
- Missing dependencies

---

## 📊 Expected Loading Times

| Action | Time |
|--------|------|
| Login | 1-2 seconds |
| Dashboard (first load) | 2-5 seconds |
| Dashboard (cached) | < 1 second |
| Project details | 1-3 seconds |

If slower, check backend terminal for errors.

---

## 🎯 Quick Start (Copy & Paste)

**Terminal 1 (Backend):**
```bash
cd c:\dev\aidtrace_project\backend && python manage.py runserver
```

**Terminal 2 (Frontend):**
```bash
cd c:\dev\aidtrace_project\frontend && npm start
```

---

## 💡 Pro Tips

1. **Use 2 separate terminal windows** - easier to see errors
2. **Check backend terminal first** if pages don't load
3. **Clear browser cache** (Ctrl+Shift+Delete) if pages look broken
4. **Restart both servers** if something feels stuck

---

## ✅ Checklist Before Asking for Help

- [ ] Backend is running (terminal shows "Starting development server")
- [ ] Frontend is running (browser opened automatically)
- [ ] PostgreSQL is running
- [ ] No errors in backend terminal
- [ ] No errors in browser console (F12)
- [ ] Tried clearing browser cache
- [ ] Tried restarting both servers

---

**Remember: You need BOTH backend AND frontend running at the same time!**
