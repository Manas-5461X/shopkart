import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios.js';
import toast from 'react-hot-toast';

const STATUS_STEPS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL_ACTIVE');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async (showToast = false) => {
    if (showToast) setIsRefreshing(true);
    try {
      const res = await axiosInstance.get('/api/orders/admin/all');
      setOrders(res.data.orders || []);
      if (showToast) {
        toast.success("Orders refreshed successfully");
      }
    } catch (err) {
      console.error("Failed to load admin orders", err);
      toast.error(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
      if (showToast) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    if (!STATUS_STEPS.includes(newStatus)) return;
    setUpdatingId(orderId);
    try {
      const res = await axiosInstance.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      toast.success(res.data.message || `Status updated to ${newStatus}`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    setDeletingId(orderToDelete._id);
    try {
      await axiosInstance.delete(`/api/orders/admin/${orderToDelete._id}`);
      toast.success("Order deleted successfully");
      setOrders(prev => prev.filter(o => o._id !== orderToDelete._id));
      setOrderToDelete(null);
    } catch (err) {
      console.error("Failed to delete order", err);
      toast.error(err.response?.data?.message || "Failed to delete order");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200/50';
      case 'SHIPPED':
        return 'text-blue-700 bg-blue-50 border-blue-200 ring-1 ring-blue-200/50';
      case 'CONFIRMED':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200/50';
      case 'PLACED':
        return 'text-purple-700 bg-purple-50 border-purple-200 ring-1 ring-purple-200/50';
      case 'PENDING_PAYMENT':
        return 'text-amber-700 bg-amber-50 border-amber-200 ring-1 ring-amber-200/50';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getNextStatus = (currentStatus) => {
    const idx = STATUS_STEPS.indexOf(currentStatus);
    if (idx >= 0 && idx < STATUS_STEPS.length - 1) {
      return STATUS_STEPS[idx + 1];
    }
    return null;
  };

  // Filter calculations
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING_PAYMENT').length;
  // Truly Active orders are in-flight fulfillment: PLACED, CONFIRMED, SHIPPED
  const activeOrdersCount = orders.filter(o => ['PLACED', 'CONFIRMED', 'SHIPPED'].includes(o.status)).length;
  const placedCount = orders.filter(o => o.status === 'PLACED').length;
  const confirmedCount = orders.filter(o => o.status === 'CONFIRMED').length;
  const shippedCount = orders.filter(o => o.status === 'SHIPPED').length;
  const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;

  const filteredOrders = orders.filter(order => {
    let matchesFilter = true;
    if (filterStatus === 'ALL_ACTIVE') {
      matchesFilter = ['PLACED', 'CONFIRMED', 'SHIPPED'].includes(order.status);
    } else if (filterStatus === 'ARCHIVE' || filterStatus === 'DELIVERED') {
      matchesFilter = order.status === 'DELIVERED';
    } else if (filterStatus === 'PENDING_PAYMENT') {
      matchesFilter = order.status === 'PENDING_PAYMENT';
    } else if (filterStatus === 'ALL') {
      matchesFilter = true;
    } else {
      matchesFilter = order.status === filterStatus;
    }

    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Calculate statistics (only from genuine paid/placed orders)
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' && o.status !== 'PENDING_PAYMENT' ? o.totalAmount : 0), 0);

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

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1300px] px-5 py-10">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-black/[0.08] pb-4 mb-8">
          <button
            className="px-4 py-2 text-xs font-bold rounded-xl bg-black text-white shadow-sm transition"
          >
            📦 Orders Management
          </button>
          <Link
            to="/admin/products"
            className="px-4 py-2 text-xs font-bold rounded-xl text-gray-500 hover:text-black hover:bg-gray-100 transition"
          >
            🏷️ Products & Inventory Management
          </Link>
        </div>
        
        {/* Title & Description */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              Order Management
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Active order progression lifecycle: <span className="font-semibold text-gray-800">PLACED → CONFIRMED → SHIPPED → DELIVERED</span>
            </p>
          </div>

          <button 
            onClick={() => fetchOrders(true)}
            disabled={isRefreshing}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-white border border-black/[0.08] hover:border-black/20 text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            title="Refresh orders from database"
          >
            <span className={`inline-block ${isRefreshing ? 'animate-spin' : ''}`}>🔄</span> 
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Orders'}</span>
          </button>
        </div>

        {/* Analytics / Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-black/[0.06] shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Active In-Flight</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{activeOrdersCount}</p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-black/[0.06] shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-purple-500">Placed</p>
            <p className="text-2xl font-black text-purple-700 mt-1">{placedCount}</p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-black/[0.06] shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-indigo-500">Confirmed</p>
            <p className="text-2xl font-black text-indigo-700 mt-1">{confirmedCount}</p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-black/[0.06] shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-blue-500">Shipped</p>
            <p className="text-2xl font-black text-blue-700 mt-1">{shippedCount}</p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-black/[0.06] shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-emerald-500">Archived (Delivered)</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{deliveredCount}</p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-black/[0.06] shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Total Revenue</p>
            <p className="text-2xl font-black text-gray-900 mt-1">₹{totalRevenue}</p>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-white p-4 sm:p-6 rounded-[24px] border border-black/[0.06] shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL_ACTIVE', label: `Active In-Flight (${activeOrdersCount})` },
              { id: 'PLACED', label: `Placed (${placedCount})` },
              { id: 'CONFIRMED', label: `Confirmed (${confirmedCount})` },
              { id: 'SHIPPED', label: `Shipped (${shippedCount})` },
              { id: 'ARCHIVE', label: `📁 Archive / Delivered (${deliveredCount})` },
              { id: 'PENDING_PAYMENT', label: `Unpaid/Failed (${pendingOrdersCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-black text-white shadow-md'
                    : tab.id === 'PENDING_PAYMENT' && pendingOrdersCount > 0
                    ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
                    : tab.id === 'ARCHIVE'
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, name, email..."
              className="w-full rounded-full border border-black/10 bg-[#f7f7f5] px-4 py-2 pl-9 text-xs font-medium text-gray-800 placeholder-gray-400 outline-none focus:border-black/30 focus:bg-white transition"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">⌕</span>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Order Listings */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[24px] border border-black/[0.06] p-6 sm:p-8 animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-16 w-full bg-gray-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-black/[0.06] p-12 text-center shadow-sm">
            <span className="text-4xl">📦</span>
            <h3 className="text-lg font-bold text-gray-900 mt-3">No orders found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {filterStatus !== 'ALL_ACTIVE' || searchTerm 
                ? 'Try adjusting your filter tab or search keywords.' 
                : 'No active placed orders at this moment.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => {
              const isPendingPayment = order.status === 'PENDING_PAYMENT';
              const nextStatus = getNextStatus(order.status);
              const isUpdating = updatingId === order._id;
              const isDeleting = deletingId === order._id;

              return (
                <div 
                  key={order._id}
                  className={`bg-white rounded-[28px] border shadow-xl shadow-black/[0.02] overflow-hidden transition hover:shadow-black/[0.04] ${
                    isPendingPayment ? 'border-amber-200 ring-1 ring-amber-100' : 'border-black/[0.06]'
                  }`}
                >
                  {/* Top Bar of Card */}
                  <div className={`border-b px-6 py-4 flex flex-wrap justify-between items-center gap-3 ${
                    isPendingPayment ? 'bg-amber-50/50 border-amber-100' : 'bg-[#fafaf9] border-black/[0.05]'
                  }`}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase">
                        Order #{order._id}
                      </span>
                      <span className="text-xs font-medium text-gray-400">•</span>
                      <span className="text-xs font-semibold text-gray-600">
                        {new Date(order.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Current Status:</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                      {order.status === 'DELIVERED' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                          📁 ARCHIVED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main Card Content */}
                  <div className="p-6 sm:p-8">
                    
                    {/* Status Progression Section */}
                    {isPendingPayment ? (
                      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">⚠️</span>
                          <div>
                            <p className="text-xs font-bold text-amber-900">
                              Incomplete Checkout / Payment Cancelled or Failed
                            </p>
                            <p className="text-[11px] text-amber-700 mt-0.5">
                              The customer did not complete payment. This order was never placed.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setOrderToDelete(order)}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
                        >
                          🗑️ Delete / Discard Order
                        </button>
                      </div>
                    ) : (
                      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#f7f7f5] border border-black/[0.03]">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Status Progression</span>
                          <span className="text-xs font-bold text-gray-500">
                            Step {Math.max(1, STATUS_STEPS.indexOf(order.status) + 1)} of {STATUS_STEPS.length}
                          </span>
                        </div>

                        <div className="relative flex items-center justify-between">
                          {/* Connecting background bar */}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-full bg-gray-200 rounded-full z-0"></div>
                          
                          {/* Connecting filled bar */}
                          {STATUS_STEPS.indexOf(order.status) >= 0 && (
                            <div 
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-[#6d5dfc] rounded-full transition-all duration-500 z-0"
                              style={{ 
                                width: `${(STATUS_STEPS.indexOf(order.status) / (STATUS_STEPS.length - 1)) * 100}%` 
                              }}
                            ></div>
                          )}

                          {STATUS_STEPS.map((st, idx) => {
                            const currentIdx = STATUS_STEPS.indexOf(order.status);
                            const isDone = currentIdx >= idx;
                            const isCurrent = currentIdx === idx;

                            return (
                              <div key={st} className="relative z-10 flex flex-col items-center">
                                <button
                                  onClick={() => handleStatusChange(order._id, st)}
                                  disabled={isUpdating}
                                  title={`Set status to ${st}`}
                                  className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm cursor-pointer ${
                                    isCurrent
                                      ? 'bg-[#6d5dfc] text-white ring-4 ring-purple-100 scale-110'
                                      : isDone
                                      ? 'bg-black text-white hover:bg-gray-800'
                                      : 'bg-white text-gray-400 border border-gray-300 hover:border-gray-500'
                                  }`}
                                >
                                  {isDone && !isCurrent ? '✓' : idx + 1}
                                </button>
                                <span className={`text-[10px] font-bold mt-2 tracking-tight ${
                                  isCurrent ? 'text-[#6d5dfc]' : isDone ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                  {st}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                      
                      {/* Customer Info */}
                      <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">👤 Customer Details</p>
                        <p className="text-sm font-bold text-gray-900">{order.user?.fullname || order.user?.fullName || 'Registered User'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{order.user?.email || 'No email'}</p>
                        {order.user?.phone && (
                          <p className="text-xs text-gray-500 mt-0.5">📞 {order.user.phone}</p>
                        )}
                      </div>

                      {/* Shipping Info */}
                      <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">📍 Shipping Address</p>
                        {order.shippingAddress ? (
                          <div className="text-xs text-gray-700 leading-relaxed">
                            <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.addressLine1}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                            <p className="text-gray-500 mt-1">📞 {order.shippingAddress.phone}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">No address recorded</p>
                        )}
                      </div>

                      {/* Payment Info & Total */}
                      <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">💳 Payment Summary</p>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">Payment Status</span>
                          <span className={`text-xs font-bold ${order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-500">Total Amount</span>
                          <span className="text-lg font-black text-gray-900">₹{order.totalAmount}</span>
                        </div>
                        {order.razorpayPaymentId ? (
                          <p className="text-[10px] font-mono text-gray-400 truncate border-t border-gray-100 pt-1 mt-1">
                            Txn: {order.razorpayPaymentId}
                          </p>
                        ) : (
                          <p className="text-[10px] text-amber-600 italic border-t border-gray-100 pt-1 mt-1">
                            Payment incomplete / not received
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mb-6">
                      <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">
                        Items Ordered ({order.items.length})
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#fafaf9] border border-black/[0.04]">
                            <div className="h-12 w-12 rounded-lg bg-white overflow-hidden shadow-xs shrink-0 flex items-center justify-center">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-base">📦</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                              <p className="text-[11px] text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Admin Actions Bar */}
                    <div className="border-t border-black/[0.06] pt-5 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                      {isPendingPayment ? (
                        <div className="flex items-center gap-2 text-xs text-amber-700 font-medium">
                          <span>ℹ️ This order was not paid and is not active in fulfillment.</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-bold text-gray-600">Quick Change:</label>
                          <select
                            value={order.status}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-gray-800 outline-none shadow-xs hover:border-black/30 focus:border-[#6d5dfc] transition disabled:opacity-50 cursor-pointer"
                          >
                            {STATUS_STEPS.map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <button
                          onClick={() => setOrderToDelete(order)}
                          className="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 text-xs font-bold transition cursor-pointer"
                        >
                          Delete
                        </button>

                        <Link
                          to={`/orders/${order._id}`}
                          className="px-4 py-2 rounded-xl border border-black/10 hover:bg-gray-50 text-xs font-bold text-gray-700 transition"
                        >
                          View Details
                        </Link>

                        {!isPendingPayment && (
                          nextStatus ? (
                            <button
                              onClick={() => handleStatusChange(order._id, nextStatus)}
                              disabled={isUpdating}
                              className="px-5 py-2 rounded-xl bg-black hover:bg-[#6d5dfc] text-white text-xs font-bold shadow-md transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                            >
                              {isUpdating ? (
                                <span>Updating...</span>
                              ) : (
                                <span>Advance to {nextStatus} →</span>
                              )}
                            </button>
                          ) : (
                            <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                              Order Completed ✓
                            </span>
                          )
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Luxury Custom Delete Confirmation Modal */}
      {orderToDelete && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
          onClick={() => !deletingId && setOrderToDelete(null)}
        >
          <div 
            className="w-full max-w-[430px] rounded-[32px] bg-white p-7 sm:p-8 shadow-2xl border border-black/[0.08] relative transform transition-all animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Red Alert Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100 mb-5">
              <span className="text-2xl">🗑️</span>
            </div>

            {/* Modal Title & Message */}
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">
              Delete Order Record?
            </h3>
            <p className="text-xs sm:text-sm font-medium text-gray-500 leading-relaxed mb-4">
              Are you sure you want to delete this order? This action will permanently remove it from the database.
            </p>

            {/* Order Snippet Summary */}
            <div className="rounded-2xl bg-[#f7f7f5] p-4 mb-6 border border-black/[0.04]">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-mono font-bold text-gray-700">
                  #{orderToDelete._id}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusBadge(orderToDelete.status)}`}>
                  {orderToDelete.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-800">
                  {orderToDelete.user?.fullname || orderToDelete.shippingAddress?.fullName || 'Customer'}
                </span>
                <span className="font-black text-gray-900">
                  ₹{orderToDelete.totalAmount}
                </span>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                disabled={deletingId === orderToDelete._id}
                className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteOrder}
                disabled={deletingId === orderToDelete._id}
                className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-500/20 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {deletingId === orderToDelete._id ? (
                  <>
                    <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Order</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
