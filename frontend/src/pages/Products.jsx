import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios.js';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext.jsx';

const Products = () => {
  const { cart, cartCount, addToCart, updateQuantity, removeFromCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  // Sync state changes to the URL
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [search, category, sort, setSearchParams]);


  const [savingWishlist, setSavingWishlist] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

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

  const handleToggleWishlist = async (e, productId) => {
    e.preventDefault();
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
      if (error.response?.status === 401) {
        toast.error("Please login to manage wishlist");
      } else {
        toast.error("Unable to update wishlist. Please try again.");
      }
    } finally {
      setSavingWishlist(null);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get('/products', {
          params: { search, category, sort }
        });
        setProducts(response.data.products);
      } catch (err) {
        setError('Something went wrong while loading products.');
      } finally {
        setLoading(false);
      }
    };
    
    // Add a slight debounce to avoid too many API calls while typing
    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 300);
    
    const fetchWishlist = async () => {
      try {
        const res = await axiosInstance.get('/wishlist');
        setWishlistItems(res.data.wishlist.map(item => item._id || item));
      } catch (error) {
        // We fail silently here because if a guest user views the products,
        // the API returns a 401 Unauthorized. We don't want to show an error
        // toast for a missing badge!
        if (error.response?.status !== 401) {
          console.error("Error fetching wishlist count for badge", error);
        }
      }
    };
    fetchWishlist();
    
    return () => clearTimeout(timeoutId);
  }, [search, category, sort]);

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111]">
      
      {/* HEADER NAVBAR (Simplified version for continuity) */}
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#f7f7f5]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center px-5 sm:px-8">
          <Link to="/" className="text-[25px] font-black tracking-[-0.06em]">
            Shop<span className="text-[#6d5dfc]">Kart</span>
          </Link>
          <div className="ml-auto flex gap-6 items-center">
            <Link to="/" className="text-[13px] font-semibold text-gray-700 transition hover:text-[#6d5dfc]">
              Home
            </Link>
            <Link to="/products" className="text-[13px] font-bold text-[#6d5dfc] drop-shadow-sm transition">
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
            <Link to="/cart" className="relative text-[20px] transition hover:scale-105">
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

      <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6d5dfc]">
              Explore
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              All Products
            </h1>
          </div>
        </div>
        
        {/* Search & Filter UI */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full rounded-full border border-black/10 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#6d5dfc] focus:ring-1 focus:ring-[#6d5dfc]"
            />
          </div>
          
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6d5dfc] focus:ring-1 focus:ring-[#6d5dfc] min-w-[160px]"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home">Home</option>
            <option value="Books">Books</option>
            <option value="Other">Other</option>
          </select>
          
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6d5dfc] focus:ring-1 focus:ring-[#6d5dfc] min-w-[160px]"
          >
            <option value="">Sort By</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* State Handling */}
        {loading && (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm font-semibold text-gray-500 animate-pulse">Loading products...</p>
          </div>
        )}
        {error && (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm font-semibold text-red-500">{error}</p>
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-4xl text-gray-300">📦</div>
            <p className="text-lg font-bold text-gray-800">No products found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Product List */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
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
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase shadow-sm z-10 text-gray-700">
                    {product.category}
                  </span>
                  
                  {product.stock === 0 && (
                    <span className="absolute left-4 bottom-4 rounded-full bg-red-100 text-red-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm z-10">
                      Out of stock
                    </span>
                  )}

                  <button 
                    onClick={(e) => handleToggleWishlist(e, product._id)}
                    disabled={savingWishlist === product._id}
                    className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 text-gray-400 transition disabled:opacity-50 z-10 flex items-center justify-center text-lg leading-none"
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

                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between border-t border-black/[0.03] bg-gray-50/30">
                  <div>
                    <h3 className="text-[15px] font-bold line-clamp-2 leading-snug text-gray-900">{product.name}</h3>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-lg font-black text-[#111]">₹{product.price}</span>
                      {product.stock > 0 ? (
                        <span className="text-[11px] font-medium text-green-600">{product.stock} units left</span>
                      ) : (
                        <span className="text-[11px] font-medium text-red-500">Currently unavailable</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {(() => {
                        const cartItem = cart.find(item => item.product._id === product._id);
                        if (cartItem) {
                          return (
                            <div className="relative z-10 flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-1.5 py-1 shadow-sm shrink-0">
                              <button
                                onClick={(e) => handleUpdateQuantity(e, product._id, cartItem.quantity - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-bold"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold text-gray-800 w-3 text-center">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={(e) => handleUpdateQuantity(e, product._id, cartItem.quantity + 1)}
                                disabled={cartItem.quantity >= product.stock}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 text-sm font-bold"
                              >
                                +
                              </button>
                              <span className="text-[17px] ml-1 mr-1">🛒</span>
                            </div>
                          );
                        }
                        return (
                          <button 
                            onClick={(e) => handleAddToCart(e, product._id)}
                            disabled={addingToCart === product._id || product.stock === 0}
                            className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-[#6d5dfc] hover:text-white transition disabled:opacity-50 text-[17px] leading-none shrink-0"
                            title="Add to Cart"
                          >
                            {addingToCart === product._id ? "⏳" : "🛒"}
                          </button>
                        );
                      })()}
                      <Link 
                        to={`/products/${product._id}`} 
                        className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition hover:bg-gray-100 hover:text-blue-500 shrink-0"
                        title="View Details"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
        )}
      </main>
    </div>
  );
};

export default Products;