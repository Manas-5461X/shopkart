import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { axiosInstance } from '../axiosCalls/axios.js';

const Cart = () => {
  const { cart, cartLoading, cartCount, cartSubtotal, updateQuantity, removeFromCart } = useCart();
  const [wishlistItems, setWishlistItems] = React.useState([]);

  React.useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axiosInstance.get('/wishlist');
        setWishlistItems(res.data.wishlist);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Error fetching wishlist count for badge", error);
        }
      }
    };
    fetchWishlist();
  }, []);

  const renderHeader = () => (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#f7f7f5]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1400px] items-center px-5 sm:px-8">
        <Link to="/" className="text-[25px] font-black tracking-[-0.06em]">
          Shop<span className="text-[#6d5dfc]">Kart</span>
        </Link>
        <div className="ml-auto flex gap-6 items-center">
          <Link to="/" className="text-[13px] font-semibold text-gray-700 transition hover:text-[#6d5dfc]">
            Home
          </Link>
          <Link to="/products" className="text-[13px] font-semibold text-gray-700 transition hover:text-[#6d5dfc]">
            Products
          </Link>
          <Link to="/wishlist" className="relative text-[21px] transition hover:scale-105" title="Wishlist">
            ♡
            {wishlistItems.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative flex items-center justify-center rounded-xl bg-[#6d5dfc]/15 px-3 py-1.5 text-[20px] transition hover:scale-105">
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#6d5dfc] px-1 text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );

  if (cartLoading && cart.length === 0) return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111]">
      {renderHeader()}
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm font-semibold text-gray-500 animate-pulse">Loading your cart...</p>
      </div>
    </div>
  );

  if (cart.length === 0) return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111] overflow-hidden relative">
      {renderHeader()}
      
      {/* Crazy background gradients matching wishlist */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      <div className="flex flex-col items-center justify-center h-[calc(100vh-76px)] text-center px-5 relative z-10">
        <div className="relative mb-10 group">
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
          <div className="text-[120px] leading-none transform transition duration-500 hover:scale-110 relative z-10 animate-bounce" style={{ animationDuration: '3s' }}>
            🛒
          </div>
        </div>

        <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
          Your cart is empty.
        </h2>
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl mx-auto font-medium">
          Looks like you haven't added anything yet. Discover our premium aesthetic collection and fill it up!
        </p>
        
        <Link to="/products" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-4 px-10 font-bold text-white shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
          <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-black via-[#111] to-[#333]"></span>
          <span className="absolute bottom-0 right-0 block h-64 w-64 translate-x-32 translate-y-24 rounded-full bg-gradient-to-br from-[#6d5dfc] to-blue-500 opacity-50 blur-3xl transition-all duration-700 group-hover:translate-x-10 group-hover:translate-y-10 group-hover:opacity-80"></span>
          <span className="relative z-10 flex items-center gap-2 text-lg">
            Browse Products <span>→</span>
          </span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111] relative overflow-hidden">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-300 via-purple-200 to-transparent rounded-full blur-[100px] opacity-40 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      {renderHeader()}

      <main className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 relative z-10">
        
        <div className="mb-8 rounded-2xl bg-white p-5 sm:px-8 shadow-sm border border-gray-100 flex flex-row items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition duration-700"></div>
          
          <div className="relative z-10 flex flex-row items-center gap-4 sm:gap-6 w-full">
             <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 bg-gray-50 rounded-full shadow-inner border border-gray-100 transform transition duration-500 group-hover:rotate-12 group-hover:scale-110 shrink-0">
               <span className="text-xl sm:text-2xl">🛒</span>
             </div>
             <div>
               <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                 My Cart
               </h1>
               <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">You have {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart.</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items List */}
          <div className="flex-1 flex flex-col gap-4">
            {cart.map(item => (
              <div key={item.product._id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 transition duration-300 hover:shadow-md">
                <Link to={`/products/${item.product._id}`} className="shrink-0 group">
                  <div className="h-32 w-32 sm:h-40 sm:w-40 bg-[#f1f1ef] rounded-xl overflow-hidden relative">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
                    />
                  </div>
                </Link>

                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1 line-clamp-1">{item.product.category}</p>
                        <h3 className="text-lg font-bold line-clamp-2 leading-snug text-gray-900 mb-1">
                          <Link to={`/products/${item.product._id}`} className="hover:text-[#6d5dfc] transition">
                            {item.product.name}
                          </Link>
                        </h3>
                      </div>
                      <span className="text-lg font-black shrink-0">₹{item.product.price}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
                      <button 
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition font-bold"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-sm select-none">{item.quantity}</span>
                      <button 
                        onClick={() => {
                          if (item.quantity >= item.product.stock) {
                            toast.error("Cannot add more products than the available quantity");
                          } else {
                            updateQuantity(item.product._id, item.quantity + 1);
                          }
                        }}
                        className="h-8 w-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-gray-500">
                        Total: <span className="text-[#111]">₹{item.product.price * item.quantity}</span>
                      </span>
                      <div className="h-4 w-[1px] bg-gray-200"></div>
                      <button 
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-sm font-bold text-red-500 hover:text-red-600 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-black mb-6">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="text-[#111] font-bold">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
              </div>

              <div className="h-[1px] w-full bg-gray-100 mb-6"></div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-sm font-bold text-gray-500">Total</span>
                <span className="text-3xl font-black text-[#111]">₹{cartSubtotal}</span>
              </div>

              <button className="w-full relative inline-flex items-center justify-center overflow-hidden rounded-2xl p-4 font-bold text-white shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 bg-black group">
                <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-black via-[#111] to-[#333]"></span>
                <span className="absolute bottom-0 right-0 block h-64 w-64 translate-x-32 translate-y-24 rounded-full bg-gradient-to-br from-[#6d5dfc] to-purple-500 opacity-50 blur-3xl transition-all duration-700 group-hover:translate-x-10 group-hover:translate-y-10 group-hover:opacity-80"></span>
                <span className="relative z-10">Proceed to Checkout</span>
              </button>
              
              <p className="text-[11px] text-gray-400 font-medium text-center mt-4">
                Taxes and shipping calculated at checkout.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Cart;
