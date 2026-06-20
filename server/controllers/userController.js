import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import { v2 as cloudinary } from "cloudinary"
import fs from 'fs'
import { extractText, getDocumentProxy } from "unpdf"
import bcrypt from "bcryptjs"
import generateToken from "../utils/generateToken.js"

// Register a new Candidate/User
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details" })
    }
    try {
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.json({ success: false, message: "User Already Registered !" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        // Generate a default avatar URL using UI Avatars
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            image: defaultAvatar
        })

        const token = generateToken(user._id)

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                resume: user.resume
            },
            token
        })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Candidate/User Login
export const loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.json({ success: false, message: "Missing Details" })
    }
    try {
        const user = await User.findOne({ email })
        if (user && await bcrypt.compare(password, user.password)) {
            const token = generateToken(user._id)
            res.json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    resume: user.resume
                },
                token
            })
        } else {
            res.json({ success: false, message: "Invalid Email or Password" })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getUserData = async (req, res) => {
    const userId = req.auth?.userId

    if (!userId) {
        return res.json({ success: false, message: "Not Authorized, Login Again" })
    }

    try {
        const user = await User.findById(userId).select('-password')

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        res.json({ success: true, user })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//Apply for job

export const applyForJob = async (req, res) => {
    const { jobId } = req.body
    const userId = req.auth?.userId

    if (!userId) {
        return res.json({ success: false, message: "Not Authorized, Login Again" })
    }

    try {
        const isAlreadyApplied = await JobApplication.find({ jobId, userId })
        if (isAlreadyApplied.length > 0) {
            return res.json({ success: false, message: "Already Applied" })
        }

        const jobData = await Job.findById(jobId)
        if (!jobData) {
            return res.json({ success: false, message: "Job Not Found ! " })
        }
        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        res.json({ success: true, message: "Applied Successfully 😊" })

    } catch (error) {
        if (error.code === 11000) {
            return res.json({ success: false, message: "Already Applied" })
        }
        res.json({ success: false, message: error.message })
    }

}

//Get user applied applications


export const getUserJobApplication = async (req, res) => {
    try {
        const userId = req.auth?.userId
        if (!userId) {
            return res.json({ success: false, message: "Not Authorized, Login Again" })
        }

        const application = await JobApplication.find({ userId }).populate('companyId', 'name email image').populate('jobId', 'title description location category level salary').exec()
        if (!application) {
            res.json({ success: false, message: "No Job Applications Found ! " })
        }
        return res.json({ success: true, application })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//Update user profile (RESUME)

export const updateUserResume = async (req, res) => {
    try {
        const userId = req.auth?.userId
        if (!userId) {
            return res.json({ success: false, message: "Not Authorized, Login Again" })
        }
        const resumeFile = req.file

        const userData = await User.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: "User not found" })
        }

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url

            // Parse PDF text on upload and cache it
            try {
                const pdf = await getDocumentProxy(new Uint8Array(fs.readFileSync(resumeFile.path)));
                const { text } = await extractText(pdf, { mergePages: true });
                userData.resumeText = text?.trim() || "";
            } catch (pdfError) {
                console.error("[User Controller] PDF parsing failed on upload:", pdfError.message);
                userData.resumeText = "";
            }
        }
        await userData.save()

        return res.json({ success: true, message: "Resume Updated " })

    } catch (error) {
        res.json({ success: false, message: error.message })
    } finally {
        if (req.file?.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("[User Controller] Temp file cleanup error:", err.message);
            });
        }
    }
}
