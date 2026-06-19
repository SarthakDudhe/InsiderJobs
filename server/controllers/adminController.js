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

// Get all reported jobs
export const getReportedJobs = async (req, res) => {
    try {
        const reportedJobs = await Job.find({ "reports.0": { $exists: true } })
            .populate("companyId", "name email image")
            .sort({ date: -1 });
        res.json({ success: true, reportedJobs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Dismiss all reports from a job
export const dismissJobReports = async (req, res) => {
    const { id } = req.body;
    try {
        const job = await Job.findById(id);
        if (!job) {
            return res.json({ success: false, message: "Job not found" });
        }
        job.reports = [];
        await job.save();
        res.json({ success: true, message: "All reports dismissed successfully." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Delete job posting
export const deleteJob = async (req, res) => {
    const { id } = req.body;
    try {
        const job = await Job.findById(id);
        if (!job) {
            return res.json({ success: false, message: "Job not found" });
        }
        await Job.findByIdAndDelete(id);
        // Also remove applications for this job
        await JobApplication.deleteMany({ jobId: id });
        res.json({ success: true, message: "Job listing and associated applications deleted successfully." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get daily analytics for the last 7 days
export const getAnalyticsData = async (req, res) => {
    try {
        const stats = [];
        const now = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const startOfDay = date.getTime();
            const endOfDay = startOfDay + (24 * 60 * 60 * 1000);
            
            const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const jobsCount = await Job.countDocuments({
                date: { $gte: startOfDay, $lt: endOfDay }
            });
            
            const applicationsCount = await JobApplication.countDocuments({
                date: { $gte: startOfDay, $lt: endOfDay }
            });
            
            stats.push({
                date: dateString,
                jobs: jobsCount,
                applications: applicationsCount
            });
        }
        
        res.json({ success: true, stats });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
