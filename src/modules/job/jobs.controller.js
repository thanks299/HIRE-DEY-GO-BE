import Job from "../../models/job.model.js";
import User from "../../models/user.model.js";
import { createNotification } from "../notification/notification.service.js";
import { NotificationTypes, createNotificationMessage } from "../notification/notification.templates.js";

const ENUM_FILTERS = ["status", "type", "jobLevel", "experienceLevel", "educationLevel", "salaryType"];
const PLAIN_FILTERS = ["category", "companyId", "postedBy", "country", "city"];
 
const buildFilter = (query) => {
  const filter = {};
  for (const key of ENUM_FILTERS) {
    if (query[key]) filter[key] = query[key].toUpperCase();
  }
  for (const key of PLAIN_FILTERS) {
    if (query[key]) filter[key] = query[key];
  }
  if (query.skill) filter.requiredSkills = query.skill;
  if (query.isRemote) filter.isRemote = query.isRemote === "true";
  if (query.search) filter.$text = { $search: query.search };
  return filter;
};
 
const buildSort = (sort) => {
  if (sort === "deadline") return { deadline: 1 };
  if (sort === "oldest") return { createdAt: 1 };
  return { createdAt: -1 };
};
 
// ── Controller ─────────────────────────────────────────────────
export const getJobs = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page) || 1);
    const limit = 10;
    const skip = (page - 1) * limit;
    const filter = buildFilter(req.query);
    const sortOption = buildSort(req.query.sort);
 
    const [jobs, jobCount] = await Promise.all([
      Job.find(filter)
        .populate({ path: "companyId", select: "name logoUrl location" })
        .populate({ path: "postedBy", select: "firstName lastName email" })
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Job.countDocuments(filter),
    ]);
 
    const totalPages = Math.ceil(jobCount / limit);
 
    res.status(200).json({
      success: true,
      meta: {
        total_jobs: jobCount,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        length: jobs.length,
        next_page_url: page < totalPages ? `/api/v1/jobs?page=${page + 1}&limit=${limit}` : null,
      },
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};
 
 
export const getJob = async (req, res, next) => {
  try {
    const { id } = req.params;
 
    const job = await Job.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate({ path: "companyId", select: "name logoUrl location website" })
      .populate({ path: "postedBy", select: "firstName lastName email" });
 
    if (!job) {
      const error = new Error("Job details not found");
      error.statusCode = 404;
      throw error;
    }
 
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};
 
export const createJob = async (req, res, next) => {
  try {
    const newJobPosting = await Job.create({
      ...req.body,
      postedBy: req.user.userId,
      type: req.body.type?.toUpperCase(),
      currency: req.body.currency?.toUpperCase() || "NGN",
      status: req.body.status?.toUpperCase() || "ACTIVE",
      salaryType: req.body.salaryType?.toUpperCase() || "MONTHLY",
      educationLevel: req.body.educationLevel?.toUpperCase() || "ANY",
      experienceLevel: req.body.experienceLevel?.toUpperCase(),
      jobLevel: req.body.jobLevel?.toUpperCase(),
      organizationType: req.body.organizationType?.toUpperCase(),
    });
 
    // Notify all verified candidates about new job posting
    const candidates = await User.find(
      { role: "CANDIDATE", isVerified: true, isBanned: false },
      { _id: 1 }
    );
 
    const notifications = candidates.map((candidate) => ({
      type: NotificationTypes.NEW_JOB_POSTED,
      message: createNotificationMessage(NotificationTypes.NEW_JOB_POSTED, {
        jobTitle: newJobPosting.title,
      }),
      userId: candidate._id,
    }));
 
    if (notifications.length > 0) {
      await createNotification(notifications);
    }
 
    res.status(201).json({
      success: true,
      message: "Job posting created successfully",
      data: newJobPosting,
    });
  } catch (error) {
    next(error);
  }
};
 
export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
 
    const job = await Job.findById(id);
 
    if (!job) {
      const error = new Error("Job posting not found");
      error.statusCode = 404;
      throw error;
    }
 
    // Only the recruiter who posted can update
    if (job.postedBy.toString() !== req.user.userId.toString()) {
      const error = new Error("Forbidden: you did not post this job");
      error.statusCode = 403;
      throw error;
    }
 
    // Normalize enum fields if provided
    const updates = { ...req.body };
    if (updates.type) updates.type = updates.type.toUpperCase();
    if (updates.currency) updates.currency = updates.currency.toUpperCase();
    if (updates.status) updates.status = updates.status.toUpperCase();
    if (updates.salaryType) updates.salaryType = updates.salaryType.toUpperCase();
    if (updates.educationLevel) updates.educationLevel = updates.educationLevel.toUpperCase();
    if (updates.experienceLevel) updates.experienceLevel = updates.experienceLevel.toUpperCase();
    if (updates.jobLevel) updates.jobLevel = updates.jobLevel.toUpperCase();
 
    Object.assign(job, updates);
    await job.save();
 
    res.status(200).json({
      success: true,
      message: "Job posting updated successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};
 
export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
 
    const job = await Job.findById(id);
 
    if (!job) {
      const error = new Error("Job details not found");
      error.statusCode = 404;
      throw error;
    }
 
    // Only the recruiter who posted can delete
    if (job.postedBy.toString() !== req.user.userId.toString()) {
      const error = new Error("Forbidden: you did not post this job");
      error.statusCode = 403;
      throw error;
    }
 
    await job.deleteOne();
 
    res.status(200).json({ success: true, message: "Job posting deleted successfully" });
  } catch (error) {
    next(error);
  }
};
 
export const closeJobPosting = async (req, res, next) => {
  try {
    const { id } = req.params;
 
    const job = await Job.findById(id);
 
    if (!job) {
      const error = new Error("Job details not found");
      error.statusCode = 404;
      throw error;
    }
 
    if (job.postedBy.toString() !== req.user.userId.toString()) {
      const error = new Error("Forbidden: you did not post this job");
      error.statusCode = 403;
      throw error;
    }
 
    if (job.status === "CLOSED") {
      const error = new Error("Job posting is already closed");
      error.statusCode = 400;
      throw error;
    }
 
    job.status = "CLOSED";
    await job.save();
 
    // Notify all verified candidates about job closing
    const candidates = await User.find(
      { role: "CANDIDATE", isVerified: true, isBanned: false },
      { _id: 1 }
    );
 
    const notifications = candidates.map((candidate) => ({
      type: NotificationTypes.JOB_CLOSED,
      message: createNotificationMessage(NotificationTypes.JOB_CLOSED, {
        jobTitle: job.title,
      }),
      userId: candidate._id,
    }));
 
    if (notifications.length > 0) {
      await createNotification(notifications);
    }
 
    res.status(200).json({
      success: true,
      message: "Successfully closed job posting",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};
 
export const getMyJobs = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page) || 1);
    const limit = 10;
    const skip = (page - 1) * limit;
 
    const filter = { postedBy: req.user.userId };
 
    if (req.query.status) filter.status = req.query.status.toUpperCase();
    if (req.query.type) filter.type = req.query.type.toUpperCase();
 
    let sortOption;
    if (req.query.sort === "deadline") {
      sortOption = { deadline: 1 };
    } else if (req.query.sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else {
      sortOption = { createdAt: -1 };
    }
 
    const [jobs, jobCount] = await Promise.all([
      Job.find(filter)
        .populate({ path: "companyId", select: "name logoUrl location" })
        .populate({ path: "postedBy", select: "firstName lastName email" })
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Job.countDocuments(filter),
    ]);
 
    const totalPages = Math.ceil(jobCount / limit);
 
    res.status(200).json({
      success: true,
      meta: {
        total_jobs: jobCount,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        length: jobs.length,
        next_page_url:
          page < totalPages
            ? `/api/v1/jobs/my-jobs?page=${page + 1}&limit=${limit}`
            : null,
      },
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};
 