import express from "express";
import {registerCustomer,loginCustomer,logoutCustomer,getMe,changePassword,updateProfile} from "../controllers/customer.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/logout",protectRoute, logoutCustomer);
router.get("/me", protectRoute, getMe);
router.put("/me", protectRoute, updateProfile);
router.patch("/change-password", protectRoute, changePassword);

export default router;