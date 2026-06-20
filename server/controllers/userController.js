import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import { v2 as cloudinary } from "cloudinary"
import { clerkClient } from "@clerk/express"
import fs from 'fs'
import { PDFParse } from "pdf-parse"

export const getUserData = async (req, res) => {
    const userId = req.auth?.userId

    if (!userId) {
        return res.json({ success: false, message: "Not Authorized, Login Again" })
    }

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
                // Handle Duplicate Key Error (E11000)
                if (error.code === 11000) {
                    console.log("Duplicate key error detected (likely email collision). Resolving...")

                    // Fetch the conflicting user by email
                    const clerkUser = await clerkClient.users.getUser(userId)
                    const email = clerkUser.emailAddresses[0].emailAddress
                    const existingUser = await User.findOne({ email })

                    if (existingUser) {
                        // Check if it's a race condition (ID matches) or a zombie account (ID mismatch)
                        if (existingUser._id === userId) {
                            console.log("Race condition detected: User already created. Returning existing user.")
                            return res.json({ success: true, user: existingUser })
                        } else {
                            // ID Mismatch: Delete the old (stale) record and create the new one
                            console.log(`ID Mismatch detected. Deleting stale user ${existingUser._id} and recreating...`)
                            await User.findByIdAndDelete(existingUser._id)

                            // Retry creation
                            const userData = {
                                _id: userId,
                                name: clerkUser.firstName + " " + clerkUser.lastName,
                                email: email,
                                image: clerkUser.imageUrl,
                                resume: ''
                            }
                            await User.create(userData)
                            return res.json({ success: true, user: userData })
                        }
                    }
                }

                console.log("Failed to auto-create user:", error.message)
                return res.json({ success: false, message: error.message })
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
                const parser = new PDFParse({ data: fs.readFileSync(resumeFile.path) });
                const data = await parser.getText();
                userData.resumeText = data.text?.trim() || "";
                await parser.destroy();
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
