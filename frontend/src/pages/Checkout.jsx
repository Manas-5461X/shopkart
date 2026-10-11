import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { axiosInstance } from '../axiosCalls/axios.js';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: ''
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      return toast.error("Please fill all required fields.");
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/orders/create-payment-order', {
        shippingAddress: formData
      });
      const data = res.data;

      const resLoaded = await loadRazorpayScript();
      if (!resLoaded) return toast.error("Razorpay SDK failed to load");

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopKart",
        description: "Complete your purchase",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            await axiosInstance.post('/api/orders/verify-payment', {
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            clearCart();
            toast.success("Payment successful!");
            navigate(`/order-success/${data.shopKartOrderId}`);
          } catch (error) {
            toast.error("Payment verification failed.");
          }
        },
        prefill: { name: formData.fullName, contact: formData.phone },
        theme: { color: "#111111" },
        modal: {
          ondismiss: function () {
            toast("Payment window closed");
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
      });
      paymentObject.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return <div className="text-center py-20 font-bold text-xl">Your cart is empty.</div>;

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111]">
      {/* Minimal Checkout Header */}
      <header className="border-b border-black/[0.06] bg-white sticky top-0 z-50">
        <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-5">
          <Link to="/" className="text-[25px] font-black tracking-[-0.06em]">
            Shop<span className="text-[#6d5dfc]">Kart</span>
          </Link>
          <Link to="/cart" className="text-sm font-bold text-gray-500 hover:text-[#111] transition flex items-center gap-2">
            ← Return to Cart
          </Link>
        </div>
      </header>

      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-200 via-blue-200 to-transparent rounded-full blur-[100px] opacity-30 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      <div className="py-6 px-5 relative z-10">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                  Shipping Details
                </h1>
                <p className="text-sm font-medium text-gray-500 mt-0.5">Where should we send your order?</p>
              </div>
            </div>

            <form className="bg-white p-6 sm:p-8 rounded-[24px] border border-black/[0.06] shadow-xl shadow-black/[0.02] flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#111] mb-1.5">Full Name</label>
                  <input placeholder="e.g. Jane Doe" onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 bg-[#f7f7f5] border border-transparent rounded-xl focus:ring-2 focus:ring-[#6d5dfc]/20 focus:border-[#6d5dfc] outline-none transition-all placeholder-gray-400 text-sm font-medium" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#111] mb-1.5">Phone Number</label>
                  <input placeholder="+91 98765 43210" onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-[#f7f7f5] border border-transparent rounded-xl focus:ring-2 focus:ring-[#6d5dfc]/20 focus:border-[#6d5dfc] outline-none transition-all placeholder-gray-400 text-sm font-medium" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#111] mb-1.5">Pincode</label>
                  <input placeholder="e.g. 400001" onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full px-4 py-3 bg-[#f7f7f5] border border-transparent rounded-xl focus:ring-2 focus:ring-[#6d5dfc]/20 focus:border-[#6d5dfc] outline-none transition-all placeholder-gray-400 text-sm font-medium" />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#111] mb-1.5">Address Line 1</label>
                  <input placeholder="House No, Building, Street Area" onChange={e => setFormData({...formData, addressLine1: e.target.value})} className="w-full px-4 py-3 bg-[#f7f7f5] border border-transparent rounded-xl focus:ring-2 focus:ring-[#6d5dfc]/20 focus:border-[#6d5dfc] outline-none transition-all placeholder-gray-400 text-sm font-medium" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#111] mb-1.5">City</label>
                  <input placeholder="City" onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-[#f7f7f5] border border-transparent rounded-xl focus:ring-2 focus:ring-[#6d5dfc]/20 focus:border-[#6d5dfc] outline-none transition-all placeholder-gray-400 text-sm font-medium" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#111] mb-1.5">State</label>
                  <input placeholder="State" onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-3 bg-[#f7f7f5] border border-transparent rounded-xl focus:ring-2 focus:ring-[#6d5dfc]/20 focus:border-[#6d5dfc] outline-none transition-all placeholder-gray-400 text-sm font-medium" />
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[380px] shrink-0 pt-0 lg:pt-[60px]">
            <div className="bg-white rounded-[24px] p-6 shadow-xl shadow-black/[0.03] border border-black/[0.06] sticky top-24">
              <h2 className="text-lg font-black mb-4 tracking-tight">Order Summary</h2>
              
              <div className="space-y-3 mb-6 max-h-[185px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.product._id} className="flex gap-4 items-center p-3 rounded-2xl bg-[#f7f7f5]">
                    <div className="h-14 w-14 shrink-0 bg-white rounded-xl overflow-hidden shadow-sm">
                      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{item.product.name}</h4>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-sm shrink-0 pl-2">
                      ₹{item.product.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-black/[0.06] pt-4 flex justify-between items-end mb-6">
                <div>
                  <span className="block text-xs font-bold text-gray-500 mb-0.5">Total to Pay</span>
                  <span className="text-[10px] font-medium text-gray-400">Includes taxes & shipping</span>
                </div>
                <span className="text-2xl font-black text-[#111]">₹{cartTotal}</span>
              </div>
              
              <button 
                onClick={handlePayment} 
                disabled={loading}
                className="w-full relative flex items-center justify-center overflow-hidden rounded-xl p-3.5 font-bold text-white shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 bg-black group disabled:opacity-50 disabled:transform-none disabled:shadow-none"
              >
                {!loading && (
                  <>
                    <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-black via-[#111] to-[#333]"></span>
                    <span className="absolute bottom-0 right-0 block h-64 w-64 translate-x-32 translate-y-24 rounded-full bg-gradient-to-br from-[#6d5dfc] to-purple-500 opacity-50 blur-3xl transition-all duration-700 group-hover:translate-x-10 group-hover:translate-y-10 group-hover:opacity-80"></span>
                  </>
                )}
                <span className="relative z-10 flex items-center gap-2 text-sm">
                  {loading ? "Processing..." : (
                    <>
                      <span>Place Order & Pay</span>
                      <span>→</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
