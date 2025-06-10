import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany, deleteCompany } from "../controller/company.controller.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(isAuthenticated,registerCompany);  // post => sending an data
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);  // get => not sending an data
router.route("/update/:id").put(isAuthenticated,singleUpload, updateCompany);
router.route("/delete/:id").delete(isAuthenticated, deleteCompany);

export default router;