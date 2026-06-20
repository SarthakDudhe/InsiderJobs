import express from "express";
import { ChangeJobApplicationStatus, changeVisibility, getCompanydata, getCompanyJobApplication, getCompanyPostedJobs, loginCompany, postjob, registerCompany, verifyCompanyEmail, resendCompanyVerificationEmail, screenApplication } from "../controllers/companyController.js";
import upload from "../config/multer.js";
import { protectCompany } from "../middlewares/authMiddleware.js";


const router = express.Router()


//register Company
router.post("/register",upload.single('image'),registerCompany)

//Company Login

router.post("/login",loginCompany)

//Get Company Data

router.get("/company",protectCompany,getCompanydata)

//Post a job

router.post("/post-job",protectCompany,postjob)

//Get Applicants Data of Company

router.get("/applicants",protectCompany,getCompanyJobApplication)


//Get Company Job list

router.get("/list-jobs",protectCompany,getCompanyPostedJobs)

//Change Application status

router.post("/change-status",protectCompany,ChangeJobApplicationStatus)

//Change Applications Visibility

router.post("/change-visibility",protectCompany,changeVisibility)

// Verify Email
router.get("/verify-email", verifyCompanyEmail)

// Resend Verification Email Link
router.post("/resend-verification", protectCompany, resendCompanyVerificationEmail)

// Screen Candidate Application with AI
router.post("/screen-application", protectCompany, screenApplication)

export default router;