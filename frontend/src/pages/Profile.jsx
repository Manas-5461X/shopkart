import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { axiosInstance } from '../axiosCalls/axios.js';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFullname(user.fullname || user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.put('/customers/me', {
        fullname,
        email,
        phone,
      });
      if (response.data.success) {
        toast.success(response.data.message || 'Profile updated successfully');
        await checkAuth(); // Refresh user context
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const response = await axiosInstance.patch('/customers/change-password', {
        oldPassword,
        newPassword,
      });
      if (response.data.success) {
        toast.success(response.data.message || 'Password updated successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111]">
      {/* HEADER NAVBAR */}
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
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            My Account
          </h1>
          <p className="mt-2 text-sm text-gray-500">Manage your profile information and security.</p>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* SIDEBAR TABS */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="flex flex-col gap-2 rounded-2xl bg-white p-3 shadow-sm border border-gray-100">
              <button
                onClick={() => setActiveTab('profile')}
                className={`rounded-xl px-4 py-3 text-left text-[13px] font-bold transition ${
                  activeTab === 'profile'
                    ? 'bg-[#f1efff] text-[#6d5dfc]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`rounded-xl px-4 py-3 text-left text-[13px] font-bold transition ${
                  activeTab === 'password'
                    ? 'bg-[#f1efff] text-[#6d5dfc]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Security & Password
              </button>
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 sm:p-8">
            {activeTab === 'profile' && (
              <div>
                <h2 className="mb-6 text-xl font-black">Personal Details</h2>
                <form onSubmit={handleUpdateProfile} className="max-w-md space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-[#6d5dfc] focus:bg-white focus:ring-1 focus:ring-[#6d5dfc]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-[#6d5dfc] focus:bg-white focus:ring-1 focus:ring-[#6d5dfc]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-[#6d5dfc] focus:bg-white focus:ring-1 focus:ring-[#6d5dfc]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 rounded-full bg-black px-8 py-3 text-sm font-bold text-white transition hover:bg-[#6d5dfc] disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'password' && (
              <div>
                <h2 className="mb-6 text-xl font-black">Change Password</h2>
                <form onSubmit={handleUpdatePassword} className="max-w-md space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-[#6d5dfc] focus:bg-white focus:ring-1 focus:ring-[#6d5dfc]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-[#6d5dfc] focus:bg-white focus:ring-1 focus:ring-[#6d5dfc]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-[#6d5dfc] focus:bg-white focus:ring-1 focus:ring-[#6d5dfc]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 rounded-full bg-black px-8 py-3 text-sm font-bold text-white transition hover:bg-[#6d5dfc] disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
