import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { FiHeart, FiShoppingBag, FiX } from 'react-icons/fi';

const WishlistPage = () => {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${user?.token}` };

  const fetchWishlist = async () => {
    try {
      const res = await axios.get('/api/auth/profile', { headers });
      setWishlist(res.data.wishlist || []);
    } catch { toast.error('Failed to load wishlist'); }
    setLoading(false);
  };

  useEffect(() => { fetchWishlist(); }, []);

  const removeFromWishlist = async (productId) => {
    try {
      await axios.post(`/api/users/wishlist/${productId}`, {}, { headers });
      setWishlist(w => w.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed to remove'); }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      _id: product._id, name: product.name,
      price: product.discountPrice || product.price,
      image: product.images?.[0]?.url,
      size: product.sizes?.[0],
      color: product.colors?.[0]?.name,
      quantity: 1, stock: product.stock
    }));
    toast.success('Added to cart!');
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-10">
        <FiHeart className="text-red-400 text-2xl" fill="currentColor" />
        <h1 className="font-display text-4xl">My Wishlist</h1>
        <span className="text-gray-400 font-body text-base">({wishlist.length} items)</span>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-24">
          <FiHeart size={60} className="mx-auto text-gray-200 mb-4" />
          <h2 className="font-display text-2xl mb-2">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-8">Save items you love to your wishlist.</p>
          <Link to="/products" className="px-8 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <div key={product._id} className="group relative bg-white rounded overflow-hidden hover:shadow-lg transition-all">
              {/* Remove Button */}
              <button onClick={() => removeFromWishlist(product._id)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                <FiX size={16} />
              </button>

              {/* Image */}
              <Link to={`/products/${product._id}`}>
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <img src={product.images?.[0]?.url || 'https://via.placeholder.com/400x500'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              </Link>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs font-bold text-gold tracking-widest uppercase mb-1">{product.category}</p>
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-body font-semibold text-sm mb-2 hover:text-gold transition-colors truncate">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold">${product.discountPrice || product.price}</span>
                    {product.discountPrice > 0 && (
                      <span className="text-gray-400 text-xs line-through ml-2">${product.price}</span>
                    )}
                  </div>
                  <button onClick={() => handleAddToCart(product)}
                    className="w-9 h-9 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <FiShoppingBag size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;