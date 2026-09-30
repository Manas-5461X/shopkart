import { Product } from "../models/product.model.js";

//create product
export const createProduct = async (req, res) => {
    try {
        const {name, description, price, category, image, stock} = req.body

        // check validation 
        if(!name || !description || !price || !category || !image || !stock){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // price should be greater than 0 
        if(price <= 0){
            return res.status(400).json({ success: false, message: "Price must be greater than 0" });
        }

        // stock should be greater than or equal to 0 
        if(stock < 0){
            return res.status(400).json({ success: false, message: "Stock cannot be negative" });
        }

        const product = new Product({name, description, price, category, image, stock})
        // saving product to mongodb 
        await product.save()

        res.status(201).json({ success: true, message: "Product created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating product", error: error.message });
    }
}



// get all products (With search , category filter and sort)
export const getProducts = async (req, res) => {
    try {
        const { search, category, sort} = req.query;

        const filter = {};

        // Search by product name case-insensitive
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        // Filter by category
        if (category) {
            filter.category = category;
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



//get single product( by id)
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid product ID", error: error.message });
    }
}

// update product
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if(!product){
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product updated successfully", product });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error updating product", error: error.message });
    }
}

