import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { leadsAPI } from '../../services/api';
import { setLeads, setLeadsLoading, setLeadsError } from '../../slices/leadSlice';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import { Users, PhoneCall, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { leads, loading, stats } = useSelector(state => state.leads);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    dispatch(setLeadsLoading(true));
    try {
      const { data } = await leadsAPI.getAllLeads();
      dispatch(setLeads(data.leads || []));
    } catch (error) {
      toast.error('Failed to load dashboard data');
      dispatch(setLeadsError(error.message));
    } finally {
      dispatch(setLeadsLoading(false));
    }
  };

  if (loading && leads.length === 0) return <Spinner />;

  const recentLeads = leads
    .filter(lead => filter === 'all' ? true : lead.status === filter)
    .slice(0, 10);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', render: (row) => <a href={`mailto:${row.email}`} className="text-primary-600 hover:underline">{row.email}</a> },
    { header: 'Phone', render: (row) => <a href={`tel:${row.phone}`} className="text-primary-600 hover:underline">{row.phone}</a> },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`badge-${row.status}`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ) 
    },
    { 
      header: 'Date', 
      render: (row) => new Date(row.createdAt).toLocaleDateString() 
    }
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Here's what's happening with your leads today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Total Leads" 
          value={stats.total} 
          icon={<Users size={24} />} 
          bgColor="bg-blue-100" 
          iconColor="text-blue-600"
          onClick={() => setFilter('all')} 
        />
        <Card 
          title="New Leads" 
          value={stats.new} 
          icon={<Clock size={24} />} 
          bgColor="bg-primary-100" 
          iconColor="text-primary-600"
          onClick={() => setFilter('new')} 
        />
        <Card 
          title="Contacted" 
          value={stats.contacted} 
          icon={<PhoneCall size={24} />} 
          bgColor="bg-yellow-100" 
          iconColor="text-yellow-600"
          onClick={() => setFilter('contacted')} 
        />
        <Card 
          title="Converted" 
          value={stats.converted} 
          icon={<CheckCircle size={24} />} 
          bgColor="bg-emerald-100" 
          iconColor="text-emerald-600"
          onClick={() => setFilter('converted')} 
        />
      </div>

      {/* Recent Leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
             {filter === 'all' ? 'Recent Leads' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Leads`}
          </h3>
          {filter !== 'all' && (
             <span onClick={() => setFilter('all')} className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors">Clear Filter</span>
          )}
        </div>
        <Table columns={columns} data={recentLeads} emptyMessage="No recent leads found. Good time to find some!" />
      </div>
    </div>
  );
};

export default Dashboard;
