import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setIsSent(true);
      toast.success('Password reset link sent to your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-auth flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-slide-up">
        {!isSent ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Enter your email address to receive a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <FormInput
                label="Email Address"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />

              <Button type="submit" loading={loading} className="w-full">
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
             <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Check Your Email</h2>
            <p className="text-gray-500 mt-2 mb-6 text-sm leading-relaxed">
              We've sent a password reset link to <br/><span className="font-semibold text-gray-800">{email}</span>
            </p>
            <p className="text-sm text-gray-400">
               Click the link in the email to set a new password. You can close this window now.
            </p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link to="/login" className="text-sm font-semibold text-gray-500 hover:text-primary-600 flex items-center justify-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
