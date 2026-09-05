import jwt from 'jsonwebtoken'
import { Customer } from '../models/customer.model.js';

export const protectRoute = async(req, res, next) => {
    try {

        // here first we are cheking that the cookie has a token or not . if not return response 401
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({ message: "Unauthorized - no Token Provided" });
        }
        // if token present then we will verify that token if token is valid then we will get the decoded token to verify every time when user comes to web and create request 
        // basically this is the process for which we think that user  is verified like has email and id in db and like when user hit url page on web then req to server comes with token and we use that token to get that id which is basically a authentication to confirm user is verified or not 

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        // making ready decodedToken for next route which is just directly connected to this middleware  - getme function 
        // req.userId = decodedToken.userId


       const customer = await Customer.findById(decodedToken.userId).select('-password');
        if (!customer) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        req.user = customer;

        next() 
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized or Expired Token' });
    }   
}