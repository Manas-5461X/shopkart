import { Order } from "../models/order.model.js";
import { Customer } from "../models/customer.model.js";
import { Product } from "../models/product.model.js";
import { razorpay } from "../config/razorpay.js";
import crypto from "crypto";
import mongoose from "mongoose";

export const createPaymentOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;
        
        const customer = await Customer.findById(req.user._id).populate('cart.product');

        if (!customer.cart || customer.cart.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        let totalAmount = 0;
        const orderItems = [];

        // load latest product data and verify stock
        for (const item of customer.cart) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                return res.status(400).json({ success: false, message: `Product ${item.product.name || 'Unknown'} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
            }
            
            totalAmount += product.price * item.quantity;
            
         
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image
            });
        }

        // Create pending ShopKart order
        const shopKartOrder = new Order({
            user: customer._id,
            items: orderItems,
            shippingAddress,
            totalAmount,
            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT"
        });
        await shopKartOrder.save();

        // Create Razorpay order in paise
        const amountInPaise = Math.round(totalAmount * 100);
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: shopKartOrder._id.toString()
        });

        // Save razorpayOrderId
        shopKartOrder.razorpayOrderId = razorpayOrder.id;
        await shopKartOrder.save();

        // Return checkout data
        res.status(200).json({
            success: true,
            shopKartOrderId: shopKartOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: amountInPaise,
            currency: "INR",
            key: process.env.RAZORPAY_KEY_ID // Safe to send to frontend
        });
    } catch (error) {
        console.error("Create payment order error:", error);
        res.status(500).json({ success: false, message: 'Failed to create payment order' });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const order = await Order.findById(shopKartOrderId);
        if (!order) {
            console.error("verifyPayment: Order not found for ID:", shopKartOrderId);
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Use the Razorpay Order ID stored in our database, NOT the one sent by the client, for security
        const body = order.razorpayOrderId + "|" + razorpay_payment_id;
        
        // Generate HMAC SHA256 signature using our secret
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            console.error("verifyPayment: Signature mismatch. Expected:", expectedSignature, "Received:", razorpay_signature);
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        // Prevent double processing if already paid
        if (order.paymentStatus === "PAID") {
            return res.status(200).json({ success: true, message: "Order is already verified", order });
        }

        // Signature is valid! Mark order as PAID and PLACED
        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();

        // Decrement product stock in database safely (guaranteed never negative)
        for (const item of order.items) {
            if (item.product) {
                await Product.findOneAndUpdate(
                    { _id: item.product, stock: { $gte: item.quantity } },
                    { $inc: { stock: -item.quantity } }
                );
            }
        }

        // Clear the user's cart in the database
        const customer = await Customer.findById(req.user._id);
        if (customer) {
            customer.cart = [];
            await customer.save();
        }

        res.status(200).json({ success: true, message: "Payment verified successfully", order });
    } catch (error) {
        console.error("Verify payment error:", error);
        res.status(500).json({ success: false, message: 'Failed to verify payment' });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        // Fetch only completed/placed orders belonging to the user, excluding unpaid checkout attempts
        const orders = await Order.find({ 
            user: req.user._id,
            status: { $in: ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"] }
        }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
};

export const getOrderById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid order ID format' });
        }

        const order = await Order.findOne({ 
            _id: req.params.id, 
            user: req.user._id,
            status: { $in: ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"] }
        });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Get order by id error:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch order details' });
    }
};

export const cancelPendingOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid order ID format' });
        }
        // Clean up temporary order if payment was cancelled or failed
        await Order.findOneAndDelete({ 
            _id: id, 
            user: req.user._id,
            status: "PENDING_PAYMENT" 
        });
        res.status(200).json({ success: true, message: "Pending order discarded" });
    } catch (error) {
        console.error("Cancel pending order error:", error);
        res.status(500).json({ success: false, message: "Failed to discard pending order" });
    }
};

export const deleteOrderAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid order ID format' });
        }
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        console.error("Delete order admin error:", error);
        res.status(500).json({ success: false, message: "Failed to delete order" });
    }
};

export const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({ path: "user", select: "fullname fullName email phone", model: Customer })
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Get all orders admin error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid order ID format' });
        }
        const { status } = req.body;

        const ALLOWED_STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

        if (!status || !ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values are: ${ALLOWED_STATUSES.join(", ")}`
            });
        }

        const order = await Order.findById(id).populate({ path: "user", select: "fullname fullName email phone", model: Customer });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            order
        });
    } catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({ success: false, message: "Failed to update order status" });
    }
};
