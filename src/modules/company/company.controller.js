import asyncHandler from "../../utils/asyncHandler.js";
import * as companyService from "./company.service.js";
import { createCompanySchema, updateCompanySchema } from "./company.validation.js";

// POST /api/v1/companies
export const createCompany = asyncHandler(async (req, res) => {
  const { error, value } = createCompanySchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(", "),
    });
  }

  const company = await companyService.createCompany(req.user.userId, value);
  res.status(201).json({ success: true, data: company });
});

// GET /api/v1/companies/me
export const getMyCompany = asyncHandler(async (req, res) => {
  const company = await companyService.getMyCompany(req.user.userId);
  res.status(200).json({ success: true, data: company });
});

// GET /api/v1/companies/:id
export const getCompany = asyncHandler(async (req, res) => {
  const company = await companyService.getCompanyById(req.params.id);
  res.status(200).json({ success: true, data: company });
});

// PATCH /api/v1/companies/:id
export const updateCompany = asyncHandler(async (req, res) => {
  const { error, value } = updateCompanySchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(", "),
    });
  }

  const company = await companyService.updateCompany(req.params.id, req.user.userId, value);
  res.status(200).json({ success: true, data: company });
});

// DELETE /api/v1/companies/:id
export const deleteCompany = asyncHandler(async (req, res) => {
  await companyService.deleteCompany(req.params.id, req.user.userId);
  res.status(200).json({ success: true, message: "Company deleted successfully" });
});

// POST /api/v1/companies/:id/logo
export const uploadLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const result = await companyService.uploadCompanyLogo(
    req.params.id,
    req.user.userId,
    req.file.buffer,
    req.file.mimetype
  );

  res.status(200).json({ success: true, data: result });
});

// GET /api/v1/companies/:id/jobs
export const getCompanyJobs = asyncHandler(async (req, res) => {
  const result = await companyService.getJobsByCompany(req.params.id, req.query);
  res.status(200).json({ success: true, ...result });
});
