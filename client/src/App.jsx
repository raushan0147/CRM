import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts & Guards
import { ProtectedRoute, PublicRoute, RoleRoute } from './utils/routeGuards';
import AdminLayout from './pages/admin/AdminLayout';
import SuperAdminLayout from './pages/superadmin/SuperAdminLayout';

// Public Pages
import LeadForm from './pages/LeadForm';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyOtp from './pages/VerifyOtp';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminLeads from './pages/admin/LeadsList';
import AdminSettings from './pages/admin/Settings';

// Super Admin Pages
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import ManageAdmins from './pages/superadmin/ManageAdmins';
import Reports from './pages/superadmin/Reports';

const App = () => {
  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      
      <Routes>
        {/* Make Lead Form the default landing page */}
        <Route path="/" element={<LeadForm />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Super Admin Routes */}
        <Route 
          path="/superadmin" 
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['superadmin']}>
                <SuperAdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="admins" element={<ManageAdmins />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
