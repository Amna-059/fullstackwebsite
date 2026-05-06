import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { FiEye, FiX } from 'react-icons/fi';

const STATUS_COLORS = {
  Processing: 'bg-yellow-50 text-yellow-600',
  Shipped: 'bg-blue-50 text-blue-600',
  Delivered: 'bg-green-50 text-green-600',
  Cancelled: 'bg-red-50 text-red-500'
};

const AdminOrders = () => {
  const { user } = useSelector(s => s.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const headers = { Authorization: `Bearer ${user?.token}` };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/all', { headers });
      setOrders(res.data);
    } catch { toast.error('Failed to load orders'); }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { status }, { headers });
      toast.success('Status updated!');
      fetchOrders();
      if (selected?._id === id) setSelected(o => ({ ...o, status }));
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-8">Orders Management</h1>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID','Customer','Date','Items','Total','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold tracking-widest uppercase text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.user?.name}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{order.orderItems?.length} items</td>
                  <td className="px-4 py-3 font-bold">${order.totalPrice?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <select value={order.status}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded border-0 outline-none cursor-pointer ${STATUS_COLORS[order.status]}`}>
                      {['Processing','Shipped','Delivered','Cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(order)}
                      className="w-8 h-8 bg-gray-100 text-gray-600 rounded hover:bg-black hover:text-white transition-colors flex items-center justify-center">
                      <FiEye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-400">
            Total: {orders.length} orders
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="font-display text-xl">Order #{selected._id.slice(-8).toUpperCase()}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-black"><FiX size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold tracking-widest uppercase text-gray-500">Status</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
              </div>
              {/* Customer */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Customer</h4>
                <p className="font-medium">{selected.user?.name}</p>
                <p className="text-sm text-gray-400">{selected.user?.email}</p>
              </div>
              {/* Shipping */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-600">
                  {selected.shippingAddress?.fullName}<br />
                  {selected.shippingAddress?.street}<br />
                  {selected.shippingAddress?.city}, {selected.shippingAddress?.state} {selected.shippingAddress?.zipCode}<br />
                  {selected.shippingAddress?.country}
                </p>
              </div>
              {/* Items */}
              <div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Items</h4>
                <div className="space-y-3">
                  {selected.orderItems?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Total */}
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${selected.itemsPrice?.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-500"><span>Shipping</span><span>${selected.shippingPrice?.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-500"><span>Tax</span><span>${selected.taxPrice?.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2"><span>Total</span><span>${selected.totalPrice?.toFixed(2)}</span></div>
              </div>
              {/* Update Status */}
              <div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Update Status</h4>
                <div className="flex gap-2 flex-wrap">
                  {['Processing','Shipped','Delivered','Cancelled'].map(s => (
                    <button key={s} onClick={() => updateStatus(selected._id, s)}
                      className={`px-4 py-2 text-xs font-bold rounded border-2 transition-colors ${selected.status === s ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;