import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

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
  createProject: (data) => api.post('/ngo/projects/', data),
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
  getBeneficiaries: (projectId) => api.get('/field-officer/beneficiary/all/', { params: { project_id: projectId } }),
};

export const donorAPI = {
  getProjects: () => api.get('/donor/projects/'),
  getFundedProjects: () => api.get('/donor/funded-projects/'),
  fundProject: (data) => api.post('/donor/fund-project/', data),
  getProjectDetails: (id) => api.get(`/donor/project/${id}/`),
};

export const supplierAPI = {
  getAssignments: () => api.get('/supplier/assignments/'),
  confirmAssignment: (data) => api.post('/supplier/confirm/', data),
};

export const fieldOfficerAPI = {
  getAssignments: () => api.get('/field-officer/assignments/'),
  confirmAssignment: (data) => api.post('/field-officer/confirm/', data),
  addBeneficiary: (data) => api.post('/field-officer/beneficiary/', data),
  searchBeneficiary: (params) => api.get('/field-officer/beneficiary/search/', { params }),
  getAllBeneficiaries: (params) => api.get('/field-officer/beneficiary/all/', { params }),
  getConfirmedBeneficiaries: (params) => api.get('/field-officer/beneficiary/confirmed/', { params }),
  mockFaceScan: () => api.post('/field-officer/face-scan/'),
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
