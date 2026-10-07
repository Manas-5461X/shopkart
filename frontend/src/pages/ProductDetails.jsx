import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios.js';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingWishlist, setSavingWishlist] = useState(false);

  const handleAddToWishlist = async () => {
    setSavingWishlist(true);
    try {
      await axiosInstance.post(`/wishlist/${id}`);
      toast.success("Added to Wishlist");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Product already in wishlist");
      } else {
        toast.error("Unable to save product. Please try again.");
      }
    } finally {
      setSavingWishlist(false);
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        setError('Something went wrong while loading the product.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <p className="text-sm font-semibold text-gray-500 animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex flex-col items-center justify-center">
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <Link to="/products" className="text-sm font-semibold text-[#6d5dfc] hover:underline">← Back to Products</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex flex-col items-center justify-center">
        <p className="text-xl font-bold mb-4 text-[#111]">Product not found.</p>
        <Link to="/products" className="text-sm font-semibold text-[#6d5dfc] hover:underline">← Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111]">

      {/* HEADER NAVBAR*/}
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#f7f7f5]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center px-5 sm:px-8">
          <Link to="/" className="text-[25px] font-black tracking-[-0.06em]">
            Shop<span className="text-[#6d5dfc]">Kart</span>
          </Link>
          <div className="ml-auto flex gap-6 items-center">
            <Link to="/wishlist" className="text-[13px] font-bold text-gray-700 hover:text-red-500 transition flex items-center gap-1">
              <span>♡</span> Wishlist
            </Link>
            <Link to="/" className="text-[13px] font-semibold text-gray-700 transition hover:text-[#6d5dfc]">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 lg:py-16">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 transition hover:text-[#6d5dfc] mb-10"
        >
          <span>←</span> Back to Products
        </Link>

        <div className="grid gap-10 md:grid-cols-2 lg:gap-16 items-start">

          {/* Image Gallery Side */}
          <div className="relative overflow-hidden rounded-[28px] bg-[#f1f1ef] p-4 sm:p-8">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-contain aspect-square rounded-xl shadow-sm mix-blend-multiply"
            />
            {product.stock === 0 && (
              <span className="absolute top-6 left-6 rounded-full bg-red-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-red-700">
                Out of Stock
              </span>
            )}
          </div>

          {/* Product Info Side */}
          <div className="flex flex-col pt-2 md:pt-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6d5dfc] mb-3">
              {product.category}
            </p>

            <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-5xl mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-black">₹{product.price}</span>
            </div>

            <div className="h-px w-full bg-black/5 mb-8"></div>

            <h3 className="text-sm font-bold mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="mt-auto space-y-4">
              <div className="flex items-center justify-between text-sm font-semibold mb-4">
                <span className="text-gray-500">Availability</span>
                {product.stock > 0 ? (
                  <span className="text-green-600 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    In Stock ({product.stock} units)
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  disabled={product.stock === 0}
                  className="flex-1 rounded-full bg-black py-4 text-sm font-bold text-white transition hover:bg-[#6d5dfc] disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:bg-black"
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  onClick={handleAddToWishlist}
                  disabled={savingWishlist}
                  className="w-[56px] h-[56px] flex items-center justify-center rounded-full border-2 border-black/10 bg-white text-gray-400 hover:text-red-500 hover:border-red-500 transition disabled:opacity-50 text-xl flex-shrink-0"
                >
                  {savingWishlist ? "⏳" : "♡"}
                </button>
              </div>

              <div className="flex justify-center gap-6 pt-4 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1">🚚 Free Delivery</span>
                <span className="flex items-center gap-1">🛡️ 7-Day Returns</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProductDetails;