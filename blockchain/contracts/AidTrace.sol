// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AidTrace {
    struct NGO {
        uint256 id;
        address wallet;
        string name;
        string licenseNumber;
        bool isRegistered;
    }
    
    struct Project {
        uint256 id;
        string title;
        string description;
        string location;
        string items;
        uint256 fundingGoal;
        address ngoWallet;
        uint256 timestamp;
    }
    
    struct Funding {
        uint256 projectId;
        address donorWallet;
        address ngoWallet;
        uint256 amount;
        uint256 timestamp;
    }
    
    struct SupplyQuoteRequest {
        uint256 projectId;
        string projectTitle;
        string location;
        string items;
        string deliveryDate;
        address ngoWallet;
        uint256 timestamp;
    }
    
    struct SupplierQuote {
        uint256 quoteRequestId;
        uint256 projectId;
        address supplierAddress;
        uint256 quotedAmount;
        string deliveryTerms;
        string signature;
        uint256 timestamp;
    }
    
    struct QuoteSelection {
        uint256 quoteId;
        uint256 projectId;
        address ngoWallet;
        address selectedSupplier;
        uint256 selectedAmount;
        string ngoSignature;
        uint256 timestamp;
    }
    
    struct SupplierConfirmation {
        uint256 projectId;
        string projectTitle;
        string deliveryLocation;
        address supplierAddress;
        string signature;
        uint256 timestamp;
    }
    
    struct FieldOfficerConfirmation {
        uint256 projectId;
        string projectTitle;
        string projectLocation;
        address officerAddress;
        string signature;
        uint256 timestamp;
    }
    
    struct FundingConfirmation {
        uint256 projectId;
        uint256 fundingId;
        string ngoSignature;
        string donorSignature;
        uint256 timestamp;
    }
    
    mapping(uint256 => NGO) public ngos;
    mapping(bytes32 => FundingConfirmation) public fundingConfirmations;
    mapping(uint256 => Project) public projects;
    mapping(bytes32 => Funding) public fundings;
    mapping(uint256 => SupplyQuoteRequest) public quoteRequests;
    mapping(uint256 => SupplierQuote) public supplierQuotes;
    mapping(uint256 => QuoteSelection) public quoteSelections;
    mapping(bytes32 => SupplierConfirmation) public supplierConfirmations;
    mapping(bytes32 => FieldOfficerConfirmation) public fieldOfficerConfirmations;
    
    uint256 public quoteRequestCounter;
    uint256 public supplierQuoteCounter;
    uint256 public quoteSelectionCounter;
    
    event NGOLinked(uint256 indexed ngoId, address wallet, string name);
    event ProjectCreated(uint256 indexed projectId, string title, address ngoWallet);
    event FundingRecorded(uint256 indexed projectId, address donor, address ngo, uint256 amount);
    event FundingConfirmed(uint256 indexed projectId, uint256 fundingId, string ngoSignature);
    event QuoteRequestCreated(uint256 indexed requestId, uint256 projectId, address ngo);
    event SupplierQuoteSubmitted(uint256 indexed quoteId, uint256 requestId, address supplier, uint256 amount);
    event QuoteSelected(uint256 indexed selectionId, uint256 quoteId, address ngo, address supplier);
    event SupplierConfirmed(uint256 indexed projectId, address supplier);
    event FieldOfficerConfirmed(uint256 indexed projectId, address officer);
    
    function linkNGOWallet(
        uint256 _ngoId,
        address _wallet,
        string memory _name,
        string memory _licenseNumber
    ) public {
        ngos[_ngoId] = NGO({
            id: _ngoId,
            wallet: _wallet,
            name: _name,
            licenseNumber: _licenseNumber,
            isRegistered: true
        });
        
        emit NGOLinked(_ngoId, _wallet, _name);
    }
    
    function createProject(
        uint256 _projectId,
        string memory _title,
        string memory _description,
        string memory _location,
        string memory _items,
        uint256 _fundingGoal
    ) public {
        projects[_projectId] = Project({
            id: _projectId,
            title: _title,
            description: _description,
            location: _location,
            items: _items,
            fundingGoal: _fundingGoal,
            ngoWallet: msg.sender,
            timestamp: block.timestamp
        });
        
        emit ProjectCreated(_projectId, _title, msg.sender);
    }
    
    function recordFunding(
        uint256 _projectId,
        address _donorWallet,
        address _ngoWallet,
        uint256 _amount
    ) public {
        bytes32 fundingHash = keccak256(abi.encodePacked(_projectId, _donorWallet, _ngoWallet, block.timestamp));
        
        fundings[fundingHash] = Funding({
            projectId: _projectId,
            donorWallet: _donorWallet,
            ngoWallet: _ngoWallet,
            amount: _amount,
            timestamp: block.timestamp
        });
        
        emit FundingRecorded(_projectId, _donorWallet, _ngoWallet, _amount);
    }
    
    function confirmFunding(
        uint256 _projectId,
        uint256 _fundingId,
        string memory _ngoSignature,
        string memory _donorSignature
    ) public {
        bytes32 confirmationHash = keccak256(abi.encodePacked(_projectId, _fundingId, block.timestamp));
        
        fundingConfirmations[confirmationHash] = FundingConfirmation({
            projectId: _projectId,
            fundingId: _fundingId,
            ngoSignature: _ngoSignature,
            donorSignature: _donorSignature,
            timestamp: block.timestamp
        });
        
        emit FundingConfirmed(_projectId, _fundingId, _ngoSignature);
    }
    
    function createQuoteRequest(
        uint256 _projectId,
        string memory _projectTitle,
        string memory _location,
        string memory _items,
        string memory _deliveryDate
    ) public {
        quoteRequestCounter++;
        
        quoteRequests[quoteRequestCounter] = SupplyQuoteRequest({
            projectId: _projectId,
            projectTitle: _projectTitle,
            location: _location,
            items: _items,
            deliveryDate: _deliveryDate,
            ngoWallet: msg.sender,
            timestamp: block.timestamp
        });
        
        emit QuoteRequestCreated(quoteRequestCounter, _projectId, msg.sender);
    }
    
    function submitSupplierQuote(
        uint256 _quoteRequestId,
        uint256 _projectId,
        uint256 _quotedAmount,
        string memory _deliveryTerms,
        string memory _signature
    ) public {
        supplierQuoteCounter++;
        
        supplierQuotes[supplierQuoteCounter] = SupplierQuote({
            quoteRequestId: _quoteRequestId,
            projectId: _projectId,
            supplierAddress: msg.sender,
            quotedAmount: _quotedAmount,
            deliveryTerms: _deliveryTerms,
            signature: _signature,
            timestamp: block.timestamp
        });
        
        emit SupplierQuoteSubmitted(supplierQuoteCounter, _quoteRequestId, msg.sender, _quotedAmount);
    }
    
    function selectQuote(
        uint256 _quoteId,
        uint256 _projectId,
        address _selectedSupplier,
        uint256 _selectedAmount,
        string memory _ngoSignature
    ) public {
        quoteSelectionCounter++;
        
        quoteSelections[quoteSelectionCounter] = QuoteSelection({
            quoteId: _quoteId,
            projectId: _projectId,
            ngoWallet: msg.sender,
            selectedSupplier: _selectedSupplier,
            selectedAmount: _selectedAmount,
            ngoSignature: _ngoSignature,
            timestamp: block.timestamp
        });
        
        emit QuoteSelected(quoteSelectionCounter, _quoteId, msg.sender, _selectedSupplier);
    }
    
    function recordSupplierConfirmation(
        uint256 _projectId,
        string memory _projectTitle,
        string memory _deliveryLocation,
        address _supplierAddress,
        string memory _signature
    ) public {
        bytes32 confirmationHash = keccak256(abi.encodePacked(_projectId, _supplierAddress, block.timestamp));
        
        supplierConfirmations[confirmationHash] = SupplierConfirmation({
            projectId: _projectId,
            projectTitle: _projectTitle,
            deliveryLocation: _deliveryLocation,
            supplierAddress: _supplierAddress,
            signature: _signature,
            timestamp: block.timestamp
        });
        
        emit SupplierConfirmed(_projectId, _supplierAddress);
    }
    
    function recordFieldOfficerConfirmation(
        uint256 _projectId,
        string memory _projectTitle,
        string memory _projectLocation,
        address _officerAddress,
        string memory _signature
    ) public {
        bytes32 confirmationHash = keccak256(abi.encodePacked(_projectId, _officerAddress, block.timestamp));
        
        fieldOfficerConfirmations[confirmationHash] = FieldOfficerConfirmation({
            projectId: _projectId,
            projectTitle: _projectTitle,
            projectLocation: _projectLocation,
            officerAddress: _officerAddress,
            signature: _signature,
            timestamp: block.timestamp
        });
        
        emit FieldOfficerConfirmed(_projectId, _officerAddress);
    }
}