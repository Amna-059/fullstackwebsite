import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, loading } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match!');
    }
    try {
      const data = { name: form.name, email: form.email };
      if (form.password) data.password = form.password;
      await dispatch(updateProfile(data)).unwrap();
      toast.success('Profile updated!');
      setForm(f => ({ ...f, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err || 'Update failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-2">My Profile</h1>
      <p className="text-gray-400 mb-10">Manage your account information</p>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-10 p-6 bg-gray-50 rounded-xl">
        <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center text-gold text-3xl font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-display text-2xl">{user?.name}</h2>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          {user?.isAdmin && (
            <span className="inline-block mt-1 text-xs bg-gold/10 text-gold font-bold px-3 py-0.5 rounded-full">👑 Admin</span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
            <FiUser className="inline mr-1" /> Full Name
          </label>
          <input type="text" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded outline-none focus:border-black transition-colors font-body" />
        </div>

        <div>
          <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
            <FiMail className="inline mr-1" /> Email Address
          </label>
          <input type="email" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded outline-none focus:border-black transition-colors font-body" />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-display text-lg mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
                <FiLock className="inline mr-1" /> New Password
              </label>
              <input type="password" value={form.password} placeholder="Leave blank to keep current"
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded outline-none focus:border-black transition-colors font-body" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
                <FiLock className="inline mr-1" /> Confirm New Password
              </label>
              <input type="password" value={form.confirmPassword} placeholder="Confirm new password"
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded outline-none focus:border-black transition-colors font-body" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-60">
          <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;