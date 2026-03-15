# AidTrace — Blockchain-Powered Aid Distribution Platform

> Transparent, verifiable humanitarian aid tracking from donor to beneficiary using Ethereum smart contracts, biometric face verification, and SMS OTP confirmation.

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
- [User Roles](#user-roles)
- [Core Features](#core-features)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Security Notes](#security-notes)

---

## System Overview

AidTrace solves a critical problem in humanitarian aid: the inability to verify that donated funds actually reach the intended beneficiaries. Corruption, mismanagement, and lack of transparency erode donor trust and reduce aid effectiveness.

AidTrace addresses this by recording every step of the aid lifecycle on the Ethereum blockchain — creating an immutable, publicly auditable trail from the moment a donor funds a project to the moment a beneficiary physically receives aid.

The platform enforces a strict 5-role workflow:

```
Donor funds project
  → NGO creates project and registers beneficiaries
    → Supplier submits competitive quotes
      → Field Officer verifies delivery on the ground
        → Beneficiary receives aid (face recognition + SMS OTP)
          → Every action recorded on Ethereum Sepolia testnet
```

No single party can falsify a record — the blockchain acts as the source of truth that all roles interact with but none can alter.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18, Tailwind CSS | UI and user dashboards |
| Blockchain (Frontend) | Web3.js | Signing and reading Ethereum transactions from the browser |
| Face Verification | Face-API.js | In-browser face recognition using 128-float descriptors |
| Backend | Django 4, Django REST Framework | REST API, business logic, role-based access control |
| Database | PostgreSQL 14 | Persistent storage for users, projects, beneficiaries, quotes |
| Authentication | JWT (HS256) | Stateless token-based auth with role claims |
| OTP | Twilio SMS | One-time password delivery to beneficiary phone numbers |
| Smart Contract | Solidity 0.8.19 | On-chain event logging for all major aid actions |
| Contract Tooling | Truffle, HDWalletProvider | Compilation, migration, and deployment of Solidity contracts |
| Blockchain Node | Alchemy (Sepolia) | Reliable RPC endpoint for Sepolia testnet |
| Deployment | Vercel (frontend), Azure App Service (backend) | Production hosting |

---

## Prerequisites

Install the following before setting up the project locally:

- **Node.js** v16 or higher — https://nodejs.org  
  Required for the React frontend and Truffle blockchain tooling.
- **Python** 3.10 or higher — https://python.org  
  Required for the Django backend.
- **PostgreSQL** 14 or higher — https://postgresql.org  
  The relational database used by the backend.
- **Git** — https://git-scm.com  
  For cloning the repository.
- **Truffle** (optional, for blockchain redeployment) — installed via npm in the blockchain setup step.

Verify your installations:
```bash
node --version
python --version
psql --version
git --version
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

Open a PostgreSQL shell (`psql`) and create the database and user:

```sql
CREATE DATABASE aidtrace_db;
CREATE USER postgres WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE aidtrace_db TO postgres;
\q
```

> If you already have a `postgres` superuser, you can skip the `CREATE USER` line and just create the database.

---

### Step 3 — Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create and activate a Python virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

Install all Python dependencies:
```bash
pip install -r requirements.txt
```

Create your `.env` file by copying the example:
```bash
cp .env.example .env
```

Fill in the values in `backend/.env` — see the [Environment Variables](#environment-variables) section below.

Run database migrations to create all tables:
```bash
python manage.py migrate
```

Create an Admin superuser account:
```bash
python manage.py createsuperuser
```

> This Admin account is used to approve new user registrations and manage the platform from the Django admin panel at `http://localhost:8000/admin`.

---

### Step 4 — Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd frontend
npm install
```

Create a `.env.local` file for local development:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

> The frontend reads `REACT_APP_API_URL` to know where to send API requests. In production this is set to the Azure backend URL via Vercel environment variables.

---

### Step 5 — Blockchain Setup (Optional)

> The smart contract is already deployed on Sepolia testnet at `0x394D38B35364BB63bF6497b925E9bEF6Bc056Be3`. Skip this step unless you need to redeploy.

Install blockchain dependencies:
```bash
cd blockchain
npm install
```

To deploy to a local Ganache instance for development:
```bash
# Download Ganache desktop from https://trufflesuite.com/ganache/
# Start Ganache (default port 7545), then:
truffle migrate --network development
```

To redeploy to Sepolia testnet:
```bash
# Ensure blockchain/.env has your MNEMONIC and ALCHEMY_API_KEY set
truffle migrate --network sepolia
```

To verify the contract on Etherscan after deployment:
```bash
truffle run verify AidTrace --network sepolia
```

---

## Environment Variables

### `backend/.env`

Copy `backend/.env.example` and fill in your values:

```env
# Database
DB_NAME=aidtrace_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Django
SECRET_KEY=your-long-random-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Blockchain (Sepolia Testnet)
BLOCKCHAIN_NETWORK=sepolia
SEPOLIA_CONTRACT_ADDRESS=0x394D38B35364BB63bF6497b925E9bEF6Bc056Be3
ALCHEMY_API_KEY=your_alchemy_api_key
BLOCKCHAIN_PRIVATE_KEY=your_wallet_private_key

# Twilio OTP
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# Email (Gmail SMTP for password reset)
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_gmail_app_password

# Frontend URL (used in password reset emails)
FRONTEND_URL=http://localhost:3000
```

### `frontend/.env.local`

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### `blockchain/.env`

```env
# 12-word BIP39 mnemonic for the deployer wallet
MNEMONIC=word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12

# Alchemy RPC endpoint API key
ALCHEMY_API_KEY=your_alchemy_api_key

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
```

> Never commit any `.env` file to version control. All three are listed in `.gitignore`.

---

## Running the App

Both the backend and frontend must run simultaneously. Use two separate terminals.

### Terminal 1 — Start Backend

```bash
cd backend
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
python manage.py runserver
```

Backend API available at: `http://localhost:8000`  
Django Admin panel at: `http://localhost:8000/admin`

### Terminal 2 — Start Frontend

```bash
cd frontend
npm start
```

Frontend available at: `http://localhost:3000`

---

## User Roles

AidTrace enforces a strict 5-role permission model. Every API endpoint checks the JWT role claim before allowing access.

| Role | Responsibilities |
|---|---|
| **ADMIN** | Approves or rejects new user registrations. Views all projects, users, and blockchain activity across the platform. |
| **NGO** | Creates aid projects, registers beneficiaries (including uploading face photos), and requests supplier quotes. |
| **DONOR** | Browses active projects, funds them by signing Ethereum transactions via MetaMask or Web3 wallet. |
| **SUPPLIER** | Receives quote requests from NGOs, submits competitive bids with pricing and delivery details, confirms delivery completion. |
| **FIELD_OFFICER** | Physically verifies aid delivery on the ground. Confirms beneficiary identity using face recognition and SMS OTP before marking distribution as complete. |

> All new registrations start as inactive. An Admin must approve the account before the user can log in.

---

## Core Features

### 1. 10-Stage Project Lifecycle

Every project moves through exactly 10 stages, and each transition is gated by the appropriate role:

```
CREATED              → NGO creates the project
PENDING_FUNDING      → Project is open for donor contributions
FUNDED               → Funding target reached, locked on-chain
QUOTE_REQUESTED      → NGO requests supplier bids
QUOTE_SELECTED       → NGO selects winning supplier quote
SUPPLIER_CONFIRMED   → Supplier confirms they can deliver
FIELD_OFFICER_CONFIRMED → Field officer confirms goods arrived at distribution point
READY_FOR_DISTRIBUTION  → System is ready to process beneficiary claims
IN_DISTRIBUTION      → Active distribution in progress
COMPLETED            → All beneficiaries verified and aid distributed
```

No stage can be skipped. This prevents premature completion claims and ensures every party in the chain has confirmed their step.

### 2. Blockchain Transparency

Every major action emits an event to the AidTrace smart contract on Ethereum Sepolia testnet. This includes project creation, funding, quote selection, delivery confirmation, and each individual beneficiary distribution.

These events are permanently stored on-chain and publicly readable by anyone — no login required. The contract address is:
```
0x394D38B35364BB63bF6497b925E9bEF6Bc056Be3
```
View all transactions at: https://sepolia.etherscan.io/address/0x394D38B35364BB63bF6497b925E9bEF6Bc056Be3

### 3. Dual Beneficiary Verification

Aid distribution to a beneficiary only completes when **both** of the following pass in sequence:

- **Face Recognition** — The field officer captures the beneficiary's face via webcam. Face-API.js computes a 128-float face descriptor and compares it against the descriptor stored at registration time using Euclidean distance. A match requires distance < 0.6.
- **SMS OTP** — Twilio sends a one-time password to the beneficiary's registered phone number. The field officer enters the code to confirm physical presence.

Both checks must pass in the same session. Passing only one is not sufficient to record a distribution.

### 4. Competitive Supplier Quote System

NGOs do not select suppliers manually. Instead:
1. NGO posts a supply request with item specifications and quantity.
2. Multiple registered suppliers submit bids with pricing and delivery timelines.
3. NGO reviews all bids and selects the best quote.
4. The selection is recorded on-chain, creating an auditable procurement trail.

### 5. Public Transparency Reports

Anyone — including journalists, auditors, or community members — can visit `/public-report` without logging in to:
- Submit a concern or observation about any project.
- View all previously submitted reports.

This provides an external accountability layer independent of the platform's internal roles.

### 6. Multilingual Support (Arabic / English)

All pages support full Arabic and English UI switching. The translation system is managed in `frontend/src/translations.js` and applies to all dashboards, forms, and error messages.

---

## Testing

The project has 208 tests across 9 test files covering unit, integration, security, end-to-end, and blockchain layers.

### Frontend Unit Tests (34 tests)

Tests pure validation logic in isolation — no API calls, no DOM rendering. Covers login form validation, beneficiary form fields, project form rules, Ethereum wallet address format, and aid record validation.

```bash
cd frontend
npm run test:unit
```

### Frontend Integration Tests (25 tests)

Tests all 7 API service modules (`auth`, `projects`, `beneficiaries`, `quotes`, `suppliers`, `fieldOfficer`, `blockchain`) against mocked backend responses using `axios-mock-adapter`. Verifies correct request construction and response handling.

```bash
cd frontend
npm run test:integration
```

### Frontend Component Render Tests (39 tests)

Tests that all major React components mount without errors and render expected UI elements. Uses React Testing Library.

```bash
cd frontend
npm test
```

### Backend Unit Tests (4 tests)

Tests Django model creation and password hashing behaviour directly against the test database.

```bash
cd backend
python manage.py test tests.test_api.ModelTests tests.test_api.PasswordTests --verbosity=2
```

### Backend Integration Tests (13 tests)

Tests real HTTP endpoints using Django's test client against a temporary test database. Covers the full request/response cycle including serialization, authentication, and database writes.

```bash
cd backend
python manage.py test tests.test_api --verbosity=2
```

### Backend Security Tests (38 tests)

Tests that every protected endpoint correctly enforces:
- Authentication (unauthenticated requests are rejected with 401)
- Role-based access control (wrong-role requests are rejected with 403)
- Cross-user data isolation (users cannot access other users' data)
- Token validation (expired or tampered tokens are rejected)

```bash
cd backend
python manage.py test tests.test_security --verbosity=2
```

### Blockchain Tests — Python (10 tests)

Tests the Django blockchain service layer (`api/blockchain.py`) including contract ABI loading, address validation, gas estimation, and event emission. These tests run without a live network connection.

```bash
cd backend
python manage.py test tests.test_blockchain --verbosity=2
```

### Blockchain Tests — JavaScript (4 tests)

Tests the Solidity contract directly using Truffle's test runner. Verifies contract deployment, function calls, and event emission against a local Ganache instance.

```bash
cd blockchain
truffle test
```

### System E2E Tests — Cypress (22 tests)

Simulates complete user journeys through a real browser. Covers the full workflow from registration through to aid distribution for all 5 roles. Requires the frontend running on `localhost:3000`.

Terminal 1:
```bash
cd frontend && npm start
```

Terminal 2:
```bash
cd frontend
npm run cypress:system
```

### Security E2E Tests — Cypress (23 tests)

Simulates browser-level security attacks: attempting to access protected routes without login, accessing other users' data, and bypassing role restrictions through direct URL navigation.

```bash
cd frontend
npm run cypress:security
```

### Run All Tests at Once

```bash
# All Jest tests (unit + integration + component)
cd frontend && npm run test:all

# All Django tests (unit + integration + security + blockchain)
cd backend && python manage.py test tests --verbosity=2
```

### Test Summary

| Test Type | File | Count |
|---|---|---|
| Unit (JS) | `frontend/src/tests/unit.test.js` | 34 |
| Integration (JS) | `frontend/src/tests/integration.test.js` | 25 |
| Component Render | `frontend/src/tests/` | 39 |
| System E2E | `frontend/cypress/e2e/system.cy.js` | 22 |
| Security E2E | `frontend/cypress/e2e/security.cy.js` | 23 |
| Backend Integration | `backend/tests/test_api.py` | 13 |
| Backend Security | `backend/tests/test_security.py` | 38 |
| Blockchain (Python) | `backend/tests/test_blockchain.py` | 10 |
| Blockchain (JS) | `blockchain/test/AidTrace.test.js` | 4 |
| **Total** | | **208** |

---

## Project Structure

```
aidtrace_project/
├── backend/
│   ├── api/
│   │   ├── models.py              # 15 Django models (User, Project, Beneficiary, Quote, AidRecord, etc.)
│   │   ├── views.py               # Role-based API views for all 5 roles
│   │   ├── auth.py                # JWT HS256 login, registration, token refresh
│   │   ├── blockchain.py          # Web3.py service — writes events to the smart contract
│   │   ├── blockchain_verify.py   # Read-only endpoints for verifying on-chain records
│   │   ├── quote_views.py         # NGO-side quote request and selection logic
│   │   ├── supplier_quote_views.py # Supplier-side bid submission logic
│   │   ├── bulk_beneficiary.py    # CSV bulk import for beneficiary registration
│   │   ├── otp_service.py         # Twilio SMS OTP generation and verification
│   │   ├── serializers.py         # DRF serializers for all models
│   │   ├── urls.py                # 50+ URL patterns mapped to views
│   │   ├── validators/            # Custom field validators (wallet address, phone, etc.)
│   │   └── services/              # Business logic services (face descriptor storage, etc.)
│   ├── tests/
│   │   ├── test_api.py            # Backend unit + integration tests
│   │   ├── test_security.py       # RBAC and authentication security tests
│   │   └── test_blockchain.py     # Blockchain service layer tests
│   ├── aidtrace/
│   │   └── settings.py            # Django settings (DB, JWT, CORS, email, Twilio)
│   ├── .env.example               # Template for required environment variables
│   └── requirements.txt           # All Python dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/                 # One page component per role dashboard + auth pages
│   │   ├── components/            # Shared UI components (modals, tables, nav)
│   │   ├── services/api.js        # Axios API client with 7 service modules
│   │   ├── utils/validation.js    # Pure validation functions (used in unit tests)
│   │   ├── config/                # Contract ABI and blockchain config
│   │   ├── translations.js        # Arabic / English string translations
│   │   └── tests/                 # Jest unit, integration, and component test suites
│   └── cypress/
│       └── e2e/                   # Cypress system and security E2E test specs
├── blockchain/
│   ├── contracts/AidTrace.sol     # Solidity 0.8.19 smart contract
│   ├── migrations/                # Truffle migration scripts (1_deploy, 2_deploy)
│   ├── test/AidTrace.test.js      # Truffle JavaScript contract tests
│   ├── truffle-config.js          # Network config for development (Ganache) and Sepolia
│   └── .env                       # MNEMONIC, ALCHEMY_API_KEY, ETHERSCAN_API_KEY
└── .github/
    └── workflows/
        └── main_aidtrace98ss.yml  # GitHub Actions CI/CD pipeline for Azure deployment
```

---

## Deployment

| Component | Platform | Region | URL |
|---|---|---|---|
| Frontend | Vercel | Global CDN | https://aidtrace-southsudan.vercel.app |
| Backend | Azure App Service | South Africa North | https://aidtrace98ss-gzchbveebkf3ahfc.southafricanorth-01.azurewebsites.net |
| Database | Azure PostgreSQL Flexible Server | South Africa North | Private — accessed by backend only |
| Blockchain | Ethereum Sepolia Testnet via Alchemy | Decentralised | Chain ID: 11155111 |

### Deploy Frontend to Vercel

Vercel auto-deploys on every push to the `main` branch. To trigger a manual build:

```bash
cd frontend
npm run build
git push origin main
```

Set the following environment variable in the Vercel dashboard:
```
REACT_APP_API_URL=https://aidtrace98ss-gzchbveebkf3ahfc.southafricanorth-01.azurewebsites.net/api
```

### Deploy Backend to Azure

The backend deploys automatically via GitHub Actions on push to `main`. The workflow file is at `.github/workflows/main_aidtrace98ss.yml`.

To deploy manually:
```bash
cd backend
# Ensure all environment variables are set in Azure App Service Configuration
# Azure pulls from GitHub and runs startup.sh which runs migrations and starts gunicorn
```

---

## Security Notes

- Never commit `.env` files. All three (backend, frontend, blockchain) are in `.gitignore`.
- The `blockchain/.env` file contains a wallet mnemonic. Anyone with this mnemonic controls the deployer wallet. Rotate it if it has ever been exposed.
- `BLOCKCHAIN_PRIVATE_KEY` in `backend/.env` is used by the Django backend to sign on-chain transactions. Use a dedicated wallet with only enough ETH for gas — never a personal wallet.
- `SECRET_KEY` in `backend/.env` is used to sign JWT tokens. If compromised, all active sessions are invalidated by rotating it.
- In production, set `DEBUG=False` in `backend/.env` to prevent Django from exposing stack traces.

---

## License

MIT License — see LICENSE file for details.
