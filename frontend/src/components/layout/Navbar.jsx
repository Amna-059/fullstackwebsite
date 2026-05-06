import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import {
  FiShoppingBag,
  FiHeart,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
} from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = items.reduce((a, i) => a + i.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Hamburger */}
        <button
          className="md:hidden text-gray-800 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="font-display text-2xl font-bold tracking-widest"
        >
          LUXE<span className="text-gold">DRIP</span>
        </Link>

        {/* Nav Links */}
        <ul
          className={`
          md:flex gap-8 list-none
          ${
            menuOpen
              ? "flex flex-col absolute top-16 left-0 right-0 bg-white px-6 py-4 gap-4 border-b border-gray-200 shadow-md z-50"
              : "hidden md:flex"
          }
        `}
        >
          
          {["Women", "Men", "Kids", "Accessories", "Fragrances"].map((cat) => (
            <li key={cat}>
              <Link
                to={`/products?category=${cat}`}
                onClick={() => setMenuOpen(false)}
                className="text-xs font-semibold tracking-widest uppercase text-gray-500 hover:text-black transition-colors"
              >
                {cat}
              </Link>
            </li>
          ))}
         
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-xl hover:text-gold transition-colors"
          >
            <FiSearch />
          </button>
          <Link
            to="/wishlist"
            className="text-xl hover:text-gold transition-colors"
          >
            <FiHeart />
          </Link>
          <Link
            to="/cart"
            className="relative text-xl hover:text-gold transition-colors"
          >
            <FiShoppingBag />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="relative group">
              <button className="text-xl hover:text-gold transition-colors">
                <FiUser />
              </button>
              <div className="hidden group-hover:flex flex-col absolute right-0 top-full bg-white border border-gray-200 rounded shadow-lg min-w-[150px] overflow-hidden z-50">
                <Link
                  to="/profile"
                  className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                >
                  Orders
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => dispatch(logout())}
                  className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-black transition-colors text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xl hover:text-gold transition-colors"
            >
              <FiUser />
            </Link>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-gray-200 px-6 py-3">
          <form
            onSubmit={handleSearch}
            className="flex max-w-xl mx-auto border-2 border-black rounded overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search for clothing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 px-4 py-2 outline-none font-body text-sm"
            />
            <button type="submit" className="px-4 bg-black text-white text-lg">
              <FiSearch />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
