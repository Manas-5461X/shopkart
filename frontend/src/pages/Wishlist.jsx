import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios.js';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/wishlist');
      setWishlist(res.data.wishlist);
    } catch (err) {
      setError("Unable to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axiosInstance.delete(`/wishlist/${productId}`);
      toast.success("Removed from wishlist");
      // Optimistic UI update
      setWishlist(prev => prev.filter(item => item._id !== productId));
    } catch (err) {
      toast.error("Could not remove item.");
    }
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#f7f7f5]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1400px] items-center px-5 sm:px-8">
        <Link to="/" className="text-[25px] font-black tracking-[-0.06em]">
          Shop<span className="text-[#6d5dfc]">Kart</span>
        </Link>
        <div className="ml-auto flex gap-6 items-center">
          <Link to="/products" className="text-[13px] font-semibold text-gray-700 transition hover:text-[#6d5dfc]">
            Back to Products
          </Link>
        </div>
      </div>
    </header>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111]">
      {renderHeader()}
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm font-semibold text-gray-500 animate-pulse">Loading your wishlist...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111]">
      {renderHeader()}
      <div className="flex flex-col h-[60vh] items-center justify-center">
        <p className="text-sm font-semibold text-red-500 mb-4">{error}</p>
        <button onClick={fetchWishlist} className="text-sm font-semibold text-[#6d5dfc] hover:underline">Try Again</button>
      </div>
    </div>
  );

  if (wishlist.length === 0) return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111] overflow-hidden relative">
      {renderHeader()}
      
      {/* Crazy background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-purple-400 via-pink-400 to-red-400 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      <div className="flex flex-col items-center justify-center h-[calc(100vh-76px)] text-center px-5 relative z-10">
        
        <div className="relative mb-10 group">
          <div className="absolute inset-0 bg-red-400 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
          <div className="text-[120px] leading-none transform transition duration-500 hover:scale-110 relative z-10 animate-bounce" style={{ animationDuration: '3s' }}>
            🛒
          </div>
        </div>

        <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
          It's looking empty in here.
        </h2>
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl mx-auto font-medium">
          You haven't saved any products yet. Discover our premium aesthetic collection and hit that heart button!
        </p>
        
        <Link to="/products" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-4 px-10 font-bold text-white shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
          <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-black via-[#111] to-[#333]"></span>
          <span className="absolute bottom-0 right-0 block h-64 w-64 translate-x-32 translate-y-24 rounded-full bg-gradient-to-br from-[#6d5dfc] to-purple-500 opacity-50 blur-3xl transition-all duration-700 group-hover:translate-x-10 group-hover:translate-y-10 group-hover:opacity-80"></span>
          <span className="relative z-10 flex items-center gap-2 text-lg">
            Start Exploring <span>→</span>
          </span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111] relative overflow-hidden">
      
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-300 via-pink-200 to-transparent rounded-full blur-[100px] opacity-40 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      {renderHeader()}

      <main className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 relative z-10">
        
        {/* Awesome Compact Banner Title */}
        <div className="mb-8 rounded-2xl bg-white p-5 sm:px-8 shadow-sm border border-gray-100 flex flex-row items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition duration-700"></div>
          
          <div className="relative z-10 flex flex-row items-center gap-4 sm:gap-6 w-full">
             <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 bg-gray-50 rounded-full shadow-inner border border-gray-100 transform transition duration-500 group-hover:rotate-12 group-hover:scale-110 shrink-0">
               <span className="text-xl sm:text-2xl">✨</span>
             </div>
             <div>
               <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                 Your Curated Collection
               </h1>
               <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">You have beautifully handpicked {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}.</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
          {wishlist.map(product => (
            <article
              key={product._id}
              className="group overflow-hidden rounded-2xl bg-white transition duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl flex flex-col border border-gray-200"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f1ef]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                
                {product.stock === 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-red-100 text-red-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Out of stock
                  </span>
                )}
                
                <Link to={`/products/${product._id}`} className="absolute bottom-4 left-4 right-4 translate-y-4 rounded-xl bg-black py-3.5 text-center text-xs font-bold text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[#6d5dfc] hover:text-white">
                  View Details
                </Link>

                <button 
                  onClick={() => handleRemove(product._id)}
                  className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 text-red-500 transition z-10 flex items-center justify-center text-sm leading-none font-bold"
                >
                  ✖
                </button>
              </div>

              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between border-t border-black/[0.03] bg-gray-50/30">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1.5 line-clamp-1">{product.category}</p>
                  <h3 className="text-[15px] font-bold line-clamp-2 leading-snug text-gray-900">{product.name}</h3>
                </div>
                
                <div className="mt-4 flex flex-col gap-1.5">
                  <span className="text-lg font-black text-[#111]">₹{product.price}</span>
                  {product.stock > 0 ? (
                    <span className="text-[11px] font-medium text-green-600">{product.stock} units left</span>
                  ) : (
                    <span className="text-[11px] font-medium text-red-500">Currently unavailable</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;