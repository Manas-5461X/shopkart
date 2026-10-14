import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", // dynamic backend API url
    headers: {
        "Content-Type": "application/json", // communication using json format 
    },
    withCredentials: true, // transfer tokens 
});

// Intercept requests to attach cryptographically signed admin token if present
axiosInstance.interceptors.request.use((config) => {
    const adminToken = sessionStorage.getItem('admin_session_token');
    if (adminToken) {
        config.headers['x-admin-token'] = adminToken;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

