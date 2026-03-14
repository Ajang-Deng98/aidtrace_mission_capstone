import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }
    if (!error.response) {
      console.error('Network error - Backend may not be running');
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/register/', data),
  login: (data) => api.post('/login/', data),
};

export const publicAPI = {
  submitReport: (data) => api.post('/public-reports/', data),
  getReports: () => api.get('/public-reports/list/'),
};

export const ngoAPI = {
  createProject: (data) => {
    // If data is FormData, don't set Content-Type (let browser set it with boundary)
    if (data instanceof FormData) {
      return axios.post(`${API_URL}/ngo/projects/`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
    }
    return api.post('/ngo/projects/', data);
  },
  getProjects: () => api.get('/ngo/projects/list/'),
  getDashboard: () => api.get('/ngo/dashboard/'),
  createFieldOfficer: (data) => api.post('/ngo/field-officers/', data),
  getFieldOfficers: () => api.get('/ngo/field-officers/list/'),
  getSuppliers: () => api.get('/ngo/suppliers/'),
  getDonors: () => api.get('/ngo/donors/'),
  assignSupplier: (data) => api.post('/ngo/assign-supplier/', data),
  assignFieldOfficer: (data) => api.post('/ngo/assign-field-officer/', data),
  confirmFunding: (data) => api.post('/ngo/confirm-funding/', data),
  addBeneficiary: (data) => api.post('/field-officer/beneficiary/', data),
  getBeneficiaries: (projectId) => api.get(`/ngo/projects/${projectId}/beneficiaries/`),
  // Quote system endpoints
  createQuoteRequest: (data) => api.post('/ngo/quote-requests/', data),
  getQuoteRequests: () => api.get('/ngo/quote-requests/list/'),
  getQuoteRequestDetails: (id) => api.get(`/ngo/quote-requests/${id}/`),
  selectQuote: (data) => api.post('/ngo/select-quote/', data),
  closeQuoteRequest: (data) => api.post('/ngo/close-quote/', data),
  getProjectWorkflowStatus: (id) => api.get(`/project/${id}/workflow/`),
};

export const donorAPI = {
  getProjects: () => api.get('/donor/projects/'),
  getFundedProjects: () => api.get('/donor/funded-projects/'),
  fundProject: (data) => api.post('/donor/fund-project/', data),
  getProjectDetails: (id) => api.get(`/donor/project/${id}/`),
  getProjectWorkflowStatus: (id) => api.get(`/project/${id}/workflow/`),
};

export const supplierAPI = {
  getAssignments: () => api.get('/supplier/assignments/'),
  confirmAssignment: (data) => api.post('/supplier/confirm/', data),
  // Quote system endpoints
  getQuoteRequests: () => api.get('/supplier/quote-requests/'),
  getQuoteRequestDetails: (id) => api.get(`/supplier/quote-requests/${id}/`),
  submitQuote: (data) => api.post('/supplier/submit-quote/', data),
  getMyQuotes: () => api.get('/supplier/quotes/'),
  confirmDeliveryToFieldOfficer: (data) => api.post('/supplier/confirm-selection/', data),
};

export const fieldOfficerAPI = {
  getAssignments: () => api.get('/field-officer/assignments/'),
  confirmAssignment: (data) => api.post('/field-officer/confirm/', data),
  addBeneficiary: (data) => api.post('/field-officer/beneficiary/', data),
  searchBeneficiary: (params) => api.get('/field-officer/beneficiary/search/', { params }),
  getAllBeneficiaries: (params) => api.get('/field-officer/beneficiary/all/', { params }),
  getConfirmedBeneficiaries: (params) => api.get('/field-officer/beneficiary/confirmed/', { params }),
  mockFaceScan: () => api.post('/field-officer/face-scan/'),
  verifyFace: (data) => api.post('/field-officer/verify-face/', data),
  sendOTP: (data) => api.post('/field-officer/send-otp/', data),
  verifyOTP: (data) => api.post('/field-officer/verify-otp/', data),
  getDistributions: (params) => api.get('/field-officer/distributions/', { params }),
};

export const adminAPI = {
  getUsers: (params) => api.get('/admin/users/', { params }),
  getDashboard: () => api.get('/admin/dashboard/'),
  getProjects: () => api.get('/admin/projects/'),
  getPendingUsers: () => api.get('/admin/pending-users/'),
  approveUser: (data) => api.post('/admin/approve-user/', data),
  rejectUser: (data) => api.post('/admin/reject-user/', data),
  getPendingProjects: () => api.get('/admin/pending-projects/'),
  approveProject: (data) => api.post('/admin/approve-project/', data),
  rejectProject: (data) => api.post('/admin/reject-project/', data),
};

export default api;
