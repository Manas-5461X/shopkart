import React, { useState } from 'react';
import { axiosInstance } from '../axiosCalls/axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      const res = await axiosInstance.post('/customers/register', formData); 
      toast.success(res.data.message || "Registration successful!");
      navigate('/login');
      
    } catch (error) {
      console.error("Register error:", error);
      toast.error(error.response?.data?.message || error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#f7f7f5] font-sans text-[#111] flex flex-col">
      {/* Top Navigation / Branding */}
      <div className="flex justify-between items-center p-4 lg:px-12">
        <Link to="/" className="text-[25px] font-black tracking-[-0.06em]">
          Shop<span className="text-[#6d5dfc]">Kart</span>
        </Link>
        <div className="hidden md:block text-sm font-medium text-gray-500">
          Everyday essentials, simply delivered.
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 lg:px-12 lg:gap-16">
        
        {/* Left Side: Copy */}
        <div className="w-full lg:w-1/2 max-w-lg mb-8 lg:mb-0">
          <p className="text-[#6d5dfc] text-xs font-bold tracking-widest uppercase mb-3">
            Shop Smarter
          </p>
          <h1 className="text-5xl lg:text-6xl font-serif font-bold text-[#111] leading-[1.1] mb-4">
            Everything you need, in one cart.
          </h1>
          <p className="text-gray-500 text-base mb-4 max-w-md">
            Create a ShopKart account to start shopping our curated selection of essentials.
          </p>
        </div>

        {/* Right Side: Form Card */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white rounded-[24px] shadow-xl shadow-black/[0.03] overflow-hidden border border-black/[0.06]">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-black text-[#111] mb-1 tracking-tight">
                Join ShopKart.
              </h2>
              <p className="text-sm font-medium text-gray-500 mb-6">
                Enter your details to create an account.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullname" className="block text-xs font-bold text-[#111] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder="e.g. Jane Doe"
                      className="w-full px-4 py-3 bg-[#f7f7f5] border border-transparent rounded-xl focus:ring-2 focus:ring-[#6d5dfc]/20 focus:border-[#6d5dfc] outline-none transition-all placeholder-gray-400 text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-[#111] mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-[#f7f7f5] border border-transparent rounded-xl focus:ring-2 focus:ring-[#6d5dfc]/20 focus:border-[#6d5dfc] outline-none transition-all placeholder-gray-400 text-sm font-medium"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-xs font-bold text-[#111] mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-[#f7f7f5] border border-transparent rounded-xl focus:ring-2 focus:ring-[#6d5dfc]/20 focus:border-[#6d5dfc] outline-none transition-all placeholder-gray-400 text-sm font-medium"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="password" className="block text-xs font-bold text-[#111] mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-3 bg-[#f7f7f5] border border-transparent rounded-xl focus:ring-2 focus:ring-[#6d5dfc]/20 focus:border-[#6d5dfc] outline-none transition-all placeholder-gray-400 text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-black hover:bg-[#6d5dfc] text-white font-bold py-3.5 px-4 rounded-full transition-colors duration-300 flex items-center justify-center shadow-lg shadow-black/10 ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              {/* Bottom Link */}
              <div className="mt-6 text-center border-t border-black/[0.06] pt-4">
                <p className="text-xs font-medium text-gray-500">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-bold text-[#111] hover:text-[#6d5dfc] transition-colors"
                  >
                    Log in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
