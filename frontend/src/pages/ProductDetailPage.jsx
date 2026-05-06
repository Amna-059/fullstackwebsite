import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import axios from '../utils/axios';
import { FiStar, FiShoppingBag, FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading } = useSelector(s => s.product);
  const { user } = useSelector(s => s.auth);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState('description');
  
  // Wishlist state
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(id));
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0]?.name || '');
      
      // Check if item is already in user's wishlist
      if (user?.wishlist) {
        const exists = user.wishlist.some(p => p._id === product._id || p === product._id);
        setIsInWishlist(exists);
      }
    }
  }, [product, user]);

  const handleAddToCart = () => {
    if (!selectedSize) return toast.error('Please select a size!');
    if (!selectedColor) return toast.error('Please select a color!');
    dispatch(addToCart({
      _id: product._id, name: product.name,
      price: product.discountPrice || product.price,
      image: product.images[0]?.url,
      size: selectedSize, color: selectedColor,
      quantity, stock: product.stock
    }));
    toast.success('Added to cart!');
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.info('Please login to use wishlist');
      return navigate('/login');
    }

    try {
      // API call to toggle wishlist
      await axios.post(`/api/users/wishlist/${id}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setIsInWishlist(!isInWishlist);
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Wishlist update failed');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmitting(true);
    try {
      await axios.post(`/api/products/${id}/reviews`, review, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Review submitted!');
      dispatch(fetchProduct(id));
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
    setSubmitting(false);
  };

  const discount = product?.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  if (loading || !product) return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-8 bg-gray-200 animate-pulse rounded" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <button onClick={() => navigate('/')} className="hover:text-black transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/products')} className="hover:text-black transition-colors">Products</button>
        <span>/</span>
        <span className="text-black font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {product.images?.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`w-16 h-20 rounded overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-black' : 'border-transparent'}`}>
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1 relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.images?.[activeImg]?.url || 'https://via.placeholder.com/600x800'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-gold mb-2">{product.category}</p>
          <h1 className="font-display text-4xl mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={16}
                  className={i < Math.round(product.rating) ? 'text-gold fill-gold' : 'text-gray-300'}
                  fill={i < Math.round(product.rating) ? '#c9a84c' : 'none'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-bold">${product.discountPrice || product.price}</span>
            {product.discountPrice > 0 && (
              <span className="text-xl text-gray-400 line-through">${product.price}</span>
            )}
          </div>

          {/* Colors Selection */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Color: <span className="text-black">{selectedColor}</span></p>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button key={c.name} onClick={() => setSelectedColor(c.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c.name ? 'border-black scale-110' : 'border-gray-200'}`}
                    style={{ background: c.hex }} />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Size: <span className="text-black">{selectedSize}</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 border-2 rounded text-sm font-bold transition-colors ${selectedSize === s ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Quantity</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 border-2 border-gray-200 rounded flex items-center justify-center font-bold">-</button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-10 h-10 border-2 border-gray-200 rounded flex items-center justify-center font-bold">+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            <button onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
              <FiShoppingBag /> Add to Cart
            </button>
            
            {/* Working Wishlist Button */}
            <button 
              onClick={handleWishlist}
              className={`w-14 h-14 border-2 rounded flex items-center justify-center text-xl transition-all duration-300 ${
                isInWishlist 
                ? 'border-red-400 text-red-500 bg-red-50' 
                : 'border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-400'
              }`}
            >
              <FiHeart fill={isInWishlist ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="space-y-2 text-sm text-gray-500 border-t border-gray-200 pt-6">
            <p>✅ Free shipping on orders over $75</p>
            <p>🔒 Secure checkout</p>
          </div>
        </div>
      </div>

      {/* Tabs (Description & Reviews) */}
      <div className="mt-20">
        <div className="flex border-b border-gray-200 mb-8">
          {['description', 'reviews'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-8 py-4 text-xs font-bold tracking-widest uppercase border-b-2 -mb-px transition-colors ${tab === t ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}>
              {t === 'reviews' ? `Reviews (${product.numReviews})` : t}
            </button>
          ))}
        </div>

        {tab === 'description' && (
          <div className="max-w-2xl">
            <p className="text-gray-600 leading-relaxed text-base">{product.description}</p>
          </div>
        )}

        {tab === 'reviews' && (
          <div className="max-w-2xl space-y-6">
            {user ? (
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-display text-xl mb-4">Write a Review</h3>
                <div className="mb-4">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setReview(r => ({ ...r, rating: star }))}>
                        <FiStar size={24} className={star <= review.rating ? 'text-gold fill-gold' : 'text-gray-300'} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea rows={3} value={review.comment}
                  onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
                  required placeholder="Share your experience..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded outline-none focus:border-black resize-none mb-4" />
                <button type="submit" disabled={submitting} className="px-8 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-4 bg-gray-50 rounded">
                <button onClick={() => navigate('/login')} className="text-sm font-bold underline">Login to write a review</button>
              </div>
            )}

            {product.reviews?.map((r, i) => (
              <div key={i} className="border-b border-gray-200 pb-6">
                <p className="font-semibold">{r.name}</p>
                <div className="flex gap-1 my-1">
                  {[...Array(5)].map((_, j) => (
                    <FiStar key={j} size={13} fill={j < r.rating ? '#c9a84c' : 'none'} className={j < r.rating ? 'text-gold' : 'text-gray-300'} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;