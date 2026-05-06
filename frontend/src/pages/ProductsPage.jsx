import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
// CATEGORIES array update karo — sirf ye line badlo:
const CATEGORIES = ['Women', 'Men', 'Kids', 'Accessories', 'Fragrances'];
const SORTS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
];

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, total, pages, loading } = useSelector(s => s.product);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    size: '', minPrice: '', maxPrice: '',
    sort: 'newest', keyword: searchParams.get('keyword') || '', page: 1,
  });

  useEffect(() => {
    dispatch(fetchProducts(Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))));
  }, [filters, dispatch]);

  const toggle = (key, val) => setFilters(f => ({ ...f, [key]: f[key] === val ? '' : val, page: 1 }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex gap-10">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 sticky top-20 self-start">
        <h3 className="font-display text-xl mb-6 pb-3 border-b border-gray-200">Filters</h3>

        <div className="mb-7">
          <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Category</h4>
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2 py-1.5 cursor-pointer">
              <input type="radio" name="category" checked={filters.category === cat}
                onChange={() => toggle('category', cat)} className="accent-black" />
              <span className={`text-sm ${filters.category === cat ? 'text-gold font-semibold' : 'text-gray-600'}`}>{cat}</span>
            </label>
          ))}
        </div>

        <div className="mb-7">
          <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Size</h4>
          <div className="grid grid-cols-3 gap-2">
            {SIZES.map(s => (
              <button key={s} onClick={() => toggle('size', s)}
                className={`py-1.5 text-xs font-bold border rounded transition-colors ${filters.size === s ? 'bg-black text-white border-black' : 'bg-white border-gray-200 hover:border-black'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-7">
          <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Price Range</h4>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min" value={filters.minPrice}
              onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none focus:border-black" />
            <span className="text-gray-400">—</span>
            <input type="number" placeholder="Max" value={filters.maxPrice}
              onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none focus:border-black" />
          </div>
        </div>

        <button onClick={() => setFilters({ category: '', size: '', minPrice: '', maxPrice: '', sort: 'newest', keyword: '', page: 1 })}
          className="w-full py-2 border-2 border-black text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors">
          Clear Filters
        </button>
      </aside>

      {/* Products */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-400">{total} Results</p>
          <select value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 1 }))}
            className="px-3 py-2 border border-gray-200 rounded text-sm font-body outline-none">
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(pages)].map((_, i) => (
              <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                className={`w-10 h-10 border rounded font-semibold text-sm transition-colors ${filters.page === i + 1 ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;