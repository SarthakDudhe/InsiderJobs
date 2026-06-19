import Job from "../models/Job.js"



//Get all jobs



export const getJobs = async (req, res) => {
    try {
        const { page, limit, title = '', location = '', categories = '', locations = '' } = req.query;

        const query = { visible: true };

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

        res.json({
            success: true,
            jobs,
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

   res.json({success:true,job})   
    } catch (error) {
        res.json({success:false,message:error.message})
    }
   
}