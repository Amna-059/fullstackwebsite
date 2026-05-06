import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../redux/slices/orderSlice';

const statusColor = { Processing: 'text-yellow-600 bg-yellow-50', Shipped: 'text-blue-600 bg-blue-50', Delivered: 'text-green-600 bg-green-50', Cancelled: 'text-red-600 bg-red-50' };

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector(s => s.order);
  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-400">No orders yet.</p>
      ) : orders.map(order => (
        <div key={order._id} className="border border-gray-200 rounded overflow-hidden mb-6 shadow-sm">
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
            <div>
              <p className="font-bold text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest ${statusColor[order.status]}`}>{order.status}</span>
              <p className="font-bold mt-1">${order.totalPrice.toFixed(2)}</p>
            </div>
          </div>
          <div className="px-6 py-3 divide-y divide-gray-100">
            {order.orderItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded" />
                <span className="flex-1 text-sm">{item.name} × {item.quantity}</span>
                <span className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;