import express from "express";
import rateLimit from "express-rate-limit";
import {registerCustomer,loginCustomer,logoutCustomer,getMe,changePassword,updateProfile,verifyAdminKey} from "../controllers/customer.controller.js";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Rate limiter for authentication attempts (10 requests per 15 minutes per IP)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many login/verification attempts. Please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limiter for admin key verification (5 requests per 15 minutes)
const adminKeyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: "Too many admin key attempts. Locked for 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/register", authLimiter, registerCustomer);
router.post("/login", authLimiter, loginCustomer);
router.post("/logout", protectRoute, logoutCustomer);
router.get("/me", protectRoute, getMe);
router.put("/me", protectRoute, updateProfile);
router.patch("/change-password", protectRoute, changePassword);

// Admin key verification endpoint (Requires authenticated user, validates admin email inside)
router.post("/verify-admin-key", protectRoute, adminKeyLimiter, (req, res, next) => {
    const rawAdminEmails = process.env.ADMIN_EMAIL || "";
    const adminEmails = rawAdminEmails.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
    const userEmail = req.user?.email?.toLowerCase();
    if (!userEmail || !adminEmails.includes(userEmail)) {
        return res.status(403).json({ success: false, message: "Forbidden - Not an authorized admin account" });
    }
    next();
}, verifyAdminKey);

export default router;