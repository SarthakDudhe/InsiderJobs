import express from "express";
import { adminLogin, getDashboardStats, getAllCompanies, verifyCompany } from "../controllers/adminController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin Authentication
router.post("/login", adminLogin);

// Dashboard Statistics
router.get("/stats", protectAdmin, getDashboardStats);

// List all companies
router.get("/companies", protectAdmin, getAllCompanies);

// Verify / Unverify Company
router.post("/verify", protectAdmin, verifyCompany);

export default router;
