import express from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all wishlist routes
router.use(protectRoute); 

router.post('/:productId', addToWishlist);
router.get('/', getWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;