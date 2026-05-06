import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

const CartPage = () => {
  const { items } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);
  const shipping = subtotal >= 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h2 className="font-display text-3xl mb-3">Your cart is empty</h2>
      <p className="text-gray-400 mb-8">Add some beautiful pieces to your cart.</p>
      <Link to="/products" className="px-8 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-700 transition-colors">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-10">Shopping Cart <span className="font-body text-base text-gray-400 font-normal">({items.length} items)</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Items */}
        <div className="lg:col-span-2 divide-y divide-gray-200">
          {items.map(item => (
            <div key={`${item._id}-${item.size}-${item.color}`} className="flex gap-5 py-6">
              <img src={item.image} alt={item.name} className="w-28 h-36 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-body font-semibold mb-1">{item.name}</h3>
                <p className="text-sm text-gray-400 mb-4">Size: {item.size} | Color: {item.color}</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => dispatch(updateQuantity({ ...item, quantity: Math.max(1, item.quantity - 1) }))}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                    <FiMinus size={14} />
                  </button>
                  <span className="font-semibold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => dispatch(updateQuantity({ ...item, quantity: Math.min(item.stock, item.quantity + 1) }))}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <span className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => dispatch(removeFromCart(item))} className="text-gray-400 hover:text-red-500 transition-colors"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-7 rounded sticky top-20">
          <h3 className="font-display text-xl mb-5">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between pt-4 border-t-2 border-black font-bold text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          {shipping > 0 && <p className="text-xs text-green-600 mt-3">Add ${(75 - subtotal).toFixed(2)} more for free shipping!</p>}
          <button onClick={() => navigate(user ? '/checkout' : '/login?redirect=/checkout')}
            className="w-full mt-6 py-4 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
            Proceed to Checkout
          </button>
          <Link to="/products" className="block text-center mt-4 text-sm text-gray-400 hover:text-black transition-colors">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;