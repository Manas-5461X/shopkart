import express from "express";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";
import { 
    createPaymentOrder, 
    verifyPayment, 
    getUserOrders, 
    getOrderById,
    getAllOrdersAdmin,
    updateOrderStatus,
    cancelPendingOrder,
    deleteOrderAdmin
} from "../controllers/order.controller.js";

const router = express.Router();

router.use(protectRoute); // All order routes require authentication

// Admin routes (Must precede /:id)
router.get("/admin/all", adminRoute, getAllOrdersAdmin);
router.patch("/admin/:id/status", adminRoute, updateOrderStatus);
router.delete("/admin/:id", adminRoute, deleteOrderAdmin);
router.patch("/:id/status", adminRoute, updateOrderStatus);

// Standard user order routes
router.post("/create-payment-order", createPaymentOrder);
router.post("/verify-payment", verifyPayment);
router.delete("/:id/cancel-pending", cancelPendingOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrderById);

export default router;