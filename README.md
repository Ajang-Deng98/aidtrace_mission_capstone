# AidTrace — Blockchain-Powered Aid Distribution Platform

> Transparent, verifiable humanitarian aid tracking from donor to beneficiary using Ethereum smart contracts, biometric verification, and OTP confirmation.

**Live Demo:** https://aidtrace-southsudan.vercel.app  
**Backend API:** https://aidtrace98ss-gzchbveebkf3ahfc.southafricanorth-01.azurewebsites.net/api  
**Smart Contract (Sepolia):** `0x394D38B35364BB63bF6497b925E9bEF6Bc056Be3`  
**Etherscan:** https://sepolia.etherscan.io/address/0x394D38B35364BB63bF6497b925E9bEF6Bc056Be3

---

## Table of Contents

- [System Overview](#system-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation — Step by Step](#installation--step-by-step)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [User Roles & Test Accounts](#user-roles--test-accounts)
- [Core Features](#core-features)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

---

## System Overview

AidTrace is a 5-role platform that tracks the full lifecycle of humanitarian aid:

```
Donor funds project → NGO creates project → Supplier quotes & delivers
→ Field Officer verifies delivery → Beneficiary receives aid (Face + OTP)
→ Every step recorded on Ethereum blockchain
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Web3.js, Face-API.js |
| Backend | Django 4, PostgreSQL, JWT (HS256), Twilio OTP |
| Blockchain | Solidity 0.8.19, Truffle, Sepolia Testnet, Alchemy |
| Deployment | Vercel (frontend), Azure App Service (backend) |

---

## Prerequisites

Before installing, make sure you have:

- **Node.js** v16 or higher — https://nodejs.org
- **Python** 3.10 or higher — https://python.org
- **PostgreSQL** 14 or higher — https://postgresql.org
- **Git** — https://git-scm.com

Check versions:
```bash
node --version
python --version
psql --version
```

---

## Installation — Step by Step

### Step 1 — Clone the Repository

```bash
git clone <repository-url>
cd aidtrace_project
```

---

### Step 2 — PostgreSQL Database Setup

Open PostgreSQL shell (`psql`) and run:

```sql
CREATE DATABASE aidtrace_db;
CREATE USER postgres WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE aidtrace_db TO postgres;
\q
```

---

### Step 3 — Backend Setup

```bash
cd backend
```

Create a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Create the `.env` file (see [Environment Variables](#environment-variables) section below).

Run database migrations:
```bash
python manage.py migrate
```

Create a superuser (Admin account):
```bash
python manage.py createsuperuser
```

---

### Step 4 — Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create `.env.local` for local development:
```
REACT_APP_API_URL=http://localhost:8000/api
```

---

### Step 5 — Blockchain Setup (Optional — Sepolia already deployed)

> Skip this step if you want to use the already-deployed contract on Sepolia testnet.

```bash
cd blockchain
npm install
```

To deploy locally with Ganache:
```bash
# Install Ganache desktop from https://trufflesuite.com/ganache/
truffle migrate --network development
```

---

## Environment Variables

### `backend/.env`

```env
# Database
DB_NAME=aidtrace_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Blockchain (Sepolia Testnet)
BLOCKCHAIN_NETWORK=sepolia
SEPOLIA_CONTRACT_ADDRESS=0x394D38B35364BB63bF6497b925E9bEF6Bc056Be3
ALCHEMY_API_KEY=your_alchemy_api_key
BLOCKCHAIN_PRIVATE_KEY=your_wallet_private_key

# Twilio OTP
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# Email (Gmail SMTP)
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_gmail_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### `frontend/.env.local`

```env
REACT_APP_API_URL=http://localhost:8000/api
```

---

## Running the App

### Start Backend

```bash
cd backend
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
python manage.py runserver
```

Backend runs at: http://localhost:8000

### Start Frontend

```bash
cd frontend
npm start
```

Frontend runs at: http://localhost:3000

> Both must be running at the same time. Open two terminals.

---

## User Roles & Test Accounts

The platform has 5 roles. Use the deployed version at https://aidtrace-southsudan.vercel.app or register locally.

| Role | What They Do |
|---|---|
| **ADMIN** | Approves users and projects, views all activity |
| **NGO** | Creates projects, registers beneficiaries, requests quotes |
| **DONOR** | Browses and funds projects, signs transactions |
| **SUPPLIER** | Receives quote requests, submits bids, confirms delivery |
| **FIELD_OFFICER** | Verifies beneficiary identity (face + OTP), records distribution |

> New registrations require Admin approval before login is allowed.

---

## Core Features

### 1. Project Lifecycle (10 Stages)
```
CREATED → PENDING_FUNDING → FUNDED → QUOTE_REQUESTED
→ QUOTE_SELECTED → SUPPLIER_CONFIRMED → FIELD_OFFICER_CONFIRMED
→ READY_FOR_DISTRIBUTION → IN_DISTRIBUTION → COMPLETED
```

### 2. Blockchain Transparency
Every major action (project creation, funding, quote selection, delivery, distribution) is recorded as an immutable transaction on the Sepolia Ethereum testnet. Verifiable at:
```
https://sepolia.etherscan.io/address/0x394D38B35364BB63bF6497b925E9bEF6Bc056Be3
```

### 3. Dual Beneficiary Verification
Distribution only completes when **both** pass:
- Face recognition via Face-API.js (Euclidean distance < 0.6 against stored 128-float descriptor)
- Twilio SMS OTP sent to registered phone number

### 4. Supplier Quote System
NGOs post supply requests → Multiple suppliers submit competitive bids → NGO selects best quote → Blockchain records selection.

### 5. Public Transparency Reports
Anyone (no login required) can submit a report about a project or view all submitted reports at `/public-report`.

### 6. Multilingual Support
Full Arabic and English UI switching on all pages.

---

## Testing

### Unit Tests — Frontend (34 tests)
Tests pure validation logic: login form, beneficiary form, project form, wallet address, aid records.
```bash
cd frontend
npm run test:unit
```

### Unit Tests — Backend (4 tests)
Tests Django model creation and password hashing.
```bash
cd backend
python manage.py test tests.test_api.ModelTests tests.test_api.PasswordTests --verbosity=2
```

### Integration Tests — Frontend (25 tests)
Tests all API modules against mocked backend responses using axios-mock-adapter.
```bash
cd frontend
npm run test:integration
```

### Integration Tests — Backend (13 tests)
Tests real HTTP endpoints against a Django test database.
```bash
cd backend
python manage.py test tests.test_api --verbosity=2
```

### Security Tests — Backend (38 tests)
Tests authentication enforcement, role-based access control, cross-user data isolation, and token validation.
```bash
cd backend
python manage.py test tests.test_security --verbosity=2
```

### System Tests — Cypress E2E (22 tests)
Simulates full user journeys through the browser. Requires frontend running on localhost:3000.

Terminal 1:
```bash
cd frontend && npm start
```

Terminal 2:
```bash
cd frontend
npm run cypress:system
```

### Blockchain Tests (10 tests)
Tests contract ABI, address validation, gas estimation, and event emission (no network required).
```bash
cd backend
python manage.py test tests.test_blockchain --verbosity=2
```

### Run All Tests at Once
```bash
# All Jest tests
cd frontend && npm run test:all

# All Django tests
cd backend && python manage.py test tests --verbosity=2
```

**Total: 208 tests across 9 test files**

| Test Type | File | Count |
|---|---|---|
| Unit (JS) | `frontend/src/tests/unit.test.js` | 34 |
| Integration (JS) | `frontend/src/tests/integration.test.js` | 25 |
| Component Render | `frontend/src/tests/` | 39 |
| System E2E | `frontend/cypress/e2e/system.cy.js` | 22 |
| Security E2E | `frontend/cypress/e2e/security.cy.js` | 23 |
| Backend Integration | `backend/tests/test_api.py` | 13 |
| Backend Security | `backend/tests/test_security.py` | 38 |
| Blockchain | `backend/tests/test_blockchain.py` | 10 |
| Blockchain (JS) | `blockchain/test/AidTrace.test.js` | 4 |

---

## Project Structure

```
aidtrace_project/
├── backend/
│   ├── api/
│   │   ├── models.py          # 15 Django models
│   │   ├── views.py           # All role-based views
│   │   ├── auth.py            # JWT HS256 authentication
│   │   ├── blockchain.py      # Web3.py blockchain service
│   │   ├── blockchain_verify.py  # Transaction verification endpoints
│   │   ├── urls.py            # 50+ URL patterns
│   │   └── otp_service.py     # Twilio OTP integration
│   ├── tests/
│   │   ├── test_api.py        # Integration + unit tests
│   │   ├── test_security.py   # Security & RBAC tests
│   │   └── test_blockchain.py # Blockchain service tests
│   └── aidtrace/
│       └── settings.py        # Django configuration
├── frontend/
│   ├── src/
│   │   ├── pages/             # Login, Register, all 5 dashboards
│   │   ├── services/api.js    # All API calls (7 modules)
│   │   ├── utils/validation.js  # Pure validation functions
│   │   └── tests/             # Jest test suites
│   └── cypress/
│       └── e2e/               # System + security E2E tests
└── blockchain/
    ├── contracts/AidTrace.sol  # Solidity 0.8.19 smart contract
    └── test/AidTrace.test.js   # Contract tests
```

---

## Deployment

| Component | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://aidtrace-southsudan.vercel.app |
| Backend | Azure App Service (South Africa North) | https://aidtrace98ss-gzchbveebkf3ahfc.southafricanorth-01.azurewebsites.net |
| Database | Azure PostgreSQL Flexible Server | South Africa North region |
| Blockchain | Ethereum Sepolia Testnet via Alchemy | Chain ID: 11155111 |

### Deploy Frontend to Vercel
```bash
cd frontend
npm run build
# Push to GitHub — Vercel auto-deploys on push to main
```

### Deploy Backend to Azure
```bash
cd backend
# Azure App Service deploys via GitHub Actions
# See .github/workflows/main_aidtrace98ss.yml
```

---

## License

MIT License — see LICENSE file for details.
