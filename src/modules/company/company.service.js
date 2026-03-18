import Company from "../../models/company.model.js";
import Job from "../../models/job.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.js";

// ── Create company ──────────────────────────────────────────────
export const createCompany = async (userId, data) => {
  const existing = await Company.findOne({ userId });
  if (existing) {
    const err = new Error("You already have a company profile");
    err.statusCode = 409;
    throw err;
  }

  const company = await Company.create({ userId, ...data });
  return company;
};

// ── Get company by ID ───────────────────────────────────────────
export const getCompanyById = async (companyId) => {
  const company = await Company.findById(companyId).populate(
    "userId",
    "firstName lastName email"
  );
  if (!company) {
    const err = new Error("Company not found");
    err.statusCode = 404;
    throw err;
  }
  return company;
};

// ── Get company by owner (userId) ───────────────────────────────
export const getMyCompany = async (userId) => {
  const company = await Company.findOne({ userId });
  if (!company) {
    const err = new Error("You do not have a company profile yet");
    err.statusCode = 404;
    throw err;
  }
  return company;
};

// ── Update company ──────────────────────────────────────────────
export const updateCompany = async (companyId, userId, data) => {
  const company = await Company.findById(companyId);
  if (!company) {
    const err = new Error("Company not found");
    err.statusCode = 404;
    throw err;
  }

  if (company.userId.toString() !== userId.toString()) {
    const err = new Error("Forbidden: you do not own this company");
    err.statusCode = 403;
    throw err;
  }

  Object.assign(company, data);
  await company.save();
  return company;
};

// ── Delete company ──────────────────────────────────────────────
export const deleteCompany = async (companyId, userId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    const err = new Error("Company not found");
    err.statusCode = 404;
    throw err;
  }

  if (company.userId.toString() !== userId.toString()) {
    const err = new Error("Forbidden: you do not own this company");
    err.statusCode = 403;
    throw err;
  }

  // Delete logo from Cloudinary if exists
  if (company.logoUrl) {
    await deleteFromCloudinary(company.logoUrl).catch(() => {});
  }

  await company.deleteOne();
};

// ── Upload logo ─────────────────────────────────────────────────
export const uploadCompanyLogo = async (companyId, userId, fileBuffer, mimetype) => {
  const company = await Company.findById(companyId);
  if (!company) {
    const err = new Error("Company not found");
    err.statusCode = 404;
    throw err;
  }

  if (company.userId.toString() !== userId.toString()) {
    const err = new Error("Forbidden: you do not own this company");
    err.statusCode = 403;
    throw err;
  }

  // Delete old logo if exists
  if (company.logoUrl) {
    await deleteFromCloudinary(company.logoUrl).catch(() => {});
  }

  const result = await uploadToCloudinary(fileBuffer, mimetype, {
    folder: "hire-dey-go/company-logos",
    transformation: [{ width: 400, height: 400, crop: "limit" }],
  });

  company.logoUrl = result.secure_url;
  await company.save();

  return { logoUrl: company.logoUrl };
};

// ── List jobs by company ────────────────────────────────────────
export const getJobsByCompany = async (companyId, query = {}) => {
  const company = await Company.findById(companyId);
  if (!company) {
    const err = new Error("Company not found");
    err.statusCode = 404;
    throw err;
  }

  const { page = 1, limit = 10, status = "ACTIVE" } = query;
  const skip = (page - 1) * limit;

  const filter = { companyId, ...(status !== "ALL" && { status }) };

  const [jobs, total] = await Promise.all([
    Job.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};
