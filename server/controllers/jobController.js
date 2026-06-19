import Job from "../models/Job.js"
import Company from "../models/Company.js"


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

        // Dynamically compute hiringActivity status for each job
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

        res.json({success:true,job: jobObj})   
    } catch (error) {
        res.json({success:false,message:error.message})
    }
   
}