import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { FiTrash2, FiShield, FiUser } from 'react-icons/fi';

const AdminUsers = () => {
  const { user } = useSelector(s => s.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const headers = { Authorization: `Bearer ${user?.token}` };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users', { headers });
      setUsers(res.data);
    } catch { toast.error('Failed to load users'); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (id === user._id) return toast.error("Can't delete yourself!");
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`/api/users/${id}`, { headers });
    toast.success('User deleted!');
    fetchUsers();
  };

  const toggleAdmin = async (id, isAdmin) => {
    if (id === user._id) return toast.error("Can't change your own role!");
    try {
      await axios.put(`/api/users/${id}`, { isAdmin: !isAdmin }, { headers });
      toast.success(`User ${!isAdmin ? 'made admin' : 'removed from admin'}!`);
      fetchUsers();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-8">Users Management</h1>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name','Email','Role','Joined','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold tracking-widest uppercase text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{u.name}</span>
                      {u._id === user._id && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">You</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${u.isAdmin ? 'bg-gold/10 text-gold' : 'bg-gray-100 text-gray-500'}`}>
                      {u.isAdmin ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggleAdmin(u._id, u.isAdmin)}
                        title={u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${u.isAdmin ? 'bg-gold/10 text-gold hover:bg-gold hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-gold hover:text-white'}`}>
                        <FiShield size={14} />
                      </button>
                      <button onClick={() => handleDelete(u._id)}
                        className="w-8 h-8 bg-red-50 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-400">
            Total: {users.length} users
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;