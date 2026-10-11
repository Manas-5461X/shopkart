import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import OrderStatusStepper from '../components/OrderStatusStepper.jsx';
import toast from 'react-hot-toast';

const STATUS_STEPS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/api/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error("Failed to fetch order details", err);
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const handleAdminStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await axiosInstance.patch(`/api/orders/${order._id}/status`, { status: newStatus });
      toast.success(res.data.message || `Status updated to ${newStatus}`);
      setOrder(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error(err.response?.data?.message || "Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600 bg-green-50 border-green-200';
      case 'SHIPPED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'CONFIRMED': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'PLACED': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'PENDING_PAYMENT': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] text-[#111]">
        <header className="border-b border-black/[0.06] bg-white sticky top-0 z-50">
          <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-5">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </header>
        <div className="py-12 px-5">
          <div className="mx-auto max-w-[900px]">
            <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="flex gap-3">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1 ml-auto"></div>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse ml-auto"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-black/[0.06] shadow-xl shadow-black/[0.02]">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="flex gap-4 items-center p-4 rounded-2xl bg-[#f7f7f5] border border-black/[0.03]">
                        <div className="h-16 w-16 bg-gray-200 rounded-xl animate-pulse shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="text-right">
                          <div className="h-3 w-12 bg-gray-200 rounded animate-pulse mb-1 ml-auto"></div>
                          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-black/[0.06] flex justify-between items-center">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-[24px] border border-black/[0.06] shadow-xl shadow-black/[0.02]">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mt-2"></div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-black/[0.06] shadow-xl shadow-black/[0.02]">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111]">
      <header className="border-b border-black/[0.06] bg-white sticky top-0 z-50">
        <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-5">
          <Link to="/" className="text-[25px] font-black tracking-[-0.06em]">
            Shop<span className="text-[#6d5dfc]">Kart</span>
          </Link>
          <div className="flex items-center gap-4">
            {user?.isAdmin && (
              <Link 
                to="/admin" 
                className="px-3.5 py-1.5 rounded-full bg-purple-50 text-[#6d5dfc] hover:bg-purple-100 text-xs font-bold transition flex items-center gap-1.5 border border-purple-200/60"
              >
                <span>⚡ Admin Portal</span>
              </Link>
            )}
            <Link to="/orders" className="text-sm font-bold text-gray-500 hover:text-[#111] transition flex items-center gap-2">
              ← Back to Orders
            </Link>
          </div>
        </div>
      </header>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-200 to-purple-200 rounded-full blur-[100px] opacity-20 pointer-events-none -translate-y-1/4 translate-x-1/4"></div>

      <div className="py-12 px-5 relative z-10">
        <div className="mx-auto max-w-[900px]">
          
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Order Details</h1>
              <div className="flex items-center gap-3">
                <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">ID: {order._id}</p>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm font-bold text-gray-500 mb-1">Order Date</p>
              <p className="text-xl font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Visual Order Progression Stepper */}
          <div className="mb-8 bg-white p-6 sm:p-8 rounded-[32px] border border-black/[0.06] shadow-xl shadow-black/[0.02]">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6 pb-4 border-b border-black/[0.05]">
              <div>
                <h3 className="text-sm font-black tracking-widest uppercase text-gray-400">Order Progression</h3>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">Live status tracking for this purchase</p>
              </div>

              {/* Admin Quick Control if user is Admin */}
              {user?.isAdmin && (
                <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-purple-50/70 border border-purple-200/50">
                  <span className="text-[10px] font-black uppercase text-[#6d5dfc] tracking-wider">Admin Control:</span>
                  <select
                    value={order.status}
                    disabled={isUpdatingStatus}
                    onChange={(e) => handleAdminStatusChange(e.target.value)}
                    className="rounded-lg border border-purple-200 bg-white px-2.5 py-1 text-xs font-bold text-gray-800 outline-none cursor-pointer"
                  >
                    {STATUS_STEPS.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <OrderStatusStepper currentStatus={order.status} compact={false} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Items */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-black/[0.06] shadow-xl shadow-black/[0.02]">
                <h3 className="text-sm font-black tracking-widest uppercase text-gray-400 mb-6">Items Included ({order.items.length})</h3>
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item._id} className="flex gap-4 items-center p-4 rounded-2xl bg-[#f7f7f5] border border-black/[0.03]">
                      <div className="h-16 w-16 shrink-0 bg-white rounded-xl overflow-hidden shadow-sm">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xl">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product}`} className="text-base font-bold text-gray-900 hover:text-[#6d5dfc] transition line-clamp-1">{item.name}</Link>
                        <p className="text-xs font-medium text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold mb-0.5">₹{item.price} each</p>
                        <div className="font-black text-[#111]">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-black/[0.06] flex justify-between items-center">
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Order Total</p>
                  <p className="text-3xl font-black">₹{order.totalAmount}</p>
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[24px] border border-black/[0.06] shadow-xl shadow-black/[0.02]">
                <h3 className="text-sm font-black tracking-widest uppercase text-gray-400 mb-4 flex items-center gap-2">
                  <span>📍</span> Shipping Address
                </h3>
                {order.shippingAddress ? (
                  <div className="text-sm font-medium text-gray-700 leading-relaxed">
                    <p className="font-bold text-gray-900 mb-2">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                    <p className="mt-3 text-gray-500">📞 {order.shippingAddress.phone}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No shipping address recorded.</p>
                )}
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-black/[0.06] shadow-xl shadow-black/[0.02]">
                <h3 className="text-sm font-black tracking-widest uppercase text-gray-400 mb-4 flex items-center gap-2">
                  <span>💳</span> Payment Info
                </h3>
                <div className="text-sm font-medium text-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Method</span>
                    <span className="font-bold text-gray-900">Razorpay</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  {order.razorpayPaymentId && (
                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Transaction ID</p>
                      <p className="text-xs font-mono text-gray-600 break-all">{order.razorpayPaymentId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
