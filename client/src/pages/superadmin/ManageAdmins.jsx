import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data } = await adminAPI.getAllAdmins();
      setAdmins(data.admins || []);
    } catch (error) {
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const { data } = await adminAPI.approveAdmin(id);
      setAdmins(admins.map(a => a._id === id ? data.admin : a));
      toast.success('Admin Approved');
    } catch (error) {
       toast.error(error.response?.data?.message || 'Failed to approve');
    }
  };

  const handleDeactivate = async (id) => {
     try {
      const { data } = await adminAPI.deactivateAdmin(id);
      setAdmins(admins.map(a => a._id === id ? data.admin : a));
      toast.error('Admin Rejected/Deactivated');
    } catch (error) {
       toast.error(error.response?.data?.message || 'Failed to reject');
    }
  };

  const handleActivate = async (id) => {
     try {
      const { data } = await adminAPI.activateAdmin(id);
      setAdmins(admins.map(a => a._id === id ? data.admin : a));
      toast.success('Admin Activated');
    } catch (error) {
       toast.error(error.response?.data?.message || 'Failed to activate');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name', render: (row) => <span className="font-semibold text-gray-800">{row.name}</span> },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Status', 
      render: (row) => {
        if (!row.isApproved) return <span className="badge-pending">Pending Approval</span>;
        if (!row.isActive) return <span className="bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">Rejected / Inactive</span>;
        return <span className="badge-approved">Approved & Active</span>;
      }
    },
    { 
      header: 'Actions', 
      render: (row) => (
        <div className="flex gap-2">
          {!row.isApproved ? (
            <Button variant="success" className="px-3 py-1.5 text-xs rounded-lg shadow-none h-auto" onClick={() => handleApprove(row._id)}>
              Approve
            </Button>
          ) : (
             row.isActive ? (
                <Button variant="danger" className="px-3 py-1.5 text-xs rounded-lg shadow-none h-auto bg-red-500 hover:bg-red-600" onClick={() => handleDeactivate(row._id)}>
                  Reject
                </Button>
             ) : (
                <Button variant="success" className="px-3 py-1.5 text-xs rounded-lg shadow-none h-auto" onClick={() => handleActivate(row._id)}>
                  Activate
                </Button>
             )
          )}
        </div>
      ) 
    }
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Manage Admins</h2>
        <p className="text-gray-500 mt-1">Approve, reject or deactivate admin access across the system.</p>
      </div>

      {loading ? <Spinner /> : (
        <Table columns={columns} data={admins} emptyMessage="No admins found." />
      )}
    </div>
  );
};

export default ManageAdmins;
