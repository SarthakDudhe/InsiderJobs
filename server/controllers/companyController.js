import Company from "../models/Company.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from 'cloudinary'
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import Job from "../models/Job.js";
import JobApplication from '../models/JobApplication.js'
import fs from 'fs';
import mongoose from "mongoose";
import { Groq } from "groq-sdk";
import axios from "axios";
import { extractText, getDocumentProxy } from "unpdf";
//Register a new Company




export const registerCompany = async (req, res) => {
  const { email, name, password, recruiterName, linkedin } = req.body;
  const imageFile = req.file;
  if (!name || !email || !password || !imageFile || !recruiterName || !linkedin) {
    return res.json({ success: false, message: "Missing Details" })
  }
  
  // Work domain validation
  const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com'];
  const emailDomain = email.split('@')[1]?.toLowerCase();
  if (publicDomains.includes(emailDomain)) {
    return res.json({ success: false, message: "Corporate work email is required to register a company profile." })
  }

  try {
    const companyExists = await Company.findOne({ email })
    if (companyExists) {
      return res.json({ success: false, message: "Company Already Registered !" })
    }
   
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt)

    const imageUpload = await cloudinary.uploader.upload(imageFile.path)

    const verificationToken = crypto.randomBytes(32).toString('hex')

    const company = await Company.create({
      name, 
      email, 
      password: hashpassword,
      image: imageUpload.secure_url,
      recruiterName,
      linkedin,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })

    console.log("=== EMAIL VERIFICATION TOKEN FOR RECRIUTER ===");
    console.log(`Verify link: http://localhost:5000/api/company/verify-email?token=${verificationToken}`);

    res.json({
      success: true, 
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
        recruiterName: company.recruiterName,
        linkedin: company.linkedin,
        isEmailVerified: false,
        isVerified: false
      },
      token: generateToken(company._id)
    })

  } catch (error) {
    res.json({ success: false, message: error.message })
  } finally {
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("[Company Controller] Temp file cleanup error:", err.message);
      });
    }
  }
}



//Company Login

export const loginCompany = async (req,res) => {
    const {email,password} =req.body
    try {
        const company = await Company.findOne({email})
        if (company && company.password && await bcrypt.compare(password,company.password)) {
            company.lastActivity = new Date();
            
            // Auto-verify slack@demo.com
            if (email === 'slack@demo.com') {
                company.isEmailVerified = true;
                company.isVerified = true;
            }
            
            await company.save();
            res.json({
                success:true,
                company:{
                    _id:company._id,
                    name:company.name,
                    email:company.email,
                    image:company.image,
                    recruiterName:company.recruiterName,
                    linkedin:company.linkedin,
                    isVerified:company.isVerified,
                    isEmailVerified:company.isEmailVerified
                },
                token:generateToken(company._id)
            })
        }else{
            res.json({success:false,message:"Invalid Email or Password"})
        }

    } 
    catch (error) {
        res.json({success:false,message:error.message})
    }
}


//get Company data

