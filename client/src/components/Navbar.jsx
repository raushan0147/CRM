import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Bell, Check } from 'lucide-react';
import { notificationsAPI } from '../services/api';

const Navbar = ({ title = "Dashboard" }) => {
  const { user } = useSelector(state => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationsAPI.getNotifications();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id = null) => {
    try {
      await notificationsAPI.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
      <h1 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h1>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex relative">
          <input 
            type="text" 
            placeholder="Search leads..." 
            className="bg-gray-50 border border-gray-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-colors w-64"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full focus:outline-none"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-card border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all animate-fade-in">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                    <button onClick={() => handleMarkAsRead()} className="text-xs text-primary-600 hover:text-primary-700 font-medium">Mark all read</button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500">You're all caught up!</div>
                ) : (
                    notifications.map(n => (
                        <div key={n._id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                                    <span className="text-[10px] text-gray-400 mt-2 block">{new Date(n.createdAt).toLocaleTimeString()}</span>
                                </div>
                                {!n.isRead && (
                                    <button onClick={() => handleMarkAsRead(n._id)} className="text-primary-500 hover:bg-primary-100 p-1 rounded-md transition-colors" title="Mark read">
                                        <Check size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
           <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name || 'Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
