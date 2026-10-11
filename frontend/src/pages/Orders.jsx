import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../axiosCalls/axios.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import OrderStatusStepper from '../components/OrderStatusStepper.jsx';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/api/orders');
        setOrders(res.data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
          <div className="mx-auto max-w-[800px]">
            <div className="mb-10 flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gray-200 animate-pulse"></div>
              <div>
                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-60 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-[24px] border border-black/[0.06] shadow-xl shadow-black/[0.02] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="flex-1">
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="flex">
                      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse -ml-3"></div>
                      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse -ml-3"></div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-4 w-full sm:w-auto">
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111]">
      {/* Header */}
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
            <Link to="/" className="text-sm font-bold text-gray-500 hover:text-[#111] transition flex items-center gap-2">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Decorative Background Blob */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-200 via-blue-200 to-transparent rounded-full blur-[100px] opacity-20 pointer-events-none -translate-y-1/3 -translate-x-1/3"></div>

      <div className="py-12 px-5 relative z-10">
        <div className="mx-auto max-w-[800px]">
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
              <span className="text-2xl">🛍️</span>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                My Orders
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-1">Track and review your recent purchases.</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-[32px] border border-black/[0.06] shadow-sm text-center">
              <div className="text-4xl mb-4">🛒</div>
              <h2 className="text-xl font-bold mb-2">No orders yet</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't made your first purchase.</p>
              <Link to="/products" className="inline-block rounded-full bg-black px-8 py-3 text-sm font-bold text-white transition hover:bg-[#6d5dfc]">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order._id} className="bg-white rounded-[24px] border border-black/[0.06] shadow-xl shadow-black/[0.02] overflow-hidden">
                  
                  {/* Compact Order Summary */}
                  <div className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order #{order._id.slice(-6)}</p>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="font-bold text-lg text-gray-900 mb-4">
                        <span className="text-gray-400 font-medium mr-2 text-sm">Placed on</span>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      
                      {/* Overlapping Item Avatars */}
                      <div className="flex items-center">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={item._id} className={`h-10 w-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm ${idx !== 0 ? '-ml-3' : ''} relative z-[${10 - idx}]`}>
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-xs">📦</div>
                            )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-100 text-gray-500 font-bold text-xs flex items-center justify-center -ml-3 z-0">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Total & Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-0 border-black/5 pt-4 sm:pt-0 gap-4">
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-bold text-gray-500 mb-0.5">Total</p>
                        <p className="text-xl font-black text-[#111]">₹{order.totalAmount}</p>
                      </div>
                      <Link 
                        to={`/orders/${order._id}`}
                        className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-black hover:text-white text-sm font-bold transition-all text-[#111] border border-transparent hover:shadow-lg inline-block"
                      >
                        View Details
                      </Link>
                    </div>

                  </div>

                  {/* Visual Status Progression Tracker */}
                  <div className="border-t border-black/[0.04] bg-[#fafaf9] px-6 sm:px-8 py-4">
                    <OrderStatusStepper currentStatus={order.status} compact={true} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Orders;
