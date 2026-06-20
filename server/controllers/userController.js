import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import axios from "axios"
import { Groq } from "groq-sdk"
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
            // Handle migration of users created under Clerk (they have no password)
            if (!userExists.password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt)

                // Fetch the raw document from the MongoDB driver to get the uncasted string _id
                const rawUser = await User.collection.findOne({ email });
                const oldId = rawUser ? rawUser._id : userExists._id; // Fallback just in case
                
                // Preserve data from the old Clerk account
                const oldResume = userExists.resume || ""
                const oldResumeText = userExists.resumeText || ""
                const oldSkills = userExists.skills || []
                const oldExperience = userExists.experience || []
                const oldEducation = userExists.education || []
                const oldLinks = userExists.links || {}
                const oldImage = (!userExists.image || userExists.image.startsWith('https://images.clerk.dev'))
                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`
                    : userExists.image

                // Delete the old Clerk document using the raw string _id (or by email to be safe)
                await User.collection.deleteOne({ email: email })

                // Create a fresh user with a proper MongoDB ObjectId
                const newUser = await User.create({
                    name,
                    email,
                    password: hashedPassword,
                    image: oldImage,
                    resume: oldResume,
                    resumeText: oldResumeText,
                    skills: oldSkills,
                    experience: oldExperience,
                    education: oldEducation,
                    links: oldLinks
                })

                // Migrate any existing job applications from old Clerk _id to new ObjectId
                if (oldId) {
                    await JobApplication.updateMany(
                        { userId: String(oldId) },
                        { $set: { userId: String(newUser._id) } }
                    )
                }

                const token = generateToken(newUser._id)
                return res.json({
                    success: true,
                    user: {
                        _id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        image: newUser.image,
                        resume: newUser.resume
                    },
                    token
                })
            }
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
        if (!user) {
            return res.json({ success: false, message: "Invalid Email or Password" })
        }
        
        if (!user.password) {
            return res.json({ success: false, message: "This account has no password set (migrated from Clerk). Please Sign Up with this email to set your password." })
        }

        if (await bcrypt.compare(password, user.password)) {
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
        
        const application = await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        // Background AI pre-screening if resume text is cached
        const user = await User.findById(userId);
        const groqApiKey = process.env.GROK_API_KEY;
        if (user && user.resumeText && groqApiKey) {
            (async () => {
                try {
                    const groq = new Groq({ apiKey: groqApiKey });
                    const prompt = `Compare the candidate's resume with the job description to assess fit.
Job Title: ${jobData.title}
Job Description: ${jobData.description}

Candidate Resume:
${user.resumeText}

Analyze their experience, skills, and fit.
Provide:
1. An overall fit score between 0 and 100.
2. A brief 1-2 sentence "Resume TL;DR" summary badge next to each candidate, summarizing their top highlights and fit (e.g., "5 years React/Node experience. Lacks requested Kubernetes experience. Worked at Amazon."). Keep it under 150 characters.
3. exactly 3 tailored interview questions to ask this specific candidate based on gaps or interesting aspects of their profile.

Return the result as a valid JSON object matching this structure exactly (do not output markdown or any other explanation):
{
  "score": 85,
  "summary": "5 years React/Node experience. Lacks requested Kubernetes experience. Worked at Amazon.",
  "questions": ["Question 1?", "Question 2?", "Question 3?"]
}`;
                    const chatCompletion = await groq.chat.completions.create({
                        messages: [
                            { role: "system", content: "You are a professional recruiting assistant. Return ONLY valid JSON." },
                            { role: "user", content: prompt }
                        ],
                        model: "llama-3.3-70b-versatile",
                        temperature: 0.3,
                        response_format: { type: "json_object" }
                    });
                    const screenResult = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
                    
                    await JobApplication.findByIdAndUpdate(application._id, {
                        aiScore: screenResult.score ?? 50,
                        aiSummary: screenResult.summary ?? "Screened with AI.",
                        aiQuestions: screenResult.questions ?? []
                    });
                    console.log(`[Auto-Screener] Successfully pre-screened application ${application._id}`);
                } catch (e) {
                    console.error("[Auto-Screener] Error screening application:", e.message);
                }
            })();
        }

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
                const resumeText = text?.trim() || "";
                userData.resumeText = resumeText;

                // Extract structured profile details using Groq
                const groqApiKey = process.env.GROK_API_KEY;
                if (resumeText && groqApiKey) {
                    console.log(`[User Controller] Extracting structured profile for user ${userId} using Groq LLM...`);
                    const groq = new Groq({ apiKey: groqApiKey });
                    const prompt = `Extract structured profile information from this resume text.
