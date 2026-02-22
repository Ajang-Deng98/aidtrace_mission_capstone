# AidTrace - Blockchain-Powered Humanitarian Aid Distribution Platform

## Overview

AidTrace is a comprehensive blockchain-based platform designed to ensure transparency and accountability in humanitarian aid distribution. The system tracks aid from donors to beneficiaries, recording every transaction on the Ethereum blockchain for immutable verification.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [User Roles](#user-roles)
- [API Documentation](#api-documentation)
- [Blockchain Integration](#blockchain-integration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Functionality

- **Blockchain Verification**: All transactions permanently recorded on Ethereum blockchain
- **Multi-Role System**: Support for Donors, NGOs, Suppliers, Field Officers, and Administrators
- **Digital Signatures**: Dual-signature verification for funding transactions
- **Real-Time Tracking**: Monitor aid distribution from funding to final delivery
- **Beneficiary Verification**: Multi-step verification including facial recognition and OTP
- **Public Reporting**: Anonymous reporting system for transparency and accountability
- **Immutable Records**: Tamper-proof transaction history on blockchain

### Security Features

- JWT-based authentication
- Role-based access control
- Encrypted data transmission
- Blockchain transaction verification
- OTP verification via Twilio
- Facial recognition for beneficiary identification

## Technology Stack

### Backend
- **Framework**: Django 4.2
- **Database**: PostgreSQL 13+
- **Authentication**: JWT (JSON Web Tokens)
- **SMS Service**: Twilio API
- **Blockchain**: Web3.py for Ethereum integration

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Inline CSS with responsive design

### Blockchain
- **Platform**: Ethereum (Sepolia Testnet / Local Ganache)
- **Smart Contracts**: Solidity
- **Development Framework**: Truffle Suite
- **Web3 Provider**: Infura (for testnet)

## System Architecture

```
aidtrace_project/
├── backend/
│   ├── aidtrace/              # Django project settings
│   │   ├── settings.py        # Configuration
│   │   ├── urls.py            # URL routing
│   │   └── wsgi.py            # WSGI configuration
│   ├── api/                   # Main application
│   │   ├── models.py          # Database models
│   │   ├── views.py           # API endpoints
│   │   ├── serializers.py     # Data serialization
│   │   ├── auth.py            # Authentication logic
│   │   ├── blockchain.py      # Blockchain integration
│   │   ├── otp_service.py     # OTP functionality
│   │   └── migrations/        # Database migrations
│   ├── manage.py              # Django management
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── public/                # Static assets
│   │   ├── index.html
│   │   ├── images1.jpg
│   │   └── images2.jpg
│   ├── src/
│   │   ├── pages/             # React components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── DonorDashboard.js
│   │   │   ├── NGODashboard.js
│   │   │   ├── SupplierDashboard.js
│   │   │   ├── FieldOfficerDashboard.js
│   │   │   └── PublicReport.js
│   │   ├── services/
│   │   │   └── api.js         # API service layer
│   │   ├── config/
│   │   │   └── blockchain.js  # Blockchain configuration
│   │   ├── App.js             # Main application
│   │   └── index.js           # Entry point
│   ├── package.json           # Node dependencies
│   └── .env.example           # Environment template
├── blockchain/
│   ├── contracts/
│   │   ├── AidTrace.sol       # Main smart contract
│   │   └── Migrations.sol     # Truffle migrations
│   ├── migrations/
│   │   └── 2_deploy_contracts.js
│   ├── truffle-config.js      # Truffle configuration
│   ├── package.json
│   └── .env                   # Blockchain credentials
└── README.md
```

## Prerequisites

### Required Software

- **Python**: Version 3.9 or higher
- **Node.js**: Version 16 or higher
- **PostgreSQL**: Version 13 or higher
- **Ganache**: For local blockchain development (optional)
- **MetaMask**: Browser extension for blockchain interactions

### Required Accounts

- **Twilio Account**: For SMS/OTP functionality
- **Infura Account**: For Ethereum testnet access (optional)
- **Ethereum Wallet**: For testnet deployment (optional)

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/Ajang-Deng98/aidtrace_mission_capstone.git
cd aidtrace_mission_capstone
```

### 2. Backend Setup

#### Create Virtual Environment

```bash
cd backend
python -m venv venv
```

#### Activate Virtual Environment

Windows:
```bash
venv\Scripts\activate
```

Linux/Mac:
```bash
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Database Setup

#### Create PostgreSQL Database

```sql
CREATE DATABASE aidtrace_db;
CREATE USER postgres WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE aidtrace_db TO postgres;
```

#### Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create Admin User

```bash
python manage.py create_admin
```

Default credentials:
- Username: admin
- Password: admin123

### 4. Frontend Setup

```bash
cd frontend
npm install
```

### 5. Blockchain Setup

#### Install Truffle Globally

```bash
npm install -g truffle
```

#### Install Blockchain Dependencies

```bash
cd blockchain
npm install
```

#### Deploy Smart Contracts (Local)

1. Start Ganache on port 7545
2. Deploy contracts:

```bash
truffle migrate --reset
```

3. Copy the deployed contract address to `backend/.env`:

```
LOCAL_CONTRACT_ADDRESS=0xYourContractAddress
```

## Configuration

### Backend Environment Variables

Create `backend/.env` file:

```env
# Database Configuration
DB_NAME=aidtrace_db
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432

# Django Secret Keys
SECRET_KEY=your_django_secret_key
JWT_SECRET=your_jwt_secret_key

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Blockchain Configuration
BLOCKCHAIN_NETWORK=development
LOCAL_CONTRACT_ADDRESS=0xYourContractAddress

# For Sepolia Testnet (Optional)
INFURA_PROJECT_ID=your_infura_project_id
SEPOLIA_CONTRACT_ADDRESS=0xYourSepoliaContractAddress
MNEMONIC=your_wallet_mnemonic
BLOCKCHAIN_PRIVATE_KEY=0xYourPrivateKey
```

### Frontend Environment Variables

Create `frontend/.env` file:

```env
REACT_APP_API_URL=http://localhost:8000
```

## Usage

### Starting the Application

#### 1. Start Backend Server

```bash
cd backend
python manage.py runserver
```

Backend will run on: http://localhost:8000

#### 2. Start Frontend Development Server

```bash
cd frontend
npm start
```

Frontend will run on: http://localhost:3000

#### 3. Start Local Blockchain (Optional)

Open Ganache and ensure it's running on port 7545

### Accessing the Application

- **Homepage**: http://localhost:3000
- **Admin Login**: http://localhost:3000/login
- **Registration**: http://localhost:3000/register
- **Public Report**: http://localhost:3000/public-report
- **API Documentation**: http://localhost:8000/api/

## User Roles

### Administrator
- Approve/reject user registrations
- Approve/reject project proposals
- Monitor all system activities
- Manage user accounts
- View system-wide reports

### Donor
- Browse available projects
- Fund projects with digital signatures
- Track funded projects in real-time
- Download funding reports
- View blockchain transaction records

### NGO
- Create and manage projects
- Assign suppliers to projects
- Create and manage field officers
- Assign field officers to projects
- Confirm funding receipts
- Monitor project progress

### Supplier
- View assigned projects
- Confirm item delivery assignments
- Provide digital signatures for deliveries
- Track delivery status

### Field Officer
- View project assignments
- Register beneficiaries with facial recognition
- Distribute aid to verified beneficiaries
- Verify beneficiaries via OTP
- Confirm handover from suppliers
- Track distribution progress

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/register/
Body: {
  "username": "string",
  "email": "string",
  "password": "string",
  "name": "string",
  "role": "DONOR|NGO|SUPPLIER",
  "contact": "string"
}
```

#### Login
```
POST /api/login/
Body: {
  "username": "string",
  "password": "string"
}
Response: {
  "token": "jwt_token",
  "user": {...}
}
```

### Project Endpoints

#### Create Project (NGO)
```
POST /api/ngo/projects/create/
Headers: Authorization: Bearer {token}
Body: {
  "title": "string",
  "description": "string",
  "location": "string",
  "required_items": [{"name": "string", "quantity": number}],
  "budget_amount": number,
  "target_beneficiaries": number
}
```

#### Get All Projects (Donor)
```
GET /api/donor/projects/
Headers: Authorization: Bearer {token}
```

#### Fund Project (Donor)
```
POST /api/donor/fund/
Headers: Authorization: Bearer {token}
Body: {
  "project_id": number,
  "amount": number,
  "signature": "string"
}
```

### Beneficiary Endpoints

#### Register Beneficiary (Field Officer)
```
POST /api/field-officer/beneficiaries/add/
Headers: Authorization: Bearer {token}
Body: {
  "name": "string",
  "phone_number": "string",
  "project_id": number,
  "face_photo": "base64_string"
}
```

#### Send OTP
```
POST /api/field-officer/send-otp/
Headers: Authorization: Bearer {token}
Body: {
  "phone_number": "string"
}
```

#### Verify OTP and Complete Distribution
```
POST /api/field-officer/verify-otp/
Headers: Authorization: Bearer {token}
Body: {
  "phone_number": "string",
  "code": "string",
  "beneficiary_id": number,
  "project_id": number,
  "face_scan_photo": "base64_string"
}
```

### Admin Endpoints

#### Get Pending Users
```
GET /api/admin/users/pending/
Headers: Authorization: Bearer {token}
```

#### Approve User
```
POST /api/admin/users/approve/
Headers: Authorization: Bearer {token}
Body: {
  "user_id": number
}
```

## Blockchain Integration

### Smart Contract Functions

#### Create Project
```solidity
function createProject(
    uint256 projectId,
    string memory title,
    string memory description,
    string memory location
) public
```

#### Record Funding
```solidity
function recordFunding(
    uint256 projectId,
    address donor,
    address ngo,
    uint256 amount
) public
```

#### Link NGO Wallet
```solidity
function linkNGOWallet(
    string memory ngoId,
    address walletAddress,
    string memory name,
    string memory licenseNumber
) public
```

### Blockchain Transaction Flow

1. **Project Creation**: NGO creates project, recorded on blockchain
2. **Funding**: Donor funds project, transaction hash stored
3. **Supplier Assignment**: Supplier confirmation recorded
4. **Field Officer Assignment**: Officer confirmation recorded
5. **Distribution**: Final delivery recorded with beneficiary verification

## Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Smart Contract Tests

```bash
cd blockchain
truffle test
```

### Manual Testing

1. Register as different user roles
2. Create a project as NGO
3. Fund project as Donor
4. Assign supplier and field officer
5. Register beneficiaries
6. Complete distribution with OTP verification
7. Verify blockchain transactions

## Deployment

### Backend Deployment (Production)

1. Update `settings.py`:
```python
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']
```

2. Collect static files:
```bash
python manage.py collectstatic
```

3. Use production WSGI server (Gunicorn):
```bash
gunicorn aidtrace.wsgi:application
```

### Frontend Deployment

1. Build production bundle:
```bash
npm run build
```

2. Deploy `build/` folder to hosting service

### Blockchain Deployment (Sepolia Testnet)

1. Configure `truffle-config.js` with Sepolia network
2. Deploy contracts:
```bash
truffle migrate --network sepolia
```

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Contact

- **Email**: info@aidtrace.org
- **Phone**: +211925851806
- **Location**: Juba, South Sudan
- **GitHub**: https://github.com/Ajang-Deng98/aidtrace_mission_capstone

## Acknowledgments

- Ethereum Foundation for blockchain infrastructure
- Twilio for SMS/OTP services
- Open source community for various libraries and tools
