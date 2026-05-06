import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
    <h1 className="font-display text-9xl text-gray-200 leading-none">404</h1>
    <h2 className="font-display text-3xl mb-3">Page Not Found</h2>
    <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
    <Link to="/" className="px-8 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">Go Home</Link>
  </div>
);

export default NotFoundPage;