import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, UserPlus, LogOut, FileText } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import { authAPI } from '../services/api';
import Modal from './Modal';
import Button from './Button';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const isSuperAdmin = user?.role === 'superadmin';

  const adminLinks = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/leads', icon: <Users size={20} />, label: 'My Leads' },
    { to: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const superAdminLinks = [
    { to: '/superadmin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/superadmin/admins', icon: <UserPlus size={20} />, label: 'Manage Admins' },
    { to: '/superadmin/reports', icon: <FileText size={20} />, label: 'Reports' },
  ];

  const links = isSuperAdmin ? superAdminLinks : adminLinks;

  const handleLogout = async () => {
    try {
      if (!isSuperAdmin) {
        await authAPI.logout();
      }
    } catch (error) {
       console.error("Logout error", error);
    } finally {
      dispatch(logout());
      setShowLogoutModal(false);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col fixed left-0 top-0 shadow-sm z-10">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
          L
        </div>
        <span className="font-bold text-lg text-gray-800 tracking-tight">LeadMaster</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
          Menu
        </div>
        
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer / User info */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || 'Super Admin'}</p>
            <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Confirm Logout">
        <div className="flex flex-col gap-4">
          <p className="text-gray-600">Are you sure you want to log out of your account?</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
