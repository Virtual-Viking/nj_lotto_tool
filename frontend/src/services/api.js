import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Tickets API
export const ticketsAPI = {
  getTickets: () => api.get('/tickets'),
  updateTickets: (data) => api.post('/tickets', data),
  getTicketStates: () => api.get('/tickets/state'),
  updateTicketStates: (data) => api.put('/tickets/state', data),
};

// Employees API
export const employeesAPI = {
  getEmployees: () => api.get('/employees'),
  addEmployee: (data) => api.post('/employees', data),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
};

// Reports API
export const reportsAPI = {
  getReports: (params) => api.get('/reports', { params }),
  getReport: (id) => api.get(`/reports/${id}`),
  createReport: (data) => api.post('/reports', data),
  updateReport: (id, data) => api.put(`/reports/${id}`, data),
  deleteReport: (id) => api.delete(`/reports/${id}`),
};

// Backups API
export const backupsAPI = {
  getBackups: (params) => api.get('/backups', { params }),
  createBackup: () => api.post('/backups/create'),
  downloadBackup: (id) => api.get(`/backups/${id}/download`),
};

// Summaries API
export const summariesAPI = {
  getDailySummary: (date) => api.get('/summaries/daily', { params: { date } }),
  getWeeklySummary: (startDate, endDate) => api.get('/summaries/weekly', { params: { startDate, endDate } }),
  getMonthlySummary: (year, month) => api.get('/summaries/monthly', { params: { year, month } }),
  getCustomSummary: (startDate, endDate) => api.get('/summaries/custom', { params: { startDate, endDate } }),
};

export default api;

