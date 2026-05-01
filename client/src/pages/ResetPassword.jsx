import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const ResetPassword = () => {
  const { token } = useParams(); // Captured from URL: /reset-password/:token
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

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
      await authAPI.resetPassword({ 
        token, 
        password: formData.password, 
        confirmPassword: formData.confirmPassword 
      });
      
      toast.success('Password successfully reset! You can now log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-auth flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
           <FormInput
            label="New Password"
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          <FormInput
            label="Confirm New Password"
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button type="submit" loading={loading} className="w-full mt-2">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
