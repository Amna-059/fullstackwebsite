import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { FiShoppingBag, FiStar } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      _id: product._id, name: product.name,
      price: product.discountPrice || product.price,
      image: product.images[0]?.url || '/placeholder.jpg',
      size: product.sizes[0], color: product.colors[0]?.name,
      quantity: 1, stock: product.stock
    }));
    toast.success('Added to cart!');
  };

  const discount = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  return (
    <Link to={`/products/${product._id}`} className="group block bg-white rounded overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
        <img
          src={product.images[0]?.url || 'https://via.placeholder.com/400x500'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-{discount}%</span>
        )}
        {product.trending && (
          <span className="absolute top-3 right-3 bg-gold text-white text-xs font-bold px-2 py-1 rounded">Trending</span>
        )}
        {/* Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-4 flex justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={handleAddToCart} className="flex items-center gap-2 text-white text-xs font-bold tracking-widest uppercase">
            <FiShoppingBag /> Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs font-bold tracking-widest uppercase text-gold mb-1">{product.category}</p>
        <h3 className="font-body text-sm font-medium mb-1 truncate">{product.name}</h3>
        <div className="flex items-center gap-1 text-gold text-xs mb-2">
          <FiStar fill="currentColor" size={11} />
          <span className="text-gray-400">{product.rating?.toFixed(1)} ({product.numReviews})</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold">${product.discountPrice || product.price}</span>
          {product.discountPrice > 0 && (
            <span className="text-gray-400 text-sm line-through">${product.price}</span>
          )}
        </div>
        <div className="flex gap-1">
          {product.colors?.slice(0, 4).map(c => (
            <span key={c.name} title={c.name}
              className="w-3 h-3 rounded-full border border-gray-200"
              style={{ background: c.hex }} />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;