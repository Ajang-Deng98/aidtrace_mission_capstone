# AidTrace - Blockchain-Powered Aid Distribution Platform

A transparent, secure platform for tracking humanitarian aid from donors to beneficiaries using blockchain technology.

## Features

- **Multi-Role Dashboard System**: NGO, Donor, Supplier, Field Officer, Admin
- **Blockchain Integration**: Ethereum-based smart contracts for transparency
- **Real-Time Tracking**: Track aid distribution from funding to delivery
- **Supplier Quote System**: Competitive bidding for aid supplies
- **Document Management**: Upload and download project documents
- **Email Notifications**: Password reset and system notifications
- **Face Recognition**: Beneficiary verification (planned)

## Tech Stack

**Frontend:**
- React.js
- Tailwind CSS (OHCHR-style design)
- Web3.js for blockchain interaction

**Backend:**
- Django REST Framework
- PostgreSQL database
- JWT authentication

**Blockchain:**
- Solidity smart contracts
- Truffle framework
- Sepolia testnet / Local Ganache

## Quick Start

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- PostgreSQL
- Ganache (for local blockchain)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd aidtrace_project
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

4. **Blockchain Setup**
```bash
cd blockchain
npm install
truffle migrate --network development
```

## Environment Variables

Create `.env` files in `backend/` and `blockchain/` directories:

**backend/.env:**
```
DB_NAME=aidtrace_db
DB_USER=postgres
DB_PASSWORD=your_password
BLOCKCHAIN_NETWORK=sepolia
SEPOLIA_CONTRACT_ADDRESS=your_contract_address
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
```

**blockchain/.env:**
```
ALCHEMY_API_KEY=your_alchemy_key
MNEMONIC=your_wallet_mnemonic
BLOCKCHAIN_PRIVATE_KEY=your_private_key
```

## User Roles

- **NGO**: Create projects, request quotes, manage funding
- **Donor**: Fund projects, track donations
- **Supplier**: Submit quotes, deliver supplies
- **Field Officer**: Verify deliveries, confirm distributions
- **Admin**: Approve users and projects

## Project Structure

```
aidtrace_project/
├── backend/          # Django REST API
├── frontend/         # React application
├── blockchain/       # Smart contracts
└── README.md
```

## License

MIT License

## Contact

For questions or support, contact the development team.
