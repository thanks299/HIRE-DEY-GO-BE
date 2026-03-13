import Job from "../../models/job.model.js";

export const getJobs = async (req, res, next) => {
  try {
    // --- Pagination ---
    const page = Math.max(1, Number.parseInt(req.query.page) || 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    // --- Filters ---
    const filter = {};

    if (req.query.status) filter.status = req.query.status.toUpperCase();
    if (req.query.type) filter.type = req.query.type.toUpperCase();
    if (req.query.category) filter.category = req.query.category;
    if (req.query.companyId) filter.companyId = req.query.companyId;
    if (req.query.postedBy) filter.postedBy = req.query.postedBy;
    if (req.query.skill) filter.requiredSkills = req.query.skill;
    if (req.query.search) filter.$text = { $search: req.query.search };

    // --- Sorting ---
    let sortOption;
    if (req.query.sort === "deadline") {
      sortOption = { deadline: 1 };
    } else if (req.query.sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else {
      sortOption = { createdAt: -1 }; // default newest
    }

    // --- Fetch jobs ---
    const jobs = await Job.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // --- Total jobs for meta ---
    const jobCount = await Job.countDocuments(filter);
    const totalPages = Math.ceil(jobCount / limit);

    // --- Response ---
    res.status(200).json({
      success: true,
      meta: {
        total_jobs: jobCount,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        length: jobs.length,
        next_page_url: page < totalPages
          ? `/api/v1/jobs?page=${page + 1}&limit=${limit}`
          : null
      },
      data: jobs
    });

  } catch (error) {
    next(error);
  }
};


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
            ...req.body,
            companyId: req.body.companyId,
            postedBy: req.userId,
            type: req.body.type?.toUpperCase() || "FULL_TIME",
            status: req.body.status?.toUpperCase() || "ACTIVE"
        })

        res.status(201).json({
            success: true,
            data: newJobPosting
        })

    } catch (error) {
        next(error)
    }
}

export const updateJob = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id);

        if(!job) {
            const error = new Error('Job details not found');
            error.statusCode = 404;
            throw error;
        }

        Object.assign(job, req.body);

        await job.save()

        res.status(200).json({ success: true, message:"Job posting updated successfully", job })
        
    } catch (error) {
        next(error)
    }
}

export const deleteJob = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await Job.findByIdAndDelete(id);

        if(!job) {
            const error = new Error('Job details not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, message: "Job posting deleted successfully" })
        
    } catch (error) {
        next(error)
    }
}

export const closeJobPosting = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id);

        if(!job) {
            const error = new Error('Job details not found');
            error.statusCode = 404;
            throw error;
        }

        job.status = "CLOSED";

        await job.save()

        res.status(200).json({ success: true, message:"Successfully closed job posting", job })
        
    } catch (error) {
        next(error)
    }
}