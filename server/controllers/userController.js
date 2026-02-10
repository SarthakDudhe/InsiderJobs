import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import { v2 as cloudinary } from "cloudinary"
import { clerkClient } from "@clerk/express"

export const getUserData = async (req, res) => {
    const userId = req.auth.userId

    try {
        const user = await User.findById(userId)

        if (!user) {
            console.log("User not found in database, attempting to auto-create from Clerk...")
            try {
                const clerkUser = await clerkClient.users.getUser(userId)
                const userData = {
                    _id: userId,
                    name: clerkUser.firstName + " " + clerkUser.lastName,
                    email: clerkUser.emailAddresses[0].emailAddress,
                    image: clerkUser.imageUrl,
                    resume: ''
                }
                await User.create(userData)
                return res.json({ success: true, user: userData })
            } catch (error) {
                console.log("Failed to auto-create user:", error.message)
                return res.json({ success: false, message: "User Not Found ! " })
            }
        }
        res.json({ success: true, user })


    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//Apply for job

export const applyForJob = async (req, res) => {
    const { jobId } = req.body
    const { userId } = req.auth

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
        res.json({ success: false, message: error.message })
    }

}

//Get user applied applications


export const getUserJobApplication = async (req, res) => {
    try {
        const userId = req.auth.userId

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
        const userId = req.auth.userId

        const resumeFile = req.file

        const userData = await User.findById(userId)

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }
        await userData.save()

        return res.json({ success: true, message: "Resume Updated " })


    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
