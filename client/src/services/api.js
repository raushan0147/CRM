import axios from 'axios';
import { store } from '../reducer/store';
import { logout } from '../slices/authSlice';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
  withCredentials: true,
  timeout: 15000,
});

// ─── Request Interceptor: attach JWT ─────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: handle 401 ─────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

// ─── Auth APIs ─────────────────────────────────────────────────────────────
export const authAPI = {
  sendOTP: (email) => api.post('/auth/send-otp', { email }),
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// ─── Lead APIs ─────────────────────────────────────────────────────────────
export const leadsAPI = {
  // Public: submit a lead form (no auth)
  submitLeadForm: (data) => api.post('/leads/public', data),
  // Admin: get all leads
  getAllLeads: () => api.get('/leads'),
  // Admin: create lead
  createLead: (data) => api.post('/leads/create', data),
  // Admin: update lead
  updateLead: (id, data) => api.put(`/leads/${id}`, data),
  // Admin: delete lead
  deleteLead: (id) => api.delete(`/leads/${id}`),
  // Admin: update status
  updateLeadStatus: (id, status) => api.put(`/leads/${id}/status`, { status }),
  // Super Admin: get all leads
  getAllLeadsSuperAdmin: () => api.get('/leads/all'),
};

// ─── Admin APIs ─────────────────────────────────────────────────────────────
export const adminAPI = {
  getAllAdmins: () => api.get('/superAdmin/admins'),
  approveAdmin: (id) => api.put(`/superAdmin/approve/${id}`),
  deactivateAdmin: (id) => api.put(`/superAdmin/deactivate/${id}`),
  activateAdmin: (id) => api.put(`/superAdmin/activate/${id}`),
};

// ─── Notifications APIs ─────────────────────────────────────────────────────
export const notificationsAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId = null) => api.put('/notifications/read', { notificationId }),
};

export default api;
