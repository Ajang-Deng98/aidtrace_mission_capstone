# AidTrace Azure Deployment Guide

## Files Prepared ✅
- backend/requirements.txt (added gunicorn, whitenoise)
- backend/aidtrace/settings.py (production ready)
- backend/.env.example (template for Azure)
- backend/startup.sh (Azure startup script)
- frontend/.env.production (API URL template)

---

## STEP 1: Create Azure PostgreSQL Database

### 1.1 In Azure Portal
1. Search "Azure Database for PostgreSQL"
2. Click "Create" → "Flexible server"
3. Fill in:
   - **Resource group**: Create new → `aidtrace-rg`
   - **Server name**: `aidtraceserver` (must be unique)
   - **Region**: Choose closest
   - **PostgreSQL version**: 16
   - **Compute + storage**: Burstable, B1ms
   - **Admin username**: Create username (save it!)
   - **Password**: Create strong password (save it!)

4. Click "Networking" tab:
   - **Connectivity method**: Public access
   - **Firewall rules**: Check "Allow public access from any Azure service"
   - **Add current client IP**: Yes

5. Click "Review + create" → "Create"
6. Wait 5-10 minutes

### 1.2 Create Database
1. Go to your PostgreSQL server `aidtraceserver`
2. Click "Databases" → "Add"
3. Database name: `aidtrace_db`
4. Click "Save"

### 1.3 Note Connection Details
```
Host: aidtraceserver.postgres.database.azure.com
Database: aidtrace_db
User: [your admin username]
Password: [your password]
Port: 5432
```

---

## STEP 2: Create Backend App Service

### 2.1 In Azure Portal
1. Search "App Services"
2. Click "Create" → "Web App"
3. Fill in:
   - **Resource group**: `aidtrace-rg` (same as database)
   - **Name**: `aidtrace-backend` (must be unique, try adding numbers if taken)
   - **Publish**: Code
   - **Runtime stack**: Python 3.11
   - **Region**: Same as database
   - **Pricing plan**: Basic B1

4. Click "Review + create" → "Create"
5. Wait 2-3 minutes

### 2.2 Configure Environment Variables
1. Go to your App Service
2. Click "Configuration" → "Application settings"
3. Add these settings (click "New application setting" for each):

```
DB_NAME = aidtrace_db
DB_USER = [your admin username]
DB_PASSWORD = [your database password]
DB_HOST = aidtraceserver.postgres.database.azure.com
DB_PORT = 5432

SECRET_KEY = [generate random 50-character string]
DEBUG = False
ALLOWED_HOSTS = aidtrace-backend.azurewebsites.net

BLOCKCHAIN_NETWORK = sepolia
SEPOLIA_CONTRACT_ADDRESS = 0x394D38B35364BB63bF6497b925E9bEF6Bc056Be3
ALCHEMY_API_KEY = your_alchemy_api_key
BLOCKCHAIN_PRIVATE_KEY = your_wallet_private_key
MNEMONIC = your twelve word mnemonic phrase

EMAIL_HOST_USER = your_email@gmail.com
EMAIL_HOST_PASSWORD = your_app_password

TWILIO_ACCOUNT_SID = your_twilio_sid
TWILIO_AUTH_TOKEN = your_twilio_token
TWILIO_PHONE_NUMBER = your_twilio_number

SCM_DO_BUILD_DURING_DEPLOYMENT = true
```

4. Click "Save" → "Continue"

### 2.3 Configure Startup Command
1. Still in "Configuration"
2. Click "General settings" tab
3. **Startup Command**: `bash startup.sh`
4. Click "Save"

---

## STEP 3: Deploy Backend Code

### 3.1 Using Local Git (Recommended)

**In Azure Portal:**
1. Go to App Service → "Deployment Center"
2. Source: "Local Git"
3. Click "Save"
4. Copy the Git URL shown

**In your terminal:**
```bash
cd c:/dev/aidtrace_project/backend

# Initialize git if not already
git init
git add .
git commit -m "Initial backend deployment"

# Add Azure remote
git remote add azure [paste Git URL from Azure]

# Push to Azure
git push azure master
```

