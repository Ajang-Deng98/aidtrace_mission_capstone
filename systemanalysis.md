# CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN

## 3.1 Introduction

This chapter presents a comprehensive analysis and design of the AidTrace system, a blockchain-powered platform for transparent humanitarian aid distribution in South Sudan. The system addresses critical challenges in aid transparency, accountability, and beneficiary verification through the integration of blockchain technology, facial recognition, and OTP verification.

## 3.2 System Requirements Analysis

### 3.2.1 Functional Requirements

#### User Management
- **FR1**: The system shall support five distinct user roles: Administrator, Donor, NGO, Supplier, and Field Officer
- **FR2**: The system shall require admin approval for all new user registrations
- **FR3**: The system shall provide role-based access control with specific permissions for each user type
- **FR4**: The system shall support multi-language interface (English, Arabic, Dinka, Nuer)

#### Project Management
- **FR5**: NGOs shall be able to create projects with details including title, description, location, budget, duration, and target beneficiaries
- **FR6**: Administrators shall approve or reject project submissions before they become visible to donors
- **FR7**: NGOs shall select exactly two donors who will have visibility to their projects
- **FR8**: The system shall track project status through states: CREATED, PENDING_FUNDING, FUNDED, IN_PROGRESS, COMPLETED

#### Funding and Transactions
- **FR9**: Donors shall provide dual-signature confirmation before releasing funds to projects
- **FR10**: All funding transactions shall be recorded on the Ethereum blockchain
- **FR11**: The system shall generate immutable blockchain transaction hashes for all financial operations
- **FR12**: Donors shall view only projects assigned to them by NGOs

#### Supply Chain Management
- **FR13**: NGOs shall assign items and suppliers to funded projects
- **FR14**: Suppliers shall confirm receipt of assignments with digital signatures
- **FR15**: Suppliers shall deliver items to field officers at specified locations
- **FR16**: All supplier confirmations shall be recorded on the blockchain

#### Beneficiary Management
- **FR17**: Field officers shall register beneficiaries with name, phone number, and facial photograph
- **FR18**: The system shall store facial recognition data for beneficiary verification
- **FR19**: Field officers shall search and select beneficiaries for aid distribution
- **FR20**: The system shall track beneficiary status: registered, verified, confirmed

#### Aid Distribution
- **FR21**: Field officers shall verify beneficiaries through facial recognition scanning
- **FR22**: The system shall send OTP codes to beneficiary phone numbers via Twilio
- **FR23**: Field officers shall verify OTP codes before completing distribution
- **FR24**: All distribution confirmations shall be recorded on the blockchain
- **FR25**: The system shall maintain complete audit trail of all distributions

#### Reporting and Transparency
- **FR26**: The system shall provide public reporting interface for anonymous misconduct reporting
- **FR27**: All stakeholders shall view blockchain transaction proofs for their operations
- **FR28**: The system shall generate analytics and statistics for each user role
- **FR29**: Administrators shall access comprehensive reports on all system activities

### 3.2.2 Non-Functional Requirements

#### Performance
- **NFR1**: The system shall support at least 1000 concurrent users
- **NFR2**: Page load time shall not exceed 3 seconds under normal network conditions
- **NFR3**: Blockchain transaction confirmation shall complete within 2 minutes
- **NFR4**: Database queries shall return results within 2 seconds

#### Security
- **NFR5**: All user passwords shall be hashed using bcrypt with minimum 12 rounds
- **NFR6**: The system shall implement JWT-based authentication with token expiration
- **NFR7**: All API endpoints shall require authentication except public reporting
- **NFR8**: Blockchain private keys shall be stored securely in environment variables
- **NFR9**: The system shall prevent SQL injection and XSS attacks

#### Reliability
- **NFR10**: The system shall maintain 99.5% uptime
- **NFR11**: Blockchain data shall be immutable and tamper-proof
- **NFR12**: The system shall implement automatic backup every 24 hours
- **NFR13**: Transaction failures shall trigger automatic rollback mechanisms

