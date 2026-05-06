import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import axios from '../../utils/axios';
import {
  FiGrid, FiShoppingBag, FiUsers, FiPackage, FiLogOut,
  FiMenu, FiX, FiDollarSign, FiEye, FiChevronRight,
  FiArrowUp, FiBox, FiTrendingUp
} from 'react-icons/fi';

const NAV = [
  { label: 'Overview',  icon: FiGrid,        path: '/admin' },
  { label: 'Products',  icon: FiShoppingBag, path: '/admin/products' },
  { label: 'Orders',    icon: FiPackage,     path: '/admin/orders' },
  { label: 'Users',     icon: FiUsers,       path: '/admin/users' },
];

const STATUS_STYLE = {
  Processing: 'bg-amber-50 text-amber-700 border-amber-200',
  Shipped:    'bg-blue-50 text-blue-700 border-blue-200',
  Delivered:  'bg-green-50 text-green-700 border-green-200',
  Cancelled:  'bg-red-50 text-red-700 border-red-200',
};

const STATUS_DOT = {
  Processing: 'bg-amber-400',
  Shipped:    'bg-blue-400',
  Delivered:  'bg-green-400',
  Cancelled:  'bg-red-400',
};

const STATUS_BAR = {
  Processing: 'bg-amber-400',
  Shipped:    'bg-blue-400',
  Delivered:  'bg-green-400',
  Cancelled:  'bg-red-400',
};

// ── Sidebar ────────────────────────────────────────────────────────────
function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#0c0f1a] z-50 flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        border-r border-white/5
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-7 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-yellow-300 flex items-center justify-center">
              <span className="text-[#0c0f1a] font-black text-xs font-serif">LD</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-[2px]">LUXEDRIP</p>
              <p className="text-gold text-[9px] tracking-[2px] uppercase">Admin Panel</p>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <FiX size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          <p className="text-white/25 text-[9px] tracking-[2px] uppercase px-3 mb-3">Main Menu</p>
          {NAV.map(({ label, icon: Icon, path }) => {
            const active = path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(path);
            return (
              <Link key={path} to={path} onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-150
                  text-sm font-medium border-l-2
                  ${active
                    ? 'bg-gold/10 text-gold border-gold'
                    : 'text-white/50 border-transparent hover:text-white hover:bg-white/5'
                  }
                `}>
                <Icon size={17} />
                {label}
                {active && <FiChevronRight size={13} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="px-3 pb-4 border-t border-white/5 pt-3">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center text-gold font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-white/35 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <Link to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/45 hover:text-white hover:bg-white/5 text-sm transition-all">
            <FiEye size={15} /> View Store
          </Link>
          <button
            onClick={() => { dispatch(logout()); navigate('/'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-all text-left">
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, iconBg, iconColor, change }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-30 ${iconBg}`} />
      <div className="flex items-start justify-between mb-5 relative">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 bg-green-50 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full">
            <FiArrowUp size={11} /> {change}%
          </div>
        )}
      </div>
      <p className="text-3xl font-black text-gray-900 leading-none mb-1">{value}</p>
      <p className="text-gray-400 text-sm font-medium">{label}</p>
      {sub && <p className="text-gold text-xs font-semibold mt-1">{sub}</p>}
    </div>
  );
}

