import { Customer } from "../models/customer.model.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/generateToken.js";

// customer regsitration 
export const registerCustomer = async (req, res) => {
    let { fullname, email, phone, password } = req.body;

    try{
        // if any of the fields are missing send response 400
        if (!fullname || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // if password is shorter 
        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        email = email.toLowerCase()
        
        // to check if customer already exists 
        const customerExists = await Customer.findOne({email})

        if(customerExists){
            return res.status(409).json({ message: "Customer already exists" });
        }

        // creating hash of pass
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // creating new customer 
        const newCustomer = new Customer({
            fullname,
            email,
            phone,
            password: hashedPassword
        })

        // saving new customer to mongodb 
        await newCustomer.save()

        // generating token
        const cookiesOptions = {
            maxAge : 10 * 24 * 60 * 60 * 1000, // 10 days in ms
            httpOnly : true, // it prevent client side js from accessing the cookie  
            sameSite : "strict", // it prevent cross site request
            secure : false, // No it does not ensure the cookie is only sent over https connection
        }
    
        const token = generateToken(newCustomer._id)
        res.cookie("token", token, cookiesOptions)

        return res.status(201).json({
              success: true,
              message: "Customer registered successfully",
              customer: {
                    _id: newCustomer._id,
                    fullName: newCustomer.fullname || newCustomer.fullName,
                    email: newCustomer.email,
                    phone: newCustomer.phone
              }     
        });

    }catch(error){
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}   


//customer login 
export const loginCustomer = async(req, res) => {
    let { email, password } = req.body

    // if any of the fields are missing send response 400
    if(!email || !password){
        return res.status(400).json({ message: "All fields are required" });
    }

    try{
        email = email.toLowerCase()

        // find customer by email
        const customer = await Customer.findOne({email})
        
        // if customer does not exist return 401
        if(!customer){
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // compare password from req.body and entered pass by customer 
        const isPasswordMatched = await bcrypt.compare(password, customer.password)

        // if password does not match return 401
        if(!isPasswordMatched){
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // generating token
        const cookiesOptions = {
            maxAge : 10 * 24 * 60 * 60 * 1000, // 10 days in ms
            httpOnly : true, // it prevent client side js from accessing the cookie  
            sameSite : "strict", // it prevent cross site request
            secure : false, // No it does not ensure the cookie is only sent over https connection
        }
    
        const token = generateToken(customer._id)
        res.cookie("token", token, cookiesOptions)

        return res.status(200).json({success: true, message: "Login successful" });
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//customer logout 
export const logoutCustomer = async(req, res) => {
    try {
        res.clearCookie("token",{
            httpOnly : true,
            secure : false,
            sameSite : "strict"
        })
        return res.status(200).json({ message: "Customer logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


// getting logged in customer profile 
export const getMe = async (req, res) => {
    // try {
    //     const customer = await Customer.findById(req.userId).select('-password');
    //     if (!customer) {
    //         return res.status(404).json({ message: "User not found" });
    //     }
    //     return res.status(200).json(customer);
    // } catch (error) {
    //     return res.status(500).json({ message: "Server error", error: error.message });
    // }
  
    return res.status(200).json(req.user);
};


// change password 
export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Please provide old and new passwords" });
    }

    try {
        const customer = await Customer.findById(req.user._id);

        if (customer && (await bcrypt.compare(oldPassword, customer.password))) {
            const salt = await bcrypt.genSalt(10);
            customer.password = await bcrypt.hash(newPassword, salt);
            await customer.save();

            res.json({ success: true, message: 'Password changed successfully' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};