Return ONLY a valid JSON object matching the following structure exactly (do not output markdown or any other explanation):
{
  "skills": ["Skill1", "Skill2", ...],
  "experience": [{"role": "Role Name", "company": "Company Name", "duration": "Duration (e.g. 2 years)"}],
  "education": [{"degree": "Degree", "school": "School/University", "year": "Graduation Year (e.g. 2024)"}],
  "github": "Github profile URL or empty string",
  "linkedin": "Linkedin profile URL or empty string",
  "portfolio": "Portfolio URL or empty string"
}

Resume Text:
${resumeText}`;

                    const chatCompletion = await groq.chat.completions.create({
                        messages: [
                            { role: "system", content: "You are a professional recruiting assistant. Return ONLY valid JSON." },
                            { role: "user", content: prompt }
                        ],
                        model: "llama-3.3-70b-versatile",
                        temperature: 0.2,
                        response_format: { type: "json_object" }
                    });

                    const parsedData = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
                    userData.skills = parsedData.skills || [];
                    userData.experience = parsedData.experience || [];
                    userData.education = parsedData.education || [];
                    userData.links = {
                        github: parsedData.github || "",
                        linkedin: parsedData.linkedin || "",
                        portfolio: parsedData.portfolio || ""
                    };
                }
            } catch (pdfError) {
                console.error("[User Controller] PDF parsing / profile extraction failed:", pdfError.message);
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

// Perform ATS Audit for a Job description vs user resume
export const auditJobATS = async (req, res) => {
    const { jobId } = req.params;
    const userId = req.auth?.userId;

    if (!userId) {
        return res.json({ success: false, message: "Not Authorized, Login Again" });
    }

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.json({ success: false, message: "Job Not Found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User Not Found" });
        }

        if (!user.resume) {
            return res.json({ success: false, message: "Please upload your resume first on the Profile page." });
        }

        let resumeText = user.resumeText;
        if (!resumeText) {
            console.log(`[ATS Audit] Resume text cache miss for user ${userId}. Downloading and parsing...`);
            try {
                const response = await axios.get(user.resume, { responseType: 'arraybuffer' });
                const pdf = await getDocumentProxy(new Uint8Array(response.data));
                const { text } = await extractText(pdf, { mergePages: true });
                resumeText = text?.trim() || "";

                if (resumeText) {
                    user.resumeText = resumeText;
                    await user.save();
                }
            } catch (pdfError) {
                console.error("[ATS Audit] Fallback PDF Parsing error:", pdfError.message);
                return res.json({ success: false, message: "Failed to extract text from your resume. Make sure it is a valid text-based PDF." });
            }
        }

        if (!resumeText) {
            return res.json({ success: false, message: "Your resume appears to be empty. Please upload a valid text-based PDF." });
        }

        const groqApiKey = process.env.GROK_API_KEY;
        if (!groqApiKey) {
            return res.json({ success: false, message: "Missing Groq API Key on server. Contact support." });
        }

        const groq = new Groq({ apiKey: groqApiKey });
        const prompt = `Compare the candidate's resume with the job description to perform an ATS (Applicant Tracking System) audit.
Job Title: ${job.title}
Job Description: ${job.description}

Candidate Resume:
${resumeText}

Analyze the match.
Provide:
1. An overall ATS Match Score (0 - 100%).
2. A list of critical missing skills or keywords that are requested in the job description but absent or weak in the resume.
3. Tailoring Suggestions: Specific recommendations on how the candidate can optimize or rephrase their resume bullets to better align with the job requirements.

Return the result as a valid JSON object matching this structure exactly (do not output markdown or any other explanation):
{
  "matchScore": 82,
  "missingSkills": ["Skill 1", "Skill 2"],
  "tailoringSuggestions": ["Suggestion 1", "Suggestion 2"]
}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a professional recruiting assistant. Return ONLY valid JSON." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        let auditResult;
        try {
            auditResult = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
        } catch (e) {
            return res.json({ success: false, message: "Failed to parse AI response. Please try again." });
        }

        res.json({
            success: true,
            audit: {
                matchScore: auditResult.matchScore ?? 50,
                missingSkills: auditResult.missingSkills ?? [],
                tailoringSuggestions: auditResult.tailoringSuggestions ?? []
            }
        });

    } catch (error) {
        console.error("ATS Audit Error:", error);
        res.json({ success: false, message: error.message });
    }
}
