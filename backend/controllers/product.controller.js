import uploadCloudinary from "../utils/uploadCloudinary.js";
import { Product } from "../models/product.model.js";


//create product
export const createProduct = async (req, res) => {
    try {
        const {name, description, price, category, stock} = req.body;
        
        // 1. Check if an image file was provided
        if (!req.file) {
             return res.status(400).json({ success: false, message: "Image is required" });
        }

        // 2. Validate fields
        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // 3. Upload the buffer to Cloudinary
        const uploadResult = await uploadCloudinary(req.file.buffer);
        const image = uploadResult.secure_url; // Get the final URL from Cloudinary

        const product = new Product({name, description, price, category, image, stock});
        
        // 4. Save product to mongodb 
        await product.save();

        res.status(201).json({ success: true, message: "Product created successfully", product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating product", error: error.message });
    }
}



import mongoose from "mongoose";

// helper to sanitize regex input preventing ReDoS attacks
const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// get all products 
export const getProducts = async (req, res) => {
    try {
        const { search, category, sort} = req.query;

        const filter = {};

        // Search by product name case-insensitive with sanitized input
        if (search && typeof search === 'string') {
            const sanitizedSearch = escapeRegex(search.trim());
            filter.name = { $regex: sanitizedSearch, $options: "i" };
        }

        // Filter by category
        if (category && typeof category === 'string') {
            filter.category = category.trim();
        }

         // Build query
        let query = Product.find(filter);

        // Sort
        if (sort === 'price_asc') { 
            query = query.sort({ price: 1 });
        } else if (sort === 'price_desc') {
            query = query.sort({ price: -1 });
        }

        // Execute the query
        const products = await query;

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message
        });
    }
};

//get single product (by id)
export const getProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid product ID format" });
        }

        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error fetching product", error: error.message });
    }
};

// update product (support optional new image file or json body)
export const updateProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid product ID format" });
        }

        const updateData = { ...req.body };

        // If an image was uploaded, send to Cloudinary first
        if (req.file) {
            const uploadResult = await uploadCloudinary(req.file.buffer);
            updateData.image = uploadResult.secure_url;
        }

        // Numeric parsing if form-data
        if (updateData.price !== undefined) {
            const parsedPrice = Number(updateData.price);
            if (isNaN(parsedPrice) || parsedPrice <= 0) {
                return res.status(400).json({ success: false, message: "Price must be a positive number" });
            }
            updateData.price = parsedPrice;
        }

        if (updateData.stock !== undefined) {
            const parsedStock = Number(updateData.stock);
            if (isNaN(parsedStock) || parsedStock < 0) {
                return res.status(400).json({ success: false, message: "Stock cannot be negative" });
            }
            updateData.stock = parsedStock;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { returnDocument: 'after', runValidators: true }
        );

        if(!product){
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product updated successfully", product });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error updating product", error: error.message });
    }
};

// delete product
export const deleteProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid product ID format" });
        }

        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting product", error: error.message });
    }
};

