import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { axiosInstance } from '../axiosCalls/axios.js';
import toast from 'react-hot-toast';

function AdminRoute({ children }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Check if key was already verified in this session with server-signed token
    const [isVerified, setIsVerified] = useState(() => {
        return Boolean(sessionStorage.getItem('admin_session_token'));
    });
    const [keyInput, setKeyInput] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!user.isAdmin) {
        toast.error("Access denied. Admin privileges required.", { id: 'admin-denied' });
        return <Navigate to="/" replace />;
    }

    const handleVerifyKey = async (e) => {
        e.preventDefault();
        if (!keyInput.trim()) {
            setErrorMessage("Please enter the admin security key");
            return;
        }

        setVerifying(true);
        setErrorMessage('');
        try {
            const res = await axiosInstance.post('/customers/verify-admin-key', { key: keyInput.trim() });
            if (res.data.success && res.data.adminToken) {
                // Store the server-signed cryptographic token
                sessionStorage.setItem('admin_session_token', res.data.adminToken);
                setIsVerified(true);
                toast.success("Admin Key Verified. Welcome to Admin Portal!");
            }
        } catch (err) {
            console.error("Admin key verification failed", err);
            const msg = err.response?.data?.message || "Invalid Admin Key";
            setErrorMessage(msg);
            toast.error(msg);
        } finally {
            setVerifying(false);
        }
    };

    const handleCancel = () => {
        toast("Admin portal access cancelled", { icon: '🔒' });
        navigate('/');
    };

    // If key not yet verified for this browser session, show the security lock modal
    if (!isVerified) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-black/10 relative text-left">
                    {/* Header Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center text-2xl mb-4 shadow-sm">
                        🔐
                    </div>

                    <h2 className="text-xl font-black text-gray-900 tracking-tight">
                        Admin Security Verification
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 mb-6 leading-relaxed">
                        Authorized email confirmed: <span className="font-semibold text-gray-800">{user.email}</span>. 
                        Please enter the secret <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">ADMIN_KEY</span> from the server environment to unlock admin portal access.
                    </p>

                    <form onSubmit={handleVerifyKey} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-600 mb-1.5">
                                Secret Admin Passkey
                            </label>
                            <input 
                                type="password"
                                autoFocus
                                required
                                value={keyInput}
                                onChange={(e) => {
                                    setKeyInput(e.target.value);
                                    if (errorMessage) setErrorMessage('');
                                }}
                                placeholder="Enter secret admin key..."
                                className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-mono tracking-wider outline-none focus:border-[#6d5dfc] focus:ring-2 focus:ring-[#6d5dfc]/20 transition"
                            />
                            {errorMessage && (
                                <p className="text-xs font-semibold text-red-600 mt-1.5 flex items-center gap-1">
                                    ⚠️ {errorMessage}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 py-3 rounded-xl border border-black/10 text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                            >
                                Cancel & Exit
                            </button>
                            <button
                                type="submit"
                                disabled={verifying}
                                className="flex-1 py-3 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold shadow-lg transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {verifying && <span className="animate-spin">🔄</span>}
                                <span>{verifying ? "Verifying..." : "Verify & Enter"}</span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-5 pt-4 border-t border-black/[0.06] text-center">
                        <span className="text-[10px] text-gray-400 font-medium">
                            🔒 2-Factor Protected • ShopKart Security Protocol
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return children;
}

export default AdminRoute;
