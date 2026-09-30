import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios.js';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

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
    
    const timeoutId = setTimeout(() => {
        loadProducts();
    }, 300);
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
          <div className="ml-auto">
            <Link to="/" className="text-[13px] font-semibold text-gray-700 transition hover:text-[#6d5dfc]">
              Back to Home
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
            <option value="Clothing">Clothing</option>
            <option value="Home Appliances">Home Appliances</option>
            <option value="Books">Books</option>
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
        )}
      </main>
    </div>
  );
};

export default Products;
