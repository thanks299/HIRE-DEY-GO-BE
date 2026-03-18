import asyncHandler from "../../utils/asyncHandler.js";
import * as bookmarkService from "./bookmark.service.js";

// ── Job Bookmarks ───────────────────────────────────────────────

// POST /api/v1/bookmarks/jobs/:jobId
export const toggleJobBookmark = asyncHandler(async (req, res) => {
  const result = await bookmarkService.toggleJobBookmark(
    req.user.userId,
    req.params.jobId
  );
  const message = result.bookmarked ? "Job bookmarked" : "Job bookmark removed";
  res.status(200).json({ success: true, message, data: result });
});

// GET /api/v1/bookmarks/jobs
export const getBookmarkedJobs = asyncHandler(async (req, res) => {
  const result = await bookmarkService.getBookmarkedJobs(req.user.userId, req.query);
  res.status(200).json({ success: true, ...result });
});

// ── Company Bookmarks ───────────────────────────────────────────

// POST /api/v1/bookmarks/companies/:companyId
export const toggleCompanyBookmark = asyncHandler(async (req, res) => {
  const result = await bookmarkService.toggleCompanyBookmark(
    req.user.userId,
    req.params.companyId
  );
  const message = result.bookmarked ? "Company bookmarked" : "Company bookmark removed";
  res.status(200).json({ success: true, message, data: result });
});

// GET /api/v1/bookmarks/companies
export const getBookmarkedCompanies = asyncHandler(async (req, res) => {
  const result = await bookmarkService.getBookmarkedCompanies(req.user.userId, req.query);
  res.status(200).json({ success: true, ...result });
});

// ── Candidate Bookmarks ─────────────────────────────────────────

// POST /api/v1/bookmarks/candidates/:candidateId
export const toggleCandidateBookmark = asyncHandler(async (req, res) => {
  const result = await bookmarkService.toggleCandidateBookmark(
    req.user.userId,
    req.params.candidateId
  );
  const message = result.bookmarked ? "Candidate bookmarked" : "Candidate bookmark removed";
  res.status(200).json({ success: true, message, data: result });
});

// GET /api/v1/bookmarks/candidates
export const getBookmarkedCandidates = asyncHandler(async (req, res) => {
  const result = await bookmarkService.getBookmarkedCandidates(req.user.userId, req.query);
  res.status(200).json({ success: true, ...result });
});
