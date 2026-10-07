import { Customer } from '../models/customer.model.js';
import { Product } from '../models/product.model.js';

// Add to Cart
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const customer = req.user;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        if (product.stock < 1) return res.status(400).json({ success: false, message: 'Product out of stock' });

        // Check if product is already in cart
        const existingCartItem = customer.cart.find(item => item.product.toString() === productId);

        if (existingCartItem) {
            if (existingCartItem.quantity >= product.stock) {
                return res.status(400).json({ success: false, message: 'Cannot exceed available stock' });
            }
            existingCartItem.quantity += 1;
        } else {
            customer.cart.push({ product: productId, quantity: 1 });
        }

        await customer.save();

        res.status(200).json({ success: true, message: 'Added to cart', cart: customer.cart });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get Cart
export const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id).populate({
            path: 'cart.product',
            select: 'name price image stock category'
        });

        res.status(200).json({ success: true, cart: customer.cart });
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update Quantity
export const updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const customer = req.user;

        if (quantity < 1) return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });

        const product = await Product.findById(productId);

        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        if (quantity > product.stock) return res.status(400).json({ success: false, message: 'Cannot exceed available stock' });

        const cartItem = customer.cart.find(item => item.product.toString() === productId);

        if (!cartItem){
           return res.status(404).json({ success: false, message: 'Product not in cart' });
        }

        cartItem.quantity = quantity;
        await customer.save();

        res.status(200).json({ success: true, message: 'Quantity updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const customer = req.user;

        customer.cart = customer.cart.filter(item => item.product.toString() !== productId);

        await customer.save();

        res.status(200).json({ success: true, message: 'Removed from cart' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};