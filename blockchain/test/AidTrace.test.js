const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('AidTrace Smart Contract - Compilation Tests', () => {
  let contractJson;

  before(() => {
    const contractPath = path.join(__dirname, '../build/contracts/AidTrace.json');
    if (!fs.existsSync(contractPath)) {
      throw new Error('Contract not compiled. Run: truffle compile');
    }
    contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  });

  describe('Contract Compilation', () => {
    it('should compile successfully', () => {
      assert.ok(contractJson, 'Contract JSON should exist');
    });

    it('should have correct contract name', () => {
      assert.strictEqual(contractJson.contractName, 'AidTrace');
    });
  });

  describe('Contract ABI - Functions', () => {
    it('should have linkNGOWallet function', () => {
      const func = contractJson.abi.find(item => item.name === 'linkNGOWallet');
      assert.ok(func, 'linkNGOWallet function should exist');
    });

    it('should have createProject function', () => {
      const func = contractJson.abi.find(item => item.name === 'createProject');
      assert.ok(func, 'createProject function should exist');
    });

    it('should have recordFunding function', () => {
      const func = contractJson.abi.find(item => item.name === 'recordFunding');
      assert.ok(func, 'recordFunding function should exist');
    });

    it('should have submitSupplierQuote function', () => {
      const func = contractJson.abi.find(item => item.name === 'submitSupplierQuote');
      assert.ok(func, 'submitSupplierQuote function should exist');
    });
  });

  describe('Contract ABI - Events', () => {
    it('should have NGOLinked event', () => {
      const event = contractJson.abi.find(item => item.name === 'NGOLinked' && item.type === 'event');
      assert.ok(event, 'NGOLinked event should exist');
    });

    it('should have ProjectCreated event', () => {
      const event = contractJson.abi.find(item => item.name === 'ProjectCreated' && item.type === 'event');
      assert.ok(event, 'ProjectCreated event should exist');
    });

    it('should have FundingRecorded event', () => {
      const event = contractJson.abi.find(item => item.name === 'FundingRecorded' && item.type === 'event');
      assert.ok(event, 'FundingRecorded event should exist');
    });
  });

  describe('Contract Bytecode', () => {
    it('should have valid bytecode', () => {
      assert.ok(contractJson.bytecode, 'Contract should have bytecode');
      assert.ok(contractJson.bytecode.length > 0, 'Bytecode should not be empty');
    });
  });
});
