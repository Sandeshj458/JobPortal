import express from "express";

import { login, logout, register, updateProfile } from "../controller/user.controller.js"
import isAuthenticated from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);  // post => sending an data
router.route("/login").post(login);
router.route("/logout").get(logout);  // get => not sending an data
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

export default router;