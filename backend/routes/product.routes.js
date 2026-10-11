import express from "express";
import { createProduct, getProduct, getProducts, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public read routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected Admin write routes
router.post('/', protectRoute, adminRoute, upload.single('image'), createProduct);
router.put('/:id', protectRoute, adminRoute, upload.single('image'), updateProduct);
router.delete('/:id', protectRoute, adminRoute, deleteProduct);

export default router;
