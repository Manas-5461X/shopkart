import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { checkAuth } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      const res = await axiosInstance.post('/customers/login', formData); 
      await checkAuth(); // Refetch user from cookie so AuthContext updates
      toast.success(res.data.message || "Login successful!");
      navigate('/');

    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || error.message || "Login failed");
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
            Sign in to manage your ShopKart account and keep your shopping moving.
          </p>
        </div>

        {/* Right Side: Form Card */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white rounded-[24px] shadow-xl shadow-black/[0.03] overflow-hidden border border-black/[0.06]">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-black text-[#111] mb-1 tracking-tight">
                Welcome back.
              </h2>
              <p className="text-sm font-medium text-gray-500 mb-6">
                Enter your details to continue.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
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

                <div>
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

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-black hover:bg-[#6d5dfc] text-white font-bold py-3.5 px-4 rounded-full transition-colors duration-300 mt-2 flex items-center justify-center shadow-lg shadow-black/10 ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              {/* Bottom Link */}
              <div className="mt-6 text-center border-t border-black/[0.06] pt-4">
                <p className="text-xs font-medium text-gray-500">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-bold text-[#111] hover:text-[#6d5dfc] transition-colors"
                  >
                    Create one now
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

export default Login;
