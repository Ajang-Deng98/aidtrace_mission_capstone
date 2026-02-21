@echo off
echo Running database migration for distribution face scan...
cd backend
python manage.py migrate
echo.
echo Migration completed!
pause