export const getCompanydata = async (req,res) => {
    
    try {
    const company = req.company;

        res.json({success:true,company})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}


//Post a new Job

export const postjob = async (req,res) => {
    const {title,description,location,salary,level,category} = req.body;
    const companyId = req.company._id
    
    if (!req.company.isEmailVerified) {
        return res.json({ success: false, message: "Please verify your work email first before posting jobs." });
    }
    if (!req.company.isVerified) {
        return res.json({ success: false, message: "Your workspace is pending admin approval. You cannot post jobs publicly yet." });
    }

   try {
    const newJob = await Job.create({
        title,description,
        location,
        salary,
        companyId,
        date:Date.now(),
        level,category
    })

await newJob.save()
res.json({success:true,newJob})

   } catch (error) {
      res.json({success:false,message:error.message})
   }

}


//Get company Job Applications

export const getCompanyJobApplication = async (req,res) => {
    try {
        const companyId = req.company._id

        //Find job applications for the user & populate related data
        const applications = await JobApplication.find({companyId}).populate('userId','name image resume links').populate('jobId','title location category level salary').exec()

        return res.json({success:true,applications})
    } catch (error) {
         res.json({success:false,message:error.message})
    }
}

//Get Company Posted Jobs


export const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id
        const jobs = await Job.find({ companyId })

        // Aggregate applicant counts in a single query to solve N+1 database bottleneck
        const applicantCounts = await JobApplication.aggregate([
            { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
            { $group: { _id: "$jobId", count: { $sum: 1 } } }
        ])

        // Map array results to a lookup map for instant access
        const countMap = {}
        applicantCounts.forEach(item => {
            if (item._id) {
                countMap[item._id.toString()] = item.count
            }
        })

        // Build final job listings data mapping applicant count
        const jobsData = jobs.map(job => ({
            ...job.toObject(),
            applicants: countMap[job._id.toString()] || 0
        }))

        res.json({ success: true, jobsData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//Change Job Application Status

export const ChangeJobApplicationStatus = async (req,res) => {
    const {id,status} = req.body;
    //find job application and update the status
try {
     await JobApplication.findOneAndUpdate({_id:id},{status})

    res.json({success:true,message:"Status changed"})
} catch (error) {
     res.json({success:false,message:error.message})
}
   
}

//Change job Visibility

export const changeVisibility = async (req,res) => {
    try {
        const {id} = req.body

     const companyId = req.company._id
     const job = await Job.findById(id)
     if (companyId.toString() === job.companyId.toString()) {
        job.visible = !job.visible
     }


     await job.save()

     res.json({success:true,job})



    } catch (error) {
         res.json({success:false,message:error.message})
    }
}

// Verify Company Email
export const verifyCompanyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const company = await Company.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
    if (!company) {
      return res.status(400).send("<h1>Verification link is invalid or has expired.</h1>");
    }
    company.isEmailVerified = true;
    company.emailVerificationToken = undefined;
    company.emailVerificationExpires = undefined;
    await company.save();
    res.send("<h1>Email verified successfully! You can now access your recruiter console.</h1>");
  } catch (error) {
    res.status(500).send(`<h1>Server Error: ${error.message}</h1>`);
  }
}

// Resend Email Verification Link
export const resendCompanyVerificationEmail = async (req, res) => {
  try {
    const companyId = req.company._id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }
    if (company.isEmailVerified) {
      return res.json({ success: false, message: "Email is already verified" });
    }

    const token = crypto.randomBytes(32).toString('hex');
    company.emailVerificationToken = token;
    company.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await company.save();

    console.log("=== EMAIL VERIFICATION TOKEN FOR RECRIUTER ===");
    console.log(`Verify link: http://localhost:5000/api/company/verify-email?token=${token}`);

    res.json({ success: true, message: "Verification link generated! Check server logs." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// Screen Candidate Application with AI (Score, Summary, and Custom Questions)
export const screenApplication = async (req, res) => {
    const { applicationId } = req.body;
    const companyId = req.company._id;

    try {
        const application = await JobApplication.findById(applicationId)
            .populate('userId', 'name email resume resumeText')
            .populate('jobId', 'title description');

        if (!application) {
            return res.json({ success: false, message: "Application Not Found" });
        }

        // Verify this application belongs to the company calling the endpoint
        if (application.companyId.toString() !== companyId.toString()) {
            return res.json({ success: false, message: "Not Authorized to screen this application." });
        }

        const user = application.userId;
        const job = application.jobId;

        if (!user || !user.resume) {
            return res.json({ success: false, message: "Candidate does not have a resume uploaded." });
        }

        let resumeText = user.resumeText;
        if (!resumeText) {
            console.log(`[Recruiter Screener] Resume text cache miss for user ${user._id}. Downloading and parsing...`);
            try {
                const response = await axios.get(user.resume, { responseType: 'arraybuffer' });
                const pdf = await getDocumentProxy(new Uint8Array(response.data));
                const { text } = await extractText(pdf, { mergePages: true });
                resumeText = text?.trim() || "";

                if (resumeText) {
                    await mongoose.model('User').findByIdAndUpdate(user._id, { resumeText });
                }
            } catch (pdfError) {
                console.error("[Recruiter Screener] Fallback PDF Parsing error:", pdfError.message);
                return res.json({ success: false, message: "Failed to extract text from candidate resume. Invalid PDF." });
            }
        }

        if (!resumeText) {
            return res.json({ success: false, message: "Candidate resume text appears to be empty." });
        }

        const groqApiKey = process.env.GROK_API_KEY;
        if (!groqApiKey) {
            return res.json({ success: false, message: "Missing Groq API Key on server." });
        }

        const groq = new Groq({ apiKey: groqApiKey });
        const prompt = `Compare the candidate's resume with the job description to assess fit.
Job Title: ${job.title}
Job Description: ${job.description}

Candidate Resume:
${resumeText}

Analyze their experience, skills, and fit.
Provide:
1. An overall fit score between 0 and 100.
2. A brief 1-2 sentence "Resume TL;DR" summary badge next to each candidate, summarizing their top highlights and fit (e.g., "5 years React/Node experience. Lacks requested Kubernetes experience. Worked at Amazon."). Keep it under 150 characters.
3. Exactly 3 tailored interview questions to ask this specific candidate based on gaps or interesting aspects of their profile.
4. A model answer for each of those 3 questions (2-4 sentences each). These are example ideal answers a strong candidate would give — useful for the recruiter to benchmark against.

Return the result as a valid JSON object matching this structure exactly (do not output markdown or any other explanation):
{
  "score": 85,
  "summary": "5 years React/Node experience. Lacks requested Kubernetes experience. Worked at Amazon.",
  "questions": ["Question 1?", "Question 2?", "Question 3?"],
  "answers": ["Ideal answer for Q1.", "Ideal answer for Q2.", "Ideal answer for Q3."]
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

        let screenResult;
        try {
            screenResult = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
        } catch (e) {
            return res.json({ success: false, message: "Failed to parse AI screener response. Please try again." });
        }

        application.aiScore = screenResult.score ?? 50;
        application.aiSummary = screenResult.summary ?? "Screened with AI.";
        application.aiQuestions = screenResult.questions ?? [];
        application.aiAnswers = screenResult.answers ?? [];
        await application.save();

        res.json({
            success: true,
            message: "AI Screening complete!",
            application: {
                _id: application._id,
                aiScore: application.aiScore,
                aiSummary: application.aiSummary,
                aiQuestions: application.aiQuestions,
                aiAnswers: application.aiAnswers,
                status: application.status
            }
        });

    } catch (error) {
        console.error("AI Screen Application Error:", error);
        res.json({ success: false, message: error.message });
    }
}