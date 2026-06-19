import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from 'cloudinary'
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from '../models/JobApplication.js'
import fs from 'fs';
import mongoose from "mongoose";
//Register a new Company




export const registerCompany = async (req, res) => {
  const { email, name, password } = req.body;
  const imageFile = req.file;
  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "Missing Details" })
  }
  try {
    const companyExists = await Company.findOne({ email })
    if (companyExists) {
      return res.json({ success: false, message: "Company Already Registered !" })
    }
   
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt)

    const imageUpload = await cloudinary.uploader.upload(imageFile.path)

    const company = await Company.create({
      name, email, password: hashpassword,
      image: imageUpload.secure_url
    })

    res.json({
      success: true, company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image
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
        if (company && await bcrypt.compare(password,company.password)) {
            company.lastActivity = new Date();
            await company.save();
            res.json({
                success:true,company:{
                _id:company._id,
                name:company.name,
                email:company.email,
                image:company.image
},token:generateToken(company._id)
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
        const applications = await JobApplication.find({companyId}).populate('userId','name image resume').populate('jobId','title location category level salary').exec()

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