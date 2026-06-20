import express from "express";
import { adminLogin, getDashboardStats, getAllCompanies, verifyCompany, getReportedJobs, dismissJobReports, deleteJob, getAnalyticsData, getAllJobs } from "../controllers/adminController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin Authentication
router.post("/login", adminLogin);

// Dashboard Statistics
router.get("/stats", protectAdmin, getDashboardStats);

// List all companies
router.get("/companies", protectAdmin, getAllCompanies);

// List all jobs
router.get("/jobs", protectAdmin, getAllJobs);

// Verify / Unverify Company
router.post("/verify", protectAdmin, verifyCompany);

// Reported Jobs Moderation
router.get("/reported-jobs", protectAdmin, getReportedJobs);
router.post("/dismiss-report", protectAdmin, dismissJobReports);
router.post("/delete-job", protectAdmin, deleteJob);

// 7-day Activity Analytics
router.get("/analytics", protectAdmin, getAnalyticsData);

export default router;
