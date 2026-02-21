@echo off
echo Running database migration for face photo feature...
cd backend
python manage.py migrate
echo.
echo Migration completed!
echo.
echo The beneficiary registration now includes:
echo - Face photo upload (required)
echo - Automatic face verification (mockup - always confirms)
echo - Face verified status stored in database
echo.
pause
