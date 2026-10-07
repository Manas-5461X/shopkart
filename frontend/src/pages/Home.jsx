import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { axiosInstance } from '../axiosCalls/axios.js';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const categories = [
  { name: "Electronics", filter: "Electronics", icon: "◉" },
  { name: "Fashion", filter: "Fashion", icon: "◇" },
  { name: "Home", filter: "Home", icon: "⌂" },
  { name: "Books", filter: "Books", icon: "✦" },
  { name: "Other", filter: "Other", icon: "○" }
];

function Home() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { checkAuth, user } = useContext(AuthContext);
  const { cart, cartCount, addToCart, updateQuantity, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [savingWishlist, setSavingWishlist] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [animateBadge, setAnimateBadge] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(cartCount);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (cartCount > prevCartCount) {
      setAnimateBadge(true);
    }
    setPrevCartCount(cartCount);
  }, [cartCount]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');
        //to display the first 4 products on the home page
        setProducts(response.data.products.slice(0, 4));
      } catch (error) {
        console.error("Error fetching products for home page", error);
      }
    };
    const fetchWishlist = async () => {
      if (user) {
        try {
          const res = await axiosInstance.get('/wishlist');
          setWishlistItems(res.data.wishlist.map(item => item._id || item));
        } catch (error) {
          console.error("Error fetching wishlist", error);
        }
      }
    };
    fetchProducts();
    fetchWishlist();
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const res = await fetch("/customers/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      console.log("Logout response:", data);
      await checkAuth(); // Clear user from context
      toast.success(data.message || "Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      await checkAuth(); // Ensure user is cleared even if network fails
      toast.success("Logged out / session cleared");
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleToggleWishlist = async (e, productId) => {
    e.preventDefault(); // Prevents navigating to product details link
    if (!user) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }
    
    setSavingWishlist(productId);
    const isWishlisted = wishlistItems.includes(productId);
    
    try {
      if (isWishlisted) {
        await axiosInstance.delete(`/wishlist/${productId}`);
        setWishlistItems(prev => prev.filter(id => id !== productId));
        toast.success("Removed from Wishlist");
      } else {
        await axiosInstance.post(`/wishlist/${productId}`);
        setWishlistItems(prev => [...prev, productId]);
        toast.success("Added to Wishlist"); 
      }
    } catch (error) {
      toast.error("Unable to update wishlist. Please try again.");
    } finally {
      setSavingWishlist(null);
    }
  };

  const handleAddToCart = async (e, productId) => {
    e.preventDefault(); // Prevents navigating to product details link
    setAddingToCart(productId);
    await addToCart(productId);
    setAddingToCart(null);
  };

  const handleUpdateQuantity = async (e, productId, quantity) => {
    e.preventDefault();
    if (quantity === 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, quantity);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111]">

      {/* TOP ANNOUNCEMENT */}
      {showAnnouncement && (
        <div className="bg-[#111] px-4 py-2 text-center text-[11px] font-medium tracking-[0.18em] text-white relative">
          FREE SHIPPING ON ORDERS OVER ₹999
          <button 
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition text-sm font-black"
          >
            ✕
          </button>
        </div>
      )}

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#f7f7f5]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center px-5 sm:px-8">

          <Link to="/" className="text-[25px] font-black tracking-[-0.06em]">
            Shop<span className="text-[#6d5dfc]">Kart</span>
          </Link>

          <nav className="ml-14 hidden items-center gap-9 text-[13px] font-medium lg:flex">
            <button onClick={() => scrollToSection('trending')} className="transition hover:text-[#6d5dfc]">Trending</button>
            <button onClick={() => scrollToSection('offers')} className="font-semibold text-[#6d5dfc] transition hover:text-purple-600">Offers</button>
          </nav>

          <div className="ml-auto flex items-center gap-3 sm:gap-6">

            {/* SEARCH */}
            <form onSubmit={handleSearch} className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-gray-500 transition hover:border-black/20 md:flex">
              <span>⌕</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products"
                className="bg-transparent outline-none w-48 text-gray-700 placeholder-gray-400"
              />
            </form>

            {user ? (
              <div className="group relative z-50">
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-[15px] font-bold text-gray-700 transition hover:bg-gray-200 uppercase">
                  {(user?.fullname || user?.fullName)?.charAt(0) || "👤"}
                </button>

                <div className="invisible absolute right-0 top-full mt-2 w-64 translate-y-2 rounded-2xl border border-black/[0.08] bg-white p-2 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="mb-2 flex items-center gap-3 border-b border-gray-100 px-3 pb-3 pt-2">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f1efff] text-lg font-bold uppercase text-[#6d5dfc]">
                      {(user?.fullname || user?.fullName)?.charAt(0) || "👤"}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <p className="truncate text-sm font-bold text-gray-900">{user?.fullname || user?.fullName}</p>
                      <p className="truncate text-[12px] text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  
                  <Link to="/profile" className="block w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-[#6d5dfc]">
                    Edit Profile
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="block w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden text-[13px] font-semibold text-gray-700 transition hover:text-[#6d5dfc] sm:block"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden text-[13px] font-semibold text-gray-700 transition hover:text-[#6d5dfc] sm:block"
                >
                  Register
                </Link>
              </>
            )}

            <Link to="/wishlist" className="relative text-[21px] transition hover:scale-105">
              ♡
            </Link>

            <Link to="/cart" className="relative text-[20px] transition hover:scale-105">
              🛒
              {cartCount > 0 && (
                <span 
                  onAnimationEnd={() => setAnimateBadge(false)}
                  className={`absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#6d5dfc] px-1 text-[9px] font-bold text-white ${animateBadge ? 'animate-bounce-pop' : ''}`}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-xl lg:hidden transition-transform active:scale-95"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 top-[76px] w-full border-b border-black/[0.06] bg-[#f7f7f5] p-5 shadow-2xl lg:hidden animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
            <div className="flex flex-col gap-6">
              {/* MOBILE SEARCH */}
              <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-gray-500 transition focus-within:border-[#6d5dfc]">
                <span>⌕</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products"
                  className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
                />
              </form>

              <nav className="flex flex-col text-[15px] font-bold text-gray-800">
                <button onClick={() => { scrollToSection('trending'); setIsMobileMenuOpen(false); }} className="border-b border-black/[0.06] py-4 text-left transition active:bg-black/5">Trending</button>
                <button onClick={() => { scrollToSection('offers'); setIsMobileMenuOpen(false); }} className="border-b border-black/[0.06] py-4 text-left text-[#6d5dfc] transition active:bg-black/5">Offers</button>
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-black/[0.06] py-4 text-left transition active:bg-black/5">All Products</Link>
                
                {!user && (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-black/[0.06] py-4 text-left transition active:bg-black/5">Login</Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-black/[0.06] py-4 text-left transition active:bg-black/5">Register</Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      <main>

        {/* HERO */}
        <section className="mx-auto max-w-[1400px] px-4 pt-5 sm:px-8 lg:pt-8 animate-fade-in-up">
          <div className="relative min-h-[540px] overflow-hidden rounded-[28px] bg-[#151515]">

            {/* Background image */}
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800"
              alt="ShopKart collection"
              className="absolute inset-0 h-full w-full object-cover opacity-55"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

            <div className="relative z-10 flex min-h-[540px] items-center px-7 py-16 sm:px-14 lg:px-20">

              <div className="max-w-[620px] text-white">

                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-10 bg-white/70" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/75">
                    The new collection
                  </span>
                </div>

                <h1 className="text-[48px] font-black leading-[0.98] tracking-[-0.055em] sm:text-[64px] lg:text-[78px]">
                  Better things.
                  <br />
                  <span className="text-white/55">Better prices.</span>
                </h1>

                <p className="mt-7 max-w-[500px] text-[15px] leading-7 text-white/70 sm:text-[17px]">
                  Discover products designed to make everyday life better.
                  Curated essentials, standout pieces and unbeatable value.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link to="/products" className="inline-block rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-[#6d5dfc] hover:text-white">
                    Shop collection →
                  </Link>

                  <Link to="/products" className="inline-block rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold backdrop-blur-md transition hover:bg-white/20">
                    Explore deals
                  </Link>
                </div>

              </div>
            </div>

            {/* Hero floating badge */}
            <div className="absolute bottom-7 right-7 hidden rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl md:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                Up to
              </p>
              <p className="mt-1 text-3xl font-black text-white">70%</p>
              <p className="text-xs text-white/60">off selected products</p>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8">
          <div className="grid grid-cols-2 divide-x divide-black/10 border-y border-black/10 py-5 md:grid-cols-4">

            {[
              ["01", "Free shipping", "On orders over ₹999"],
              ["02", "Easy returns", "7-day return policy"],
              ["03", "Secure payments", "100% protected checkout"],
              ["04", "Curated quality", "Products we believe in"],
            ].map(([number, title, text]) => (
              <div
                key={number}
                className="px-4 py-3 first:pl-0 last:pr-0 sm:px-7"
              >
                <div className="mb-2 text-[10px] font-bold tracking-[0.2em] text-[#6d5dfc]">
                  {number}
                </div>
                <p className="text-sm font-bold">{title}</p>
                <p className="mt-1 text-[11px] text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6d5dfc]">
                Browse
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Shop by category
              </h2>
            </div>

            <Link to="/products" className="hidden text-xs font-bold sm:block">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

            {categories.map((category) => (
              <Link
                to={`/products?category=${encodeURIComponent(category.filter)}`}
                key={category.name}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#f1efff] text-lg text-[#6d5dfc] transition group-hover:bg-[#6d5dfc] group-hover:text-white">
                  {category.icon}
                </div>

                <p className="text-sm font-bold">{category.name}</p>

                <span className="absolute bottom-5 right-5 text-xs text-gray-300 transition group-hover:text-[#6d5dfc]">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="trending" className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6d5dfc]">
                Trending now
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Popular picks
              </h2>
            </div>

            <Link to="/products" className="text-xs font-bold hover:text-[#6d5dfc] transition">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">

            {products.map((product) => (
              <article
                key={product._id}
                className="group relative overflow-hidden rounded-2xl bg-white transition duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl flex flex-col border border-gray-200"
              >
                <Link to={`/products/${product._id}`} className="absolute inset-0 z-0">
                  <span className="sr-only">View Details</span>
                </Link>

                <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f1ef]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase shadow-sm z-10">
                    {product.category}
                  </span>
                  <button 
                    onClick={(e) => handleToggleWishlist(e, product._id)}
                    disabled={savingWishlist === product._id}
                    className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 text-gray-400 transition disabled:opacity-50 z-10 flex items-center justify-center text-sm leading-none"
                  >
                    {savingWishlist === product._id ? "⏳" : (
                      <span className={`${wishlistItems.includes(product._id) ? 'text-red-500' : ''}`}>
                        {wishlistItems.includes(product._id) ? '♥' : '♡'}
                      </span>
                    )}
                  </button>
                  <Link to={`/products/${product._id}`} className="absolute inset-0 z-0">
                    <span className="sr-only">View Details</span>
                  </Link>
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[13px] font-bold line-clamp-2">{product.name}</h3>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base font-black">
                      ₹{product.price}
                    </span>
                    <div className="flex items-center gap-3">
                      {(() => {
                        const cartItem = cart.find(item => item.product._id === product._id);
                        if (cartItem) {
                          return (
                            <div className="relative z-10 flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-1.5 py-1 shadow-sm">
                              <button
                                onClick={(e) => handleUpdateQuantity(e, product._id, cartItem.quantity - 1)}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-bold"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold text-gray-800 w-3 text-center">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={(e) => handleUpdateQuantity(e, product._id, cartItem.quantity + 1)}
                                disabled={cartItem.quantity >= product.stock}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 text-sm font-bold"
                              >
                                +
                              </button>
                              <span className="text-[15px] ml-1 mr-1">🛒</span>
                            </div>
                          );
                        }
                        return (
                          <button 
                            onClick={(e) => handleAddToCart(e, product._id)}
                            disabled={addingToCart === product._id || product.stock === 0}
                            className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-[#6d5dfc] hover:text-white transition disabled:opacity-50 text-[15px] leading-none"
                            title="Add to Cart"
                          >
                            {addingToCart === product._id ? "⏳" : "🛒"}
                          </button>
                        );
                      })()}
                      <Link 
                        to={`/products/${product._id}`} 
                        className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition hover:bg-gray-100 hover:text-blue-500"
                        title="View Details"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* BIG PROMO */}
        <section id="offers" className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative overflow-hidden rounded-[28px] bg-[#e8e5ff] px-7 py-12 sm:px-12 lg:px-16 lg:py-16">

            <div className="relative z-10 max-w-xl">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#6d5dfc]">
                Limited time
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                Your cart called.
                <br />
                It wants a discount.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-gray-600">
                Save up to 70% on selected products before the offer
                disappears.
              </p>

              <Link to="/products" className="inline-block mt-7 rounded-full bg-black px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#6d5dfc]">
                Shop the sale →
              </Link>
            </div>

            <div className="absolute -right-20 -top-32 h-[420px] w-[420px] rounded-full border-[70px] border-white/50" />
            <div className="absolute -bottom-40 right-32 h-[320px] w-[320px] rounded-full border-[50px] border-[#6d5dfc]/10" />
          </div>
        </section>

      </main>

    </div>
  );
}

export default Home;


