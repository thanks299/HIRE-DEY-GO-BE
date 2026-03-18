import Bookmark from "../../models/bookmark.model.js";
import Job from "../../models/job.model.js";
import Company from "../../models/company.model.js";
import User from "../../models/user.model.js";

// ── Generic toggle helper ───────────────────────────────────────
const toggleBookmark = async (filter, createData) => {
  const existing = await Bookmark.findOne(filter);
  if (existing) {
    await existing.deleteOne();
    return { bookmarked: false };
  }
  await Bookmark.create(createData);
  return { bookmarked: true };
};

// ── Job Bookmarks (CANDIDATE) ───────────────────────────────────
export const toggleJobBookmark = async (userId, jobId) => {
  const job = await Job.findById(jobId);
  if (!job) {
    const err = new Error("Job not found");
    err.statusCode = 404;
    throw err;
  }

  return toggleBookmark(
    { userId, type: "JOB", jobId },
    { userId, type: "JOB", jobId }
  );
};

export const getBookmarkedJobs = async (userId, query = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const [bookmarks, total] = await Promise.all([
    Bookmark.find({ userId, type: "JOB" })
      .populate({
        path: "jobId",
        populate: { path: "companyId", select: "name logoUrl location" },
      })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Bookmark.countDocuments({ userId, type: "JOB" }),
  ]);

  return {
    jobs: bookmarks.map((b) => b.jobId).filter(Boolean),
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

// ── Company Bookmarks (CANDIDATE) ───────────────────────────────
export const toggleCompanyBookmark = async (userId, companyId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    const err = new Error("Company not found");
    err.statusCode = 404;
    throw err;
  }

  return toggleBookmark(
    { userId, type: "COMPANY", companyId },
    { userId, type: "COMPANY", companyId }
  );
};

export const getBookmarkedCompanies = async (userId, query = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const [bookmarks, total] = await Promise.all([
    Bookmark.find({ userId, type: "COMPANY" })
      .populate("companyId", "name logoUrl industry location size")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Bookmark.countDocuments({ userId, type: "COMPANY" }),
  ]);

  return {
    companies: bookmarks.map((b) => b.companyId).filter(Boolean),
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

// ── Candidate Bookmarks (RECRUITER) ────────────────────────────
export const toggleCandidateBookmark = async (userId, candidateId) => {
  const candidate = await User.findById(candidateId);
  if (!candidate || candidate.role !== "CANDIDATE") {
    const err = new Error("Candidate not found");
    err.statusCode = 404;
    throw err;
  }

  return toggleBookmark(
    { userId, type: "CANDIDATE", candidateId },
    { userId, type: "CANDIDATE", candidateId }
  );
};

export const getBookmarkedCandidates = async (userId, query = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const [bookmarks, total] = await Promise.all([
    Bookmark.find({ userId, type: "CANDIDATE" })
      .populate("candidateId", "firstName lastName email")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Bookmark.countDocuments({ userId, type: "CANDIDATE" }),
  ]);

  return {
    candidates: bookmarks.map((b) => b.candidateId).filter(Boolean),
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};
