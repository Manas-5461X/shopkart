import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#111] text-white mt-auto">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:py-14 sm:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-[2fr_1fr_1fr] md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="text-2xl font-black tracking-[-0.05em]">
              Shop<span className="text-[#6d5dfc]">Kart</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/45">
              A modern marketplace for products you'll actually want to keep.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Shop</h3>
            <div className="mt-5 flex flex-col space-y-3 text-sm text-white/50">
              <Link to="/products" className="hover:text-white transition">New arrivals</Link>
              <Link to="/products?category=Fashion" className="hover:text-white transition">Categories</Link>
              <Link to="/products" className="hover:text-white transition">Best sellers</Link>
              <Link to="/products" className="hover:text-white transition">Deals</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Help</h3>
            <div className="mt-5 space-y-3 text-sm text-white/50">
              <p className="cursor-pointer hover:text-white transition">Contact</p>
              <p className="cursor-pointer hover:text-white transition">Shipping</p>
              <p className="cursor-pointer hover:text-white transition">Returns</p>
              <p className="cursor-pointer hover:text-white transition">FAQ</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-white/30 sm:flex-row">
          <p>© {new Date().getFullYear()} ShopKart. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-white transition">Privacy</span>
            <span className="cursor-pointer hover:text-white transition">Terms</span>
            <span className="cursor-pointer hover:text-white transition">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
