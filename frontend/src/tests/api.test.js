import { authAPI, adminAPI, ngoAPI, donorAPI, supplierAPI, fieldOfficerAPI, publicAPI } from '../services/api';

describe('API Service', () => {
  test('authAPI is defined', () => {
    expect(authAPI).toBeDefined();
    expect(authAPI.login).toBeDefined();
    expect(authAPI.register).toBeDefined();
  });

  test('adminAPI is defined', () => {
    expect(adminAPI).toBeDefined();
    expect(adminAPI.getUsers).toBeDefined();
    expect(adminAPI.approveUser).toBeDefined();
  });

  test('ngoAPI is defined', () => {
    expect(ngoAPI).toBeDefined();
    expect(ngoAPI.createProject).toBeDefined();
    expect(ngoAPI.getProjects).toBeDefined();
  });

  test('donorAPI is defined', () => {
    expect(donorAPI).toBeDefined();
    expect(donorAPI.getProjects).toBeDefined();
    expect(donorAPI.fundProject).toBeDefined();
  });

  test('supplierAPI is defined', () => {
    expect(supplierAPI).toBeDefined();
    expect(supplierAPI.getQuoteRequests).toBeDefined();
    expect(supplierAPI.submitQuote).toBeDefined();
  });

  test('fieldOfficerAPI is defined', () => {
    expect(fieldOfficerAPI).toBeDefined();
    expect(fieldOfficerAPI.getAssignments).toBeDefined();
    expect(fieldOfficerAPI.addBeneficiary).toBeDefined();
  });

  test('publicAPI is defined', () => {
    expect(publicAPI).toBeDefined();
    expect(publicAPI.submitReport).toBeDefined();
    expect(publicAPI.getReports).toBeDefined();
  });
});
