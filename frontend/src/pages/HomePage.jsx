import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFeatured } from "../redux/slices/productSlice";
import ProductCard from "../components/product/ProductCard";
import axios from "../utils/axios";

const categories = [
  { name: "Women", img: "/images/women.webp" },
  { name: "Men", img: "/images/men.png" },
  { name: "Kids", img: "/images/kid.jpg" },
  { name: "Accessories", img: "/images/accessories.jpg" },
  { name: "Fragrances", img: "/images/fragrance.jpg" },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const { featured } = useSelector((s) => s.product);
  const [fragrances, setFragrances] = useState([]);

  useEffect(() => {
    dispatch(fetchFeatured());
    // Fragrances fetch karo
    axios
      .get("/api/products?category=Fragrances&limit=4")
      .then((res) => setFragrances(res.data.products))
      .catch(() => {});
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[90vh] bg-cream">
        <div className="flex flex-col justify-center px-8 md:px-16 py-20">
          <span className="text-xs font-bold tracking-[3px] uppercase text-gold mb-4">
            New Collection 2025
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            Dress to
            <br />
            Express
          </h1>
          <p className="text-gray-500 text-lg mb-10 max-w-md">
            Discover fashion that tells your story. Curated pieces for every
            moment.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              to="/products?category=Women"
              className="px-8 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-700 transition-colors"
            >
              Shop Women
            </Link>
            <Link
              to="/products?category=Men"
              className="px-8 py-3 border-2 border-black text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
            >
              Shop Men
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden min-h-[50vh]">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-10 left-10 bg-gold text-white w-20 h-20 rounded-full flex flex-col items-center justify-center text-[10px] font-bold tracking-widest uppercase leading-relaxed">
            <span>New</span>
            <span>Arrivals</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="font-display text-4xl mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="group relative overflow-hidden rounded aspect-[3/4] block"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
                <h3 className="font-display text-lg mb-1">{cat.name}</h3>
                <span className="text-xs opacity-80">Shop Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-black text-white text-center py-20 my-10">
        <h2 className="font-display text-5xl mb-3">Summer Sale</h2>
        <p className="text-gray-400 text-lg mb-8">
          Up to 50% off on selected items
        </p>
        <Link
          to="/products"
          className="px-10 py-4 bg-gold text-white text-xs font-bold tracking-widest uppercase hover:bg-yellow-600 transition-colors"
        >
          Shop the Sale
        </Link>
      </section>

      {/* Fragrances Section */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-4xl">Fragrances</h2>
          <Link
            to="/products?category=Fragrances"
            className="text-sm text-gold font-semibold"
          >
            View All →
          </Link>
        </div>
        {fragrances.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {fragrances.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-4xl mb-3">🌸</p>
            <p className="text-gray-400">No fragrances added yet.</p>
            <Link
              to="/admin/products"
              className="inline-block mt-4 text-sm text-gold font-semibold"
            >
              Add Fragrances →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
