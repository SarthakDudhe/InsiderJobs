import express from "express";
import { applyForJob, getUserData, getUserJobApplication, updateUserResume, registerUser, loginUser, auditJobATS } from "../controllers/userController.js";
import { getAIJobRecommendations } from "../controllers/aiController.js";
import { protectUser } from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router()

// Register Candidate
router.post("/register", registerUser)

// Login Candidate
router.post("/login", loginUser)

//Get User Data
router.get("/user", protectUser, getUserData)

//Apply for a job
router.post("/apply", protectUser, applyForJob)

//Get applied jobs data
router.get("/applications", protectUser, getUserJobApplication)

//Update User profile
router.post("/update-resume", protectUser, upload.single('resume'), updateUserResume)

//AI Job Recommendations
router.get("/ai-recommender", protectUser, getAIJobRecommendations)

//ATS Audit for resume vs job
router.post("/ats-audit/:jobId", protectUser, auditJobATS)

export default router
