import React, { useState, useContext } from 'react';
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
      console.log("Login response:", res.data);
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Top Navigation / Branding */}
      <div className="flex justify-between items-center p-6 lg:px-12">
        <div className="text-2xl font-bold tracking-tight text-blue-900">
          shopkart<span className="text-blue-600">.</span>
        </div>
        <div className="hidden md:block text-sm text-slate-500">
          Everyday essentials, simply delivered.
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:px-12 lg:gap-24">
        
        {/* Left Side: Copy */}
        <div className="w-full lg:w-1/2 max-w-lg mb-12 lg:mb-0">
          <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">
            Shop Smarter
          </p>
          <h1 className="text-5xl lg:text-7xl font-serif font-bold text-blue-950 leading-[1.1] mb-6">
            Everything you need, in one cart.
          </h1>
          <p className="text-slate-600 text-lg mb-8 max-w-md">
            Sign in to manage your ShopKart account and keep your shopping moving.
          </p>
        </div>

        {/* Right Side: Form Card */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Welcome back
              </h2>
              <p className="text-sm text-slate-500 mb-8">
                Enter your details to continue.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all placeholder-slate-400 text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all placeholder-slate-400 text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mt-4 flex items-center justify-center ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center space-x-1.5 py-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              {/* Bottom Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Create account
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

