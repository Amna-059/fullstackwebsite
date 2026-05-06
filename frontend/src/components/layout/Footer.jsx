import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-black text-white mt-20">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 py-16">
      <div>
        <h2 className="font-display text-3xl font-bold mb-3">LUXE<span className="text-gold">DRIP</span></h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Fashion that tells your story. Premium clothing curated for every style.</p>
      </div>
      <div className="grid grid-cols-3 gap-8">
        {[
          { title: 'Shop', links: [['Women','/products?category=Women'],['Men','/products?category=Men'],['Kids','/products?category=Kids'],['Accessories','/products?category=Accessories']] },
          { title: 'Help', links: [['Contact Us','#'],['Returns','#'],['Size Guide','#'],['Shipping','#']] },
          { title: 'Account', links: [['Profile','/profile'],['Orders','/orders'],['Wishlist','/wishlist']] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="text-xs font-bold tracking-widest uppercase text-gold mb-4">{col.title}</h4>
            {col.links.map(([label, href]) => (
              <Link key={label} to={href} className="block text-gray-400 text-sm mb-2 hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
        ))}
      </div>
    </div>
    <div className="border-t border-white/10 py-5 text-center text-gray-500 text-xs">
      © 2025 LUXEDRIP. All rights reserved.
    </div>
  </footer>
);

export default Footer;