### 3.2 Using GitHub (Alternative)

**In Azure Portal:**
1. Go to App Service → "Deployment Center"
2. Source: "GitHub"
3. Authorize GitHub
4. Select: Organization, Repository, Branch
5. Click "Save"

**Auto-deploys on every push to GitHub!**

---

## STEP 4: Run Database Migrations

### 4.1 Using Azure Cloud Shell
1. In Azure Portal, click Cloud Shell icon (top right)
2. Choose "Bash"
3. Run:
```bash
az webapp ssh --name aidtrace-backend --resource-group aidtrace-rg
```

4. Inside SSH session:
```bash
cd /home/site/wwwroot
python manage.py migrate
python manage.py createsuperuser
# Follow prompts to create admin user
exit
```

---

## STEP 5: Create Frontend Static Web App

### 5.1 Update .env.production
Replace `YOUR_BACKEND_NAME` with your actual backend name:
```
REACT_APP_API_URL=https://aidtrace-backend.azurewebsites.net
```

### 5.2 In Azure Portal
1. Search "Static Web Apps"
2. Click "Create"
3. Fill in:
   - **Resource group**: `aidtrace-rg`
   - **Name**: `aidtrace-frontend`
   - **Plan type**: Free
   - **Region**: Choose closest
   - **Deployment source**: GitHub
   - **Organization**: Your GitHub
   - **Repository**: aidtrace-project
   - **Branch**: main
   - **Build preset**: React
   - **App location**: `/frontend`
   - **Output location**: `build`

4. Click "Review + create" → "Create"
5. Wait 5 minutes for deployment

---

## STEP 6: Configure CORS

### 6.1 Get Frontend URL
1. Go to Static Web App
2. Copy URL (e.g., `https://happy-ocean-123.azurestaticapps.net`)

### 6.2 Update Backend CORS
1. Go to Backend App Service
2. Configuration → Application settings
3. Update `ALLOWED_HOSTS`:
```
ALLOWED_HOSTS = aidtrace-backend.azurewebsites.net,happy-ocean-123.azurestaticapps.net
```
4. Click "Save"
5. Restart App Service

---

## STEP 7: Test Deployment

### 7.1 Test Backend
Visit: `https://aidtrace-backend.azurewebsites.net/admin`
- Should see Django admin login
- Login with superuser credentials

### 7.2 Test Frontend
Visit: `https://[your-frontend-url].azurestaticapps.net`
- Should see AidTrace homepage
- Try login/register
- Create test project

---

## STEP 8: Monitor & Troubleshoot

### View Backend Logs
```bash
az webapp log tail --name aidtrace-backend --resource-group aidtrace-rg
```

### View Frontend Logs
1. Static Web App → "Functions" → "Logs"

### Common Issues

**Backend 500 Error:**
- Check environment variables
- Check database connection
- View logs

**Frontend API Error:**
- Check CORS settings
- Verify backend URL in .env.production
- Check backend is running

---

## Cost Summary

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| PostgreSQL | B1ms | ~$15 |
| App Service | B1 | ~$13 |
| Static Web App | Free | $0 |
| **Total** | | **~$28/month** |

---

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Create test users (NGO, Donor, Supplier)
3. ✅ Create test projects
4. ✅ Verify blockchain transactions
5. ✅ Set up custom domain (optional)
6. ✅ Enable SSL (automatic with Azure)
7. ✅ Set up monitoring alerts

---

## Continuous Deployment

**Every time you push to GitHub:**
- Backend: Auto-deploys (if using GitHub deployment)
- Frontend: Auto-deploys and rebuilds

**To update:**
```bash
git add .
git commit -m "your changes"
git push origin main
```

Wait 3-5 minutes for deployment to complete!

---

## Support

**Azure Portal**: https://portal.azure.com
**Documentation**: https://docs.microsoft.com/azure
**Cost Management**: Portal → Cost Management + Billing
