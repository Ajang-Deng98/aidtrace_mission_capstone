# AidTrace - Aid Distribution Tracking System

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 13+
- Ganache (for local blockchain)

### Backend Setup

1. Create virtual environment:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

2. Configure database in backend/aidtrace/settings.py:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'aidtrace_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

3. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py create_admin  # Creates admin account
```

4. Start backend:
```bash
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start frontend:
```bash
npm start
```

### Blockchain Setup

1. Install Ganache and start local blockchain on port 7545

2. Deploy smart contract:
```bash
cd blockchain
npm install
truffle migrate --reset
```

3. Copy contract address to frontend/src/config/blockchain.js

### Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin credentials: username: admin, password: admin123

## Project Structure

```
aidtrace_project/
├── backend/          # Django backend
├── frontend/         # React frontend
├── blockchain/       # Smart contracts
└── README.md
```
