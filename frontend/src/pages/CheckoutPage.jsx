import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../redux/slices/orderSlice';
import { clearCart, saveShippingAddress } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const { items, shippingAddress } = useSelector(s => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(shippingAddress);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);
  const shipping = subtotal >= 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    try {
      await dispatch(createOrder({
        orderItems: items.map(i => ({ product: i._id, name: i.name, image: i.image, price: i.price, quantity: i.quantity, size: i.size, color: i.color })),
        shippingAddress: address, paymentMethod,
        itemsPrice: subtotal, shippingPrice: shipping, taxPrice: tax, totalPrice: total
      })).unwrap();
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) { toast.error(err || 'Order failed'); }
  };

  const steps = ['Shipping', 'Payment', 'Review'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Steps */}
      <div className="flex border-b-2 border-gray-200 mb-10">
        {steps.map((s, i) => (
          <div key={s} className={`flex items-center gap-2 px-6 py-4 text-xs font-bold tracking-widest uppercase border-b-2 -mb-0.5 transition-colors ${step >= i + 1 ? 'border-gold text-black' : 'border-transparent text-gray-400'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step >= i + 1 ? 'bg-gold text-white' : 'bg-gray-200 text-gray-400'}`}>{i + 1}</span>
            {s}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2">
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['fullName','street','city','state','zipCode','country'].map(field => (
                  <div key={field} className={field === 'street' ? 'md:col-span-2' : ''}>
                    <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                    </label>
                    <input type="text" value={address[field] || ''}
                      onChange={e => setAddress(a => ({ ...a, [field]: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded outline-none focus:border-black transition-colors font-body" />
                  </div>
                ))}
              </div>
              <button onClick={() => { dispatch(saveShippingAddress(address)); setStep(2); }}
                className="mt-6 px-10 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl mb-6">Payment Method</h2>
              <div className="space-y-3">
                {['Credit Card', 'PayPal', 'Cash on Delivery'].map(m => (
                  <label key={m} className={`flex items-center gap-3 p-4 border-2 rounded cursor-pointer transition-colors ${paymentMethod === m ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                    <input type="radio" name="payment" value={m} checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} className="accent-black" />
                    <span className="font-medium">{m}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="px-8 py-3 border-2 border-black text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors">Back</button>
                <button onClick={() => setStep(3)} className="px-8 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl mb-6">Review Your Order</h2>
              <div className="divide-y divide-gray-200 mb-6">
                {items.map(item => (
                  <div key={item._id} className="flex items-center gap-4 py-4">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-400">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-8 py-3 border-2 border-black text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors">Back</button>
                <button onClick={handlePlaceOrder} className="px-8 py-3 bg-gold text-white text-xs font-bold tracking-widest uppercase hover:bg-yellow-600 transition-colors">Place Order</button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-7 rounded sticky top-20">
          <h3 className="font-display text-xl mb-5">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between pt-4 border-t-2 border-black font-bold text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500 space-y-1">
            {address.city && <p>📍 {address.city}, {address.country}</p>}
            <p>💳 {paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;