import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { authAPI } from '../../services/api';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      return toast.error("New passwords do not match");
    }

    setLoading(true);
    try {
      await authAPI.changePassword(formData);
      toast.success("Password changed successfully");
      setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
        <p className="text-gray-500 mt-1">Manage your profile and security preferences.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Profile Information</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">{user?.name || 'Admin'}</p>
              <p className="text-gray-500">{user?.email || 'admin@example.com'}</p>
              <span className="inline-block mt-2 badge-approved capitalize">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Change Password</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
           <FormInput
            label="Current Password"
            id="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
           <FormInput
            label="New Password"
            id="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
           <FormInput
            label="Confirm New Password"
            id="confirmNewPassword"
            type="password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            required
          />
          <div className="pt-2">
            <Button type="submit" loading={loading}>Update Password</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
