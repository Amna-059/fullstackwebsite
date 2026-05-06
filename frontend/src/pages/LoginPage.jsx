import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login, clearError } from '../redux/slices/authSlice';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { loading, error, user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    if (user) navigate(params.get('redirect') || '/');
    return () => dispatch(clearError());
  }, [user, navigate, dispatch, params]);

  const handleSubmit = (e) => { e.preventDefault(); dispatch(login(form)); };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-6 py-16">
      <div className="bg-white p-12 rounded shadow-xl w-full max-w-md">
        <h1 className="font-display text-4xl mb-2">Welcome Back</h1>
        <p className="text-gray-400 mb-8">Sign in to your LUXEDRIP account</p>
        {error && <div className="bg-red-50 text-red-500 px-4 py-3 rounded mb-5 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          {[{ label: 'Email Address', key: 'email', type: 'email' }, { label: 'Password', key: 'password', type: 'password' }].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">{f.label}</label>
              <input type={f.type} required value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded outline-none focus:border-black transition-colors font-body" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full py-4 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-60">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-400">
          Don't have an account? <Link to="/register" className="text-gold font-semibold">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;