#### Usability
- **NFR14**: The interface shall be intuitive and require minimal training
- **NFR15**: The system shall provide clear error messages and user feedback
- **NFR16**: The system shall be responsive and work on devices with screen sizes from 320px to 2560px
- **NFR17**: Language switching shall occur instantly without page reload

#### Scalability
- **NFR18**: The system architecture shall support horizontal scaling
- **NFR19**: The database shall handle up to 1 million beneficiary records
- **NFR20**: The system shall support addition of new user roles without major refactoring

## 3.3 System Architecture

### 3.3.1 Architectural Pattern

The AidTrace system employs a **three-tier architecture** consisting of:

1. **Presentation Layer**: React-based single-page application (SPA)
2. **Application Layer**: Django REST Framework API server
3. **Data Layer**: PostgreSQL database and Ethereum blockchain

### 3.3.2 Technology Stack

#### Frontend Technologies
- **React 18.2.0**: Component-based UI framework
- **React Router 6.x**: Client-side routing
- **Recharts**: Data visualization library
- **CSS3**: Styling with custom properties for theming

#### Backend Technologies
- **Python 3.10+**: Programming language
- **Django 4.2**: Web framework
- **Django REST Framework**: API development
- **PostgreSQL 14+**: Relational database
- **Twilio API**: SMS and OTP services

#### Blockchain Technologies
- **Ethereum**: Blockchain platform
- **Solidity 0.8.x**: Smart contract language
- **Web3.py**: Python Ethereum library
- **Truffle**: Smart contract development framework
- **Sepolia Testnet**: Testing environment

#### Development Tools
- **Git**: Version control
- **npm/pip**: Package management
- **VS Code**: Development environment

## 3.4 Database Design

### 3.4.1 Key Database Tables

#### User Table
- **id**: Primary key
- **name**: User full name
- **email**: Unique email address
- **password**: Hashed password (bcrypt)
- **role**: ADMIN, DONOR, NGO, SUPPLIER, FIELD_OFFICER
- **contact**: Phone number
- **is_approved**: Boolean approval status
- **created_at**: Registration timestamp

#### Project Table
- **id**: Primary key
- **ngo_id**: Foreign key to User
- **title**: Project title
- **description**: Project description
- **location**: Project location in South Sudan
- **budget_amount**: Required funding amount
- **duration_months**: Project duration
- **target_beneficiaries**: Number of beneficiaries
- **category**: FOOD, HEALTH, EDUCATION, SHELTER, WATER
- **status**: CREATED, PENDING_FUNDING, FUNDED, IN_PROGRESS, COMPLETED
- **is_approved**: Admin approval status
- **created_at**: Creation timestamp

#### Funding Table
- **id**: Primary key
- **project_id**: Foreign key to Project
- **donor_id**: Foreign key to User
- **amount**: Funding amount
- **donor_signature**: Digital signature
- **ngo_signature**: Digital signature
- **blockchain_tx**: Transaction hash
- **created_at**: Funding timestamp

#### Assignment Table
- **id**: Primary key
- **project_id**: Foreign key to Project
- **supplier_id**: Foreign key to User
- **field_officer_id**: Foreign key to User
- **items**: JSON array of items
- **confirmed**: Boolean confirmation status
- **signature**: Digital signature
- **blockchain_tx**: Transaction hash
- **created_at**: Assignment timestamp

#### Beneficiary Table
- **id**: Primary key
- **project_id**: Foreign key to Project
- **name**: Beneficiary name
- **phone_number**: Contact number
- **face_photo**: Base64 encoded image
- **face_verified**: Boolean verification status
- **confirmed**: Boolean distribution status
- **created_at**: Registration timestamp

#### Distribution Table
- **id**: Primary key
- **beneficiary_id**: Foreign key to Beneficiary
- **project_id**: Foreign key to Project
- **field_officer_id**: Foreign key to User
- **face_scan_photo**: Base64 encoded verification image
- **otp_verified**: Boolean OTP verification status
- **blockchain_tx**: Transaction hash
- **created_at**: Distribution timestamp

