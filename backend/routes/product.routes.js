import express from "express";
import { createProduct, getProduct, getProducts, updateProduct } from "../controllers/product.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router()

// ADD upload.single('image') before your controller function:
router.post('/', upload.single('image'), createProduct)
router.get('/', getProducts)
router.get('/:id', getProduct)
router.put('/:id', updateProduct)

export default router ;
