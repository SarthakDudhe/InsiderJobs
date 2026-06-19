import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import jwt from "jsonwebtoken";

// Admin Login
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@insiderjobs.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign({ id: "admin", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid Admin Credentials" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Dashboard Statistics
export const getDashboardStats = async (req, res) => {
    try {
        const totalCompanies = await Company.countDocuments();
        const pendingVerifications = await Company.countDocuments({ isVerified: false });
        const totalJobs = await Job.countDocuments();
        const totalApplications = await JobApplication.countDocuments();

        res.json({
            success: true,
            stats: {
                totalCompanies,
                pendingVerifications,
                totalJobs,
                totalApplications
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get All Companies for moderation
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().select("-password").sort({ name: 1 });
        res.json({ success: true, companies });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Verify or revoke company workspace
export const verifyCompany = async (req, res) => {
    const { id, isVerified } = req.body;
    try {
        const company = await Company.findById(id);
        if (!company) {
            return res.json({ success: false, message: "Company not found" });
        }
        company.isVerified = isVerified;
        await company.save();
        res.json({ success: true, message: `Company verification updated successfully!`, company });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
