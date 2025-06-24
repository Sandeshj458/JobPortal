import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { deleteJobById, filterJobs, getAdminJobs, getAllJobs, getJobById, postJob, updateJobById} from "../controller/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);

// router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/get").get(getAllJobs);

// router.route("/get/:id").get(isAuthenticated,getJobById);
router.route("/get/:id").get(getJobById);

router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/filter").get(filterJobs);
router.route("/delete/:id").delete(isAuthenticated,deleteJobById);
router.route("/update/:id").put(isAuthenticated, updateJobById);

export default router;