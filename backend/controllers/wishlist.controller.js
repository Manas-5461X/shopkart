import { Customer } from "../models/customer.model.js";
import {Product} from '../models/product.model.js';


// adding to wishlist 
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Check that product exist or not 
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = req.user;
    
    // if product is already in wishlist 
    if (customer.wishlist.includes(productId)) {
      return res.status(409).json({ success: false, message: 'Product already in wishlist' });
    }

    customer.wishlist.push(productId);
    await customer.save();

    res.status(200).json({ success: true, message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// getting current user wishlist 
export const getWishlist = async (req, res) => {

  try {

    // .populate() is a Mongoose method used to replace referenced document IDs with the actual documents.
    const customer = await Customer.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'name price category image stock'
    });

    res.status(200).json({
      success: true,
      count: customer.wishlist.length,
      wishlist: customer.wishlist
    });
  } catch (error) {

    res.status(500).json({ success: false, message: 'Server error' });

  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const customer = req.user; // from protectRoute

    if (!customer.wishlist.includes(productId)) {
      return res.status(404).json({ success: false, message: 'Product not in wishlist' });
    }

    // Filter out the productId
    customer.wishlist = customer.wishlist.filter(id => id.toString() !== productId);
    await customer.save();

    res.status(200).json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
