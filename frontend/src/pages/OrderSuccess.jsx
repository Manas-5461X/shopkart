import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const { id } = useParams();
  
  return (
    <div className="bg-[#f7f7f5] text-[#111] flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-black/[0.06] bg-white sticky top-0 z-50">
        <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-5">
          <Link to="/" className="text-[25px] font-black tracking-[-0.06em]">
            Shop<span className="text-[#6d5dfc]">Kart</span>
          </Link>
          <Link to="/products" className="text-sm font-bold text-gray-500 hover:text-[#111] transition flex items-center gap-2">
            Continue Shopping →
          </Link>
        </div>
      </header>

      {/* Main Content Area: Takes up remaining height to push footer down */}
      <div className="flex-grow flex flex-col items-center justify-center px-5 text-center">
        <div className="w-20 h-20 bg-[#6d5dfc] text-white rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl shadow-[#6d5dfc]/20">
          ✓
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">Order Confirmed</h1>
        <p className="text-gray-500 font-medium mb-8">Your order #{id} has been placed successfully.</p>
        <div className="flex gap-4">
          <Link to={`/orders/${id}`} className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800">
            View Receipt
          </Link>
          <Link to="/orders" className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-bold text-[#111] transition hover:border-black/30">
            All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};
export default OrderSuccess;
