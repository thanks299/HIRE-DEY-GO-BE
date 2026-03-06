import Job from "../models/job.model.js";

export const getJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find();
    
        res.status(200).json({ success: true, jobs })
    } catch (error) {
        next(error)
    }
}

export const getJob = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id);

        if(!job) {
            const error = new Error('Job details not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, job })
        
    } catch (error) {
        next(error)
    }
}

export const createJob = async (req, res, next) => {
    try {
        const newJobPosting = await Job.create({
            success: true,
            ...req.body,
            // companyId: 12,
            // postedBy: "John Doe",
            type: req.body.type.toUpperCase(),
            status: req.body.status.toUpperCase()
        })

        res.status(201).json({
            success: true,
            data: newJobPosting
        })

    } catch (error) {
        next(error)
    }
}