// ── Dashboard Content ──────────────────────────────────────────────────
function DashboardHome() {
  const { user } = useSelector(s => s.auth);
  const [data, setData] = useState({ products: 0, orders: [], users: 0 });
  const [loading, setLoading] = useState(true);
  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    (async () => {
      try {
        const [p, o, u] = await Promise.all([
          axios.get('/api/products?limit=1'),
          axios.get('/api/orders/all', { headers }),
          axios.get('/api/users', { headers }),
        ]);
        setData({ products: p.data.total, orders: o.data, users: u.data.length });
      } catch {}
      setLoading(false);
    })();
  }, []);

  const revenue = data.orders.reduce((a, o) => a + o.totalPrice, 0);
  const recentOrders = data.orders.slice(0, 6);
  const statusCount = (s) => data.orders.filter(o => o.status === s).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-gray-400 text-sm">{greeting}, {user?.name?.split(' ')[0]} 👋</p>
          <h1 className="font-display text-4xl font-bold text-gray-900 mt-1">Dashboard</h1>
        </div>
        <Link to="/admin/products"
          className="inline-flex items-center gap-2 bg-[#0c0f1a] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
          + Add Product
        </Link>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={FiBox}        label="Total Products" value={data.products}
            iconBg="bg-violet-100" iconColor="text-violet-600"
            sub="In catalog" change={12} />
          <StatCard icon={FiPackage}    label="Total Orders"   value={data.orders.length}
            iconBg="bg-blue-100" iconColor="text-blue-600"
            sub={`${statusCount('Processing')} processing`} change={8} />
          <StatCard icon={FiUsers}      label="Total Users"    value={data.users}
            iconBg="bg-emerald-100" iconColor="text-emerald-600"
            sub="Registered" change={5} />
          <StatCard icon={FiDollarSign} label="Total Revenue"  value={`$${revenue.toLocaleString()}`}
            iconBg="bg-amber-100" iconColor="text-amber-600"
            sub="All time" change={18} />
        </div>
      )}

      {/* Middle Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h3 className="font-display text-xl font-bold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders"
              className="text-xs font-bold text-gold tracking-widest uppercase hover:opacity-70 transition-opacity">
              View All →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FiPackage size={36} className="mx-auto mb-3 opacity-30" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/50">
                    {['Order', 'Customer', 'Date', 'Amount', 'Status'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-[10px] font-bold tracking-widest uppercase text-gray-400 border-b border-gray-50">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o, i) => (
                    <tr key={o._id}
                      className="hover:bg-gray-50/60 transition-colors border-b border-gray-50/80 last:border-0">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-gray-700">
                        #{o._id.slice(-7).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs shrink-0">
                            {o.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-xs">{o.user?.name}</p>
                            <p className="text-[10px] text-gray-400">{o.orderItems?.length} items</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                        ${o.totalPrice?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLE[o.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[o.status]}`} />
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">

          {/* Order Breakdown */}
          <div className="bg-[#0c0f1a] rounded-2xl p-6 flex-1">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-base font-bold text-white">Order Breakdown</h3>
              <FiTrendingUp className="text-gold" size={18} />
            </div>
            {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => {
              const count = statusCount(s);
              const pct = data.orders.length ? Math.round((count / data.orders.length) * 100) : 0;
              return (
                <div key={s} className="mb-4">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-white/60 text-xs font-medium">{s}</span>
                    <span className="text-white text-xs font-bold">{count} <span className="text-white/30 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${STATUS_BAR[s]}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="mt-5 pt-5 border-t border-white/8">
              <p className="text-white/35 text-[10px] tracking-widest uppercase mb-1">Total Revenue</p>
              <p className="text-gold text-3xl font-black">${revenue.toLocaleString()}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-display text-base font-bold text-gray-900 mb-4">Quick Actions</h3>
            {[
              { label: 'Manage Products', icon: FiShoppingBag, path: '/admin/products' },
              { label: 'View All Orders', icon: FiPackage,     path: '/admin/orders'   },
              { label: 'Manage Users',    icon: FiUsers,       path: '/admin/users'    },
            ].map(a => (
              <Link key={a.path} to={a.path}
                className="flex items-center gap-3 p-3 rounded-xl mb-1 hover:bg-gray-50 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-gold/10 flex items-center justify-center transition-colors shrink-0">
                  <a.icon size={16} className="text-gray-400 group-hover:text-gold transition-colors" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{a.label}</span>
                <FiChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-gold transition-colors" />
              </Link>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}

// ── Admin Layout ───────────────────────────────────────────────────────
export function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f5f6fa]">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 lg:ml-64 flex flex-col">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
            <FiMenu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400 font-medium hidden sm:block">System Online</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}

// ── Default Export ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <AdminLayout>
      <DashboardHome />
    </AdminLayout>
  );
}