import jwt from "jsonwebtoken"
import Company from "../models/Company.js"

export const protectCompany = async (req, res, next) => {
    const token = req.headers.token
    if (!token) {
        return res.json({ success: false, message: "Not Authorized, Login Again !" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { clockTolerance: 300 }) // 5 minutes leeway

        const company = await Company.findById(decoded.id).select('-password')
        if (company) {
            company.lastActivity = new Date();
            await company.save();
            req.company = company;
        }

        next()
    } catch (error) {
        console.log("Auth Error:", error.message)
        if (error.name === 'TokenExpiredError') {
            return res.json({ success: false, message: "Session Expired, Login Again" })
        }
        res.json({ success: false, message: error.message })
    }

}

export const protectAdmin = async (req, res, next) => {
    const token = req.headers.token
    if (!token) {
        return res.json({ success: false, message: "Not Authorized, Login Again !" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== 'admin') {
            return res.json({ success: false, message: "Not Authorized as Admin !" })
        }
        next()
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}