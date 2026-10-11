import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios.js';
import toast from 'react-hot-toast';

const CATEGORIES = ["Electronics", "Fashion", "Home", "Books", "Other"];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Electronics'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchProducts = async (showToast = false) => {
    if (showToast) setIsRefreshing(true);
    try {
      const res = await axiosInstance.get('/products');
      setProducts(res.data.products || []);
      if (showToast) toast.success("Products refreshed");
    } catch (err) {
      console.error("Failed to fetch products", err);
      toast.error(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
      if (showToast) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'Electronics'
    });
    setImageFile(null);
    setImagePreview(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category
    });
    setImageFile(null);
    setImagePreview(product.image);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      return toast.error("Please fill in product name and description");
    }
    if (Number(formData.price) <= 0) {
      return toast.error("Price must be greater than 0");
    }
    if (Number(formData.stock) < 0) {
      return toast.error("Stock cannot be negative");
    }

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Updating existing product
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        submitData.append('price', formData.price);
        submitData.append('stock', formData.stock);
        submitData.append('category', formData.category);
        if (imageFile) {
          submitData.append('image', imageFile);
        }

        const res = await axiosInstance.put(`/products/${editingProduct._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(res.data.message || "Product updated successfully");
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? res.data.product : p));
        setEditingProduct(null);
      } else {
        // Adding new product
        if (!imageFile) {
          setIsSubmitting(false);
          return toast.error("Product image is required");
        }
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        submitData.append('price', formData.price);
        submitData.append('stock', formData.stock);
        submitData.append('category', formData.category);
        submitData.append('image', imageFile);

        const res = await axiosInstance.post('/products', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(res.data.message || "Product added successfully");
        setProducts(prev => [res.data.product, ...prev]);
        setIsAddModalOpen(false);
      }
    } catch (err) {
      console.error("Save product error", err);
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/products/${productToDelete._id}`);
      toast.success("Product deleted successfully");
      setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
      setProductToDelete(null);
    } catch (err) {
      console.error("Delete product error", err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const totalStockCount = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111]">
      {/* Header */}
      <header className="border-b border-black/[0.06] bg-white sticky top-0 z-50">
        <div className="mx-auto flex h-[76px] max-w-[1300px] items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-[25px] font-black tracking-[-0.06em]">
              Shop<span className="text-[#6d5dfc]">Kart</span>
            </Link>
            <span className="rounded-full bg-black px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="px-4 py-2 rounded-full border border-black/10 text-xs font-bold hover:bg-black hover:text-white transition"
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-[1300px] px-5 py-10">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-black/[0.08] pb-4 mb-8">
          <Link
            to="/admin/orders"
            className="px-4 py-2 text-xs font-bold rounded-xl text-gray-500 hover:text-black hover:bg-gray-100 transition"
          >
            📦 Orders Management
          </Link>
          <button
            className="px-4 py-2 text-xs font-bold rounded-xl bg-black text-white shadow-sm transition"
          >
            🏷️ Products & Inventory Management
          </button>
        </div>

        {/* Title, Search, and Action Buttons */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              Product Catalog
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Add new products, update prices, and manage inventory levels in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchProducts(true)}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl bg-white border border-black/[0.08] hover:border-black/20 text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <span className={isRefreshing ? "animate-spin" : ""}>🔄</span>
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
            <button 
              onClick={openAddModal}
              className="px-5 py-2.5 rounded-xl bg-[#6d5dfc] hover:bg-[#5b4ce6] text-white text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>＋</span>
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Total Products</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{products.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-emerald-500">In-Stock Units</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{totalStockCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-amber-500">Low Stock (≤ 5)</p>
            <p className="text-2xl font-black text-amber-700 mt-1">{lowStockCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-red-500">Out of Stock</p>
            <p className="text-2xl font-black text-red-700 mt-1">{outOfStockCount}</p>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input 
              type="text" 
              placeholder="Search product by title or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs font-medium outline-none focus:border-[#6d5dfc] focus:ring-1 focus:ring-[#6d5dfc] transition shadow-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>

          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs font-bold outline-none focus:border-[#6d5dfc] shadow-sm cursor-pointer"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Products Table / Cards */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-black/[0.06] shadow-sm">
            <div className="animate-spin text-4xl mb-3">🔄</div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-black/[0.06] shadow-sm">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-base font-bold text-gray-800">No products found</h3>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your search filters or click "Add Product" above.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-black/[0.06] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06] bg-gray-50/70 text-[11px] font-black uppercase tracking-wider text-gray-500">
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Stock</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] text-xs font-medium">
                  {filteredProducts.map(product => {
                    const isOutOfStock = product.stock === 0;
                    const isLowStock = product.stock > 0 && product.stock <= 5;

                    return (
                      <tr key={product._id} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-black/[0.08] flex-shrink-0"
                            />
                            <div className="min-w-0 max-w-[260px] sm:max-w-xs">
                              <p className="font-bold text-gray-900 truncate" title={product.name}>{product.name}</p>
                              <p className="text-[11px] text-gray-500 truncate" title={product.description}>{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-black text-gray-900 text-sm">
                          ₹{product.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-4 font-bold text-gray-700">
                          {product.stock} units
                        </td>
                        <td className="py-4 px-4">
                          {isOutOfStock ? (
                            <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                              Low Stock ({product.stock})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#6d5dfc] hover:text-white text-gray-800 text-xs font-bold transition cursor-pointer"
                              title="Edit price, stock, details"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => setProductToDelete(product)}
                              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold transition cursor-pointer"
                              title="Delete product"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-black/[0.08] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingProduct 
                    ? "Updating price will immediately reflect for all users with this item in cart." 
                    : "Add an item to the ShopKart store catalog."}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-medium outline-none focus:border-[#6d5dfc] focus:ring-1 focus:ring-[#6d5dfc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description *</label>
                <textarea 
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed product features, specs, and highlights..."
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-medium outline-none focus:border-[#6d5dfc] focus:ring-1 focus:ring-[#6d5dfc]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Price (₹ INR) *
                    <span className="text-[10px] text-[#6d5dfc] block font-normal">Auto-updates customer carts</span>
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 1999"
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold outline-none focus:border-[#6d5dfc] focus:ring-1 focus:ring-[#6d5dfc]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Available Stock *
                    <span className="text-[10px] text-gray-400 block font-normal">Units in warehouse</span>
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="e.g. 25"
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold outline-none focus:border-[#6d5dfc] focus:ring-1 focus:ring-[#6d5dfc]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-bold outline-none focus:border-[#6d5dfc]"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Image {editingProduct ? "(Optional - keep existing if blank)" : "*"}
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#6d5dfc]/10 file:text-[#6d5dfc] hover:file:bg-[#6d5dfc]/20 cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-3 flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-black/[0.06]">
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-black/[0.08]" />
                    <span className="text-[11px] text-gray-500 font-medium">Image ready for upload</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-black/10 text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#6d5dfc] hover:bg-[#5b4ce6] text-white text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <span className="animate-spin">🔄</span>}
                  <span>{isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-black/[0.08]">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl mx-auto mb-3">
              🗑️
            </div>
            <h3 className="text-base font-black text-gray-900">Delete Product?</h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              Are you sure you want to remove <span className="font-bold text-gray-800">"{productToDelete.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-black/10 text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