## 3.5 System Workflows

### 3.5.1 User Registration and Approval
1. User submits registration form with role selection
2. System stores user data with is_approved=False
3. Admin receives notification of pending user
4. Admin reviews user details and approves/rejects
5. User receives notification of approval status
6. Approved users can login and access role-specific dashboard

### 3.5.2 Project Creation and Funding
1. NGO creates project with all required details
2. NGO selects exactly 2 donors for project visibility
3. System stores project with is_approved=False, status=CREATED
4. Admin reviews and approves/rejects project
5. Upon approval, status changes to PENDING_FUNDING
6. Selected donors view project in their dashboard
7. Donor provides dual-signature confirmation
8. System records funding transaction on blockchain
9. Project status changes to FUNDED
10. NGO can now assign suppliers and field officers

### 3.5.3 Supply Chain Management
1. NGO assigns items and supplier to funded project
2. Supplier receives assignment notification
3. Supplier reviews items and project details
4. Supplier confirms assignment with digital signature
5. System records confirmation on blockchain
6. NGO assigns field officer to project
7. Field officer confirms handover from supplier
8. System records handover on blockchain

### 3.5.4 Beneficiary Registration
1. Field officer selects project
2. Field officer enters beneficiary name and phone number
3. Field officer captures beneficiary face photo
4. System stores beneficiary data with face_verified=False
5. Beneficiary is now registered and ready to receive aid

### 3.5.5 Aid Distribution
1. Field officer selects project
2. Field officer searches for beneficiary by name
3. System displays matching beneficiaries
4. Field officer selects beneficiary
5. Field officer captures face scan for verification
6. System verifies face scan against stored photo
7. Field officer sends OTP to beneficiary phone
8. Beneficiary receives OTP via SMS (Twilio)
9. Field officer enters OTP code from beneficiary
10. System verifies OTP code
11. System records distribution on blockchain
12. Beneficiary status updated to confirmed
13. Distribution complete

## 3.6 Smart Contract Design

### 3.6.1 AidTrace Smart Contract Functions

**recordTransaction()**
- Records funding, assignment, and distribution transactions
- Parameters: projectId, from, to, amount, transactionType, signature
- Returns: Transaction ID and hash
- Emits: TransactionRecorded event

**getTransaction()**
- Retrieves transaction details by ID
- Parameters: transactionId
- Returns: All transaction details including timestamp
- Public view function for transparency

### 3.6.2 Transaction Types
- **FUNDING**: Donor to NGO project funding
- **SUPPLIER_CONFIRMATION**: Supplier assignment confirmation
- **FIELD_OFFICER_CONFIRMATION**: Field officer handover confirmation
- **DISTRIBUTION**: Aid distribution to beneficiary

## 3.7 User Interface Design

### 3.7.1 Design Principles
- **Simplicity**: Clean, minimal interface with clear visual hierarchy
- **Consistency**: Uniform design patterns across all dashboards
- **Accessibility**: Multi-language support and responsive design
- **Feedback**: Clear status indicators and error messages
- **Efficiency**: Minimal clicks to complete tasks

### 3.7.2 Color Scheme
- **Primary**: #1CABE2 (Cyan Blue) - Trust and transparency
- **Secondary**: #0891b2 (Dark Cyan) - Depth and reliability
- **Success**: #28a745 (Green) - Completion and approval
- **Warning**: #ffc107 (Amber) - Attention and pending status
- **Danger**: #dc3545 (Red) - Error and rejection
- **Neutral**: #111827, #6b7280, #f9fafb - Text and backgrounds

### 3.7.3 Dashboard Components

#### Admin Dashboard
- User statistics cards (Total, Donors, NGOs, Suppliers, Field Officers)
- Pending user approvals table
- Pending project approvals grid
- User distribution pie chart
- Project status bar chart
- Quick action buttons

