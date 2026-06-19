import express from "express";
import { getJobById, getJobs, reportJob } from "../controllers/jobController.js";


const router = express.Router()

//Route to get all Jobs data
router.get("/",getJobs)


//Route to get a single Job by id

router.get("/:id",getJobById)

//Route to report a job posting
router.post("/:id/report",reportJob)

export default router;