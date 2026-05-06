import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../redux/slices/authSlice';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [err, setErr] = useState('');
  const { loading, error, user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setErr('Passwords do not match');
    setErr('');
    dispatch(register({ name: form.name, email: form.email, password: form.password }));
  };

  const fields = [
    { label: 'Full Name', key: 'name', type: 'text' },
    { label: 'Email Address', key: 'email', type: 'email' },
    { label: 'Password', key: 'password', type: 'password' },
    { label: 'Confirm Password', key: 'confirm', type: 'password' },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-6 py-16">
      <div className="bg-white p-12 rounded shadow-xl w-full max-w-md">
        <h1 className="font-display text-4xl mb-2">Create Account</h1>
        <p className="text-gray-400 mb-8">Join LUXEDRIP today</p>
        {(error || err) && <div className="bg-red-50 text-red-500 px-4 py-3 rounded mb-5 text-sm">{error || err}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">{f.label}</label>
              <input type={f.type} required value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded outline-none focus:border-black transition-colors font-body" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full py-4 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-60">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-gold font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;