/**
 * Frontend Unit Tests
 * Tests core React components and utilities
 * Run with: npm test
 */
import { render } from '@testing-library/react';
import App from '../App';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

describe('App Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  test('renders without crashing', () => {
    render(<App />);
  });

  test('sets theme on body', () => {
    localStorageMock.getItem.mockReturnValue('light');
    render(<App />);
    expect(document.body.className).toContain('mode');
  });

  test('handles localStorage for language', () => {
    localStorageMock.getItem.mockReturnValue('en');
    render(<App />);
    expect(document.body.dir).toBe('ltr');
  });
});

describe('API Service', () => {
  test('api module exports correctly', () => {
    const api = require('../services/api');
    expect(api.authAPI).toBeDefined();
    expect(api.publicAPI).toBeDefined();
    expect(api.ngoAPI).toBeDefined();
    expect(api.donorAPI).toBeDefined();
    expect(api.supplierAPI).toBeDefined();
    expect(api.fieldOfficerAPI).toBeDefined();
    expect(api.adminAPI).toBeDefined();
  });

  test('authAPI has required methods', () => {
    const { authAPI } = require('../services/api');
    expect(typeof authAPI.register).toBe('function');
    expect(typeof authAPI.login).toBe('function');
  });

  test('publicAPI has required methods', () => {
    const { publicAPI } = require('../services/api');
    expect(typeof publicAPI.submitReport).toBe('function');
    expect(typeof publicAPI.getReports).toBe('function');
  });
});
