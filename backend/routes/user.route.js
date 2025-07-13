import express from "express";

import { deleteAccount, logout, register, sendOtp, updateProfile, verifyOtp } from "../controller/user.controller.js"
import isAuthenticated from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);  // post => sending an data
router.route("/logout").get(logout);  // get => not sending an data
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/send-otp").post(sendOtp);       // 🚀 Step 1: Validate & send OTP
router.route("/verify-otp").post(verifyOtp);   
router.route("/delete-account").post(deleteAccount);   


export default router;