import React, { useEffect, useState } from 'react';
import { leadsAPI } from '../../services/api';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import { Users, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data } = await leadsAPI.getAllLeadsSuperAdmin();
      setLeads(data.leads || []);
    } catch (error) {
      toast.error('Failed to load SuperAdmin dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  const stats = {
    total: leads.length,
    converted: leads.filter(l => l.status === 'converted').length,
    pending: leads.filter(l => l.status === 'new').length, 
  };

  const filteredLeads = leads.filter(lead => {
    if (filter === 'all') return true;
    if (filter === 'pending') return lead.status === 'new';
    return lead.status === filter;
  });

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
    { header: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    { 
      header: 'Actions', 
      render: () => <span className="text-gray-400 italic text-sm">View Only</span> 
    }
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Super Admin Dashboard</h2>
        <p className="text-gray-500 mt-1">System overview and all leads across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          title="Total Leads" 
          value={stats.total} 
          icon={<Users size={24} />} 
          bgColor="bg-blue-100" 
          iconColor="text-blue-600"
          onClick={() => setFilter('all')} 
        />
        <Card 
          title="Converted Leads" 
          value={stats.converted} 
          icon={<CheckCircle size={24} />} 
          bgColor="bg-emerald-100" 
          iconColor="text-emerald-600"
          onClick={() => setFilter('converted')} 
        />
        <Card 
          title="Pending Leads" 
          value={stats.pending} 
          icon={<FileText size={24} />} 
          bgColor="bg-yellow-100" 
          iconColor="text-yellow-600"
          onClick={() => setFilter('pending')} 
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {filter === 'all' ? 'All Leads System-wide' : `Filtered Leads: ${filter}`}
          </h3>
          {filter !== 'all' && (
             <span onClick={() => setFilter('all')} className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors">Clear Filter</span>
          )}
        </div>
        <Table columns={columns} data={filteredLeads} emptyMessage="No leads in the system yet." />
      </div>
    </div>
  );
};

export default Dashboard;