#### Donor Dashboard
- Funding statistics (Total Projects, Funded, Pending, Total Donated)
- Available projects grid with fund buttons
- Funded projects list with blockchain proofs
- Profile and settings

#### NGO Dashboard
- Project overview cards
- Create project form with donor selection
- Assign supplier interface
- Assign field officer interface
- Project status tracking

#### Supplier Dashboard
- Assignment statistics (Total, Pending, Confirmed, Success Rate)
- Pending assignments with confirm buttons
- Confirmed assignments list
- Assignment details with blockchain proof
- Delivery history table
- Performance analytics

#### Field Officer Dashboard
- Assignment confirmations
- Beneficiary registration form with face photo upload
- Beneficiary search and selection
- Face scan verification interface
- OTP sending and verification
- Distribution confirmation

## 3.8 Security Design

### 3.8.1 Authentication
- JWT token-based authentication
- Token expiration after 24 hours
- Secure password hashing with bcrypt (12 rounds)
- Role-based access control

### 3.8.2 Authorization
- Each API endpoint checks user role
- Users can only access role-specific features
- Admin approval required for user activation
- Project visibility controlled by NGO donor selection

### 3.8.3 Data Protection
- Parameterized SQL queries prevent injection
- Input validation and sanitization
- XSS prevention through output encoding
- HTTPS encryption in production
- Environment variables for sensitive data

### 3.8.4 Blockchain Security
- Private keys stored in environment variables
- All transactions signed before submission
- Smart contract tested on Sepolia testnet
- Immutable transaction records
- Public verification of all transactions

## 3.9 Integration Design

### 3.9.1 Twilio SMS Integration
- **Purpose**: OTP delivery for beneficiary verification
- **Method**: REST API calls
- **Configuration**: Account SID, Auth Token, Phone Number
- **Flow**: Generate OTP → Send via Twilio → Store in session → Verify user input

### 3.9.2 Ethereum Blockchain Integration
- **Network**: Sepolia Testnet (development), Mainnet (production)
- **Library**: Web3.py
- **Configuration**: Infura Project ID, Private Key, Contract Address
- **Flow**: Prepare transaction → Sign → Submit → Wait for confirmation → Store hash

## 3.10 Testing Strategy

### 3.10.1 Unit Testing
- Test individual API endpoints
- Test database models and queries
- Test smart contract functions
- Test utility functions

### 3.10.2 Integration Testing
- Test API and database integration
- Test blockchain transaction recording
- Test Twilio SMS sending
- Test end-to-end workflows

### 3.10.3 User Acceptance Testing
- Test with users from each role
- Verify all functional requirements
- Test multi-language support
- Test on various devices and browsers

### 3.10.4 Blockchain Testing
- Deploy to Sepolia testnet
- Test all transaction types
- Verify immutability
- Test gas optimization

## 3.11 Deployment Architecture

### 3.11.1 Production Environment
- **Frontend**: React app served by Nginx
- **Backend**: Django with Gunicorn WSGI server
- **Database**: PostgreSQL with regular backups
- **Blockchain**: Ethereum Mainnet via Infura
- **SMS**: Twilio production API

### 3.11.2 Development Environment
- **Frontend**: React development server (port 3000)
- **Backend**: Django development server (port 8000)
- **Database**: Local PostgreSQL instance
- **Blockchain**: Sepolia Testnet via Infura
- **SMS**: Twilio test credentials

## 3.12 Conclusion

This chapter has presented a comprehensive analysis and design of the AidTrace system. The three-tier architecture provides scalability and maintainability, while the blockchain integration ensures transparency and immutability. The database design supports all functional requirements, and the user interface design prioritizes simplicity and accessibility. The security design protects sensitive data and prevents unauthorized access. The system is designed to meet all functional and non-functional requirements while providing a robust foundation for transparent humanitarian aid distribution in South Sudan.
