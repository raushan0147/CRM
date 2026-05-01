import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('crm_user')) || null,
  token: localStorage.getItem('crm_token') || null,
  isApproved: JSON.parse(localStorage.getItem('crm_user'))?.isApproved || false,
  otpVerified: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state, action) {
      state.loading = action.payload;
    },
    loginSuccess(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isApproved = user?.isApproved ?? true;
      state.error = null;
      localStorage.setItem('crm_token', token);
      localStorage.setItem('crm_user', JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isApproved = false;
      state.otpVerified = false;
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
    },
    setOtpVerified(state, action) {
      state.otpVerified = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    // For superadmin (no user object from backend, just role)
    setSuperAdminSession(state, action) {
      const { token } = action.payload;
      state.user = { role: 'superadmin', name: 'Super Admin', email: '' };
      state.token = token;
      state.isApproved = true;
      localStorage.setItem('crm_token', token);
      localStorage.setItem('crm_user', JSON.stringify(state.user));
    },
  },
});

export const {
  setAuthLoading,
  loginSuccess,
  logout,
  setOtpVerified,
  setError,
  setSuperAdminSession,
} = authSlice.actions;

export default authSlice.reducer;
