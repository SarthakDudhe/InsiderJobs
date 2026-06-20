import Job from "../models/Job.js"
import Company from "../models/Company.js"
import JobApplication from "../models/JobApplication.js"


//Get all jobs

export const getJobs = async (req, res) => {
    try {
        const { page, limit, title = '', location = '', categories = '', locations = '' } = req.query;

        // Filter out unverified companies
        const verifiedCompanies = await Company.find({ isVerified: true }).select('_id');
        const verifiedCompanyIds = verifiedCompanies.map(c => c._id);

        const query = { visible: true, companyId: { $in: verifiedCompanyIds } };

        // Search by title
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        // Search by location
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Filter by categories (comma-separated list)
        if (categories) {
            const categoryArray = categories.split(',').filter(Boolean);
            if (categoryArray.length > 0) {
                query.category = { $in: categoryArray };
            }
        }

        // Filter by locations (comma-separated list)
        if (locations) {
            const locationArray = locations.split(',').filter(Boolean);
            if (locationArray.length > 0) {
                query.location = { $in: locationArray };
            }
        }

        let queryBuilder = Job.find(query).populate({ path: 'companyId', select: "-password" }).sort({ date: -1 });

        // Apply pagination if parameters are explicitly passed
        const totalJobs = await Job.countDocuments(query);
        let parsedPage = 1;
        let parsedLimit = totalJobs || 6;

        if (page && limit) {
            parsedPage = parseInt(page);
            parsedLimit = parseInt(limit);
            const skip = (parsedPage - 1) * parsedLimit;
            queryBuilder = queryBuilder.skip(skip).limit(parsedLimit);
        }

        const jobs = await queryBuilder;

        // Fetch application stats for all returned companies in one batch
        const companyIds = [...new Set(jobs.map(job => job.companyId?._id?.toString()).filter(Boolean))];
        const applications = await JobApplication.find({ companyId: { $in: companyIds } });

        const companyStats = {};
        applications.forEach(app => {
            const cid = app.companyId.toString();
            if (!companyStats[cid]) {
                companyStats[cid] = { total: 0, responded: 0, totalDays: 0 };
            }
            companyStats[cid].total += 1;
            if (app.status !== 'Pending') {
                companyStats[cid].responded += 1;
                const diffTime = Math.abs(new Date(app.updatedAt) - new Date(app.createdAt));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                companyStats[cid].totalDays += diffDays;
            }
        });

        // Dynamically compute hiringActivity status and response stats for each job
        const jobsWithActivity = jobs.map(job => {
            const jobObj = job.toObject();
            const lastActivity = jobObj.companyId ? jobObj.companyId.lastActivity : null;
            let hiringActivity = 'stale';
            if (lastActivity) {
                const diffTime = Math.abs(new Date() - new Date(lastActivity));
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                if (diffDays <= 7) {
                    hiringActivity = 'active';
                } else if (diffDays <= 21) {
                    hiringActivity = 'slow';
                }
            }
            jobObj.hiringActivity = hiringActivity;

            // Attach response stats
            const cid = jobObj.companyId?._id?.toString();
            const stats = companyStats[cid];
            let responseRate = 100;
            let averageDecisionDays = 3;
            let hasApplicants = false;
            if (stats) {
                hasApplicants = stats.total > 0;
                responseRate = stats.total > 0 ? Math.round((stats.responded / stats.total) * 100) : 100;
                averageDecisionDays = stats.responded > 0 ? Math.round(stats.totalDays / stats.responded) : 3;
            }
            if (jobObj.companyId) {
                jobObj.companyId.responseRate = responseRate;
                jobObj.companyId.averageDecisionDays = averageDecisionDays;
                jobObj.companyId.hasApplicants = hasApplicants;
            }

            return jobObj;
        });

        res.json({
            success: true,
            jobs: jobsWithActivity,
            totalJobs,
            currentPage: parsedPage,
            totalPages: Math.ceil(totalJobs / parsedLimit)
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//Get a single job by id

export const getJobById = async (req,res) => {

    try {
        const {id} = req.params

        const job = await Job.findById(id).populate({
            path:'companyId',
            select:'-password'
        })
        if (!job) {
            return res.json({success:false,message:"Job Not Found ! "})
        }

        const jobObj = job.toObject();
        const lastActivity = jobObj.companyId ? jobObj.companyId.lastActivity : null;
        let hiringActivity = 'stale';
        if (lastActivity) {
            const diffTime = Math.abs(new Date() - new Date(lastActivity));
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            if (diffDays <= 7) {
                hiringActivity = 'active';
            } else if (diffDays <= 21) {
                hiringActivity = 'slow';
            }
        }
        jobObj.hiringActivity = hiringActivity;

        // Fetch application stats for this company
        if (jobObj.companyId) {
            const cid = jobObj.companyId._id.toString();
            const applications = await JobApplication.find({ companyId: cid });
            
            let total = 0;
            let responded = 0;
            let totalDays = 0;
            applications.forEach(app => {
                total += 1;
                if (app.status !== 'Pending') {
                    responded += 1;
                    const diffTime = Math.abs(new Date(app.updatedAt) - new Date(app.createdAt));
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    totalDays += diffDays;
                }
            });

            jobObj.companyId.hasApplicants = total > 0;
            jobObj.companyId.responseRate = total > 0 ? Math.round((responded / total) * 100) : 100;
            jobObj.companyId.averageDecisionDays = responded > 0 ? Math.round(totalDays / responded) : 3;
        }

        res.json({success:true,job: jobObj})   
    } catch (error) {
        res.json({success:false,message:error.message})
    }
   
}

// Report a Job
export const reportJob = async (req, res) => {
    const { id } = req.params;
    const { reason, userId } = req.body;
    try {
        const job = await Job.findById(id);
        if (!job) {
            return res.json({ success: false, message: "Job not found" });
        }
        
        job.reports.push({
            userId: userId || 'Anonymous',
            reason: reason || 'Unspecified Reason'
        });
        
        await job.save();
        res.json({ success: true, message: "Job reported successfully. Our admin team will review it." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}