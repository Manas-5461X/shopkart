import { Router } from "express";
import { createProduct, getProduct, getProducts, updateProduct } from "../controllers/product.controller.js";

const router = Router()

router.post('/', createProduct)
router.get('/', getProducts)
router.get('/:id', getProduct)
router.put('/:id', updateProduct)

export default router
