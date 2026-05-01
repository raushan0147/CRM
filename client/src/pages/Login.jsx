import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authAPI } from '../services/api';
import { loginSuccess, setSuperAdminSession, logout } from '../slices/authSlice';
import toast from 'react-hot-toast';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);

  React.useEffect(() => {
    // Clear the session on load so back-button clears the login
    if (token) {
      dispatch(logout());
    }
    // Wipe form data explicitly on mount in case of browser BFCache
    setFormData({ email: '', password: '' });
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(formData);
      
      if (data.role === 'superadmin') {
        dispatch(setSuperAdminSession({ token: data.token }));
        toast.success('Welcome Super Admin');
        navigate('/superadmin/dashboard');
      } else {
        dispatch(loginSuccess({ user: data.user, token: data.token }));
        toast.success('Login successful');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      setFormData(prev => ({...prev, password: ''}));
      if (error.response?.status === 403 && error.response?.data?.message?.includes("approval")) {
        toast.error('Waiting for Super Admin Approval');
      } else {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-auth flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2 text-sm">Sign in to LeadMaster CRM</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off" className="px-8 pb-8 flex flex-col gap-4">
          <FormInput
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            autoComplete="new-password"
            required
          />
          
          <div className="flex flex-col gap-1.5">
            <FormInput
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
            <div className="flex justify-end mt-1">
              <Link to="/forgot-password" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full mt-2">
            Sign In
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an admin account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Register now
            </Link>
          </p>

          <div className="text-center mt-2 mb-2">
            <Link to="/" className="text-sm font-semibold text-gray-400 hover:text-gray-800 transition-colors flex items-center justify-center gap-1">
              &larr; Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
