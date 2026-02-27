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
    
    mapping(uint256 => NGO) public ngos;
    mapping(uint256 => Project) public projects;
    mapping(bytes32 => Funding) public fundings;
    mapping(bytes32 => SupplierConfirmation) public supplierConfirmations;
    mapping(bytes32 => FieldOfficerConfirmation) public fieldOfficerConfirmations;
    
    event NGOLinked(uint256 indexed ngoId, address wallet, string name);
    event ProjectCreated(uint256 indexed projectId, string title, address ngoWallet);
    event FundingRecorded(uint256 indexed projectId, address donor, address ngo, uint256 amount);
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