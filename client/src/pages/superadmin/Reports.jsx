import React, { useEffect, useState } from 'react';
import { leadsAPI } from '../../services/api';
import Spinner from '../../components/Spinner';

const Reports = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await leadsAPI.getAllLeadsSuperAdmin();
      setLeads(data.leads || []);
    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  // Simple analytics
  const statuses = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const total = leads.length;

  return (
    <div className="animate-fade-in max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">System Reports</h2>
        <p className="text-gray-500 mt-1">Analytics and breakdown of all leads generated.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
         <h3 className="font-bold text-lg text-gray-800 mb-6">Lead Pipeline Status</h3>
         <div className="space-y-4">
            {['new', 'contacted', 'converted', 'closed'].map(status => {
              const count = statuses[status] || 0;
              const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
              
              const barColors = {
                new: 'bg-blue-500',
                contacted: 'bg-yellow-500',
                converted: 'bg-emerald-500',
                closed: 'bg-gray-500'
              };

              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700 capitalize">{status}</span>
                    <span className="text-gray-500 font-medium">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className={`${barColors[status]} h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
         </div>
      </div>
    </div>
  );
};

export default Reports;
