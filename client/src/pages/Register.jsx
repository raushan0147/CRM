import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import toast from 'react-hot-toast';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);

  React.useEffect(() => {
    if (token) {
      dispatch(logout());
    }
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      // Step 1: Request OTP
      await authAPI.sendOTP(formData.email);
      toast.success('OTP sent to your email!');
      
      // Navigate to OTP verification page and pass form data
      navigate('/verify-otp', { state: { formData, type: 'register' } });
      
    } catch (error) {
       setFormData(prev => ({...prev, password: '', confirmPassword: ''}));
       toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-auth flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Admin Registration</h2>
          <p className="text-gray-500 mt-2 text-sm">Join LeadMaster and manage your leads</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="px-8 pb-8 flex flex-col gap-4">
          <FormInput
            label="Full Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            autoComplete="new-password"
            required
          />
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
           <FormInput
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />

          <Button type="submit" loading={loading} className="w-full mt-4">
            Continue
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Sign In
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

export default Register;
