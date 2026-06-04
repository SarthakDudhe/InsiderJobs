import express from "express";
import { applyForJob, getUserData, getUserJobApplication, updateUserResume } from "../controllers/userController.js";
import { getAIJobRecommendations } from "../controllers/aiController.js";
import upload from "../config/multer.js";



const router = express.Router()

//Get User Data
router.get("/user", getUserData)


//Apply for a job

router.post("/apply", applyForJob)


//Get applied jobs data

router.get("/applications", getUserJobApplication)

//Update User profile

router.post("/update-resume", upload.single('resume'), updateUserResume)

//AI Job Recommendations
router.get("/ai-recommender", getAIJobRecommendations)

export default router
