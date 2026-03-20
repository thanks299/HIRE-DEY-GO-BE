/**
 * Scoring Service
 * Ranks candidates by highest assessment score.
 * Tie-breaker: earliest submission time.
 * Candidates who submit after the time limit are excluded from ranking,
 * marked as REJECTED, and receive a feedback prompt.
 */
 
import { Application, Job } from "../../models/index.js";
import Assessment from "../../models/assessment.model.js";
import mongoose from "mongoose";
 
const assertValidObjectId = (id, label) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Invalid ${label}`);
    error.status = 400;
    throw error;
  }
};
 
const canRecruiterAccessJob = (user, job) => {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  if (user.role !== "RECRUITER") return false;
  return String(job.postedBy) === String(user._id);
};
 
/**
 * Check if a candidate submitted within the allowed time limit.
 * Uses startedAt (started) vs completedAt (submitted) on the result.
 * Includes a 10-second grace period for network latency.
 */
const submittedOnTime = (result, timeLimitMinutes) => {
  if (!result?.completedAt || !result?.startedAt) return false;
 
  const timeTakenMs = new Date(result.completedAt) - new Date(result.startedAt);
  const timeLimitMs = timeLimitMinutes * 60 * 1000;
 
  return timeTakenMs <= timeLimitMs + 10_000;
};
 
/**
 * Get ranked candidates for a specific job.
 * - Only candidates who submitted on time are ranked.
 * - Candidates with no submission or late submission are rejected with feedback.
 * Ranking: highest assessment score first.
 * Tie-breaker: earliest completedAt time.
 */
export const getRankedCandidatesForJob = async (jobId, requester) => {
  assertValidObjectId(jobId, "job ID");
 
  const job = await Job.findById(jobId).select("title requiredSkills postedBy assessmentId");
  if (!job) {
    const error = new Error("Job not found");
    error.status = 404;
    throw error;
  }
 
  if (!canRecruiterAccessJob(requester, job)) {
    const error = new Error("You do not have permission to access this job ranking");
    error.status = 403;
    throw error;
  }
 
  // Get time limit from the linked assessment
  let timeLimitMinutes = null;
  if (job.assessmentId) {
    const assessment = await Assessment.findById(job.assessmentId).select("timeLimit");
    timeLimitMinutes = assessment?.timeLimit ?? null;
  }
 
  const applications = await Application.find({ jobId })
    .populate("userId", "email")
    .populate("assessmentResultId");
 
  if (applications.length === 0) {
    return {
      jobId,
      title: job.title,
      totalApplications: 0,
      totalRanked: 0,
      totalExcluded: 0,
      ranked: [],
      excluded: [],
    };
  }
 
  const ranked = [];
  const excluded = [];
  const bulkOps = [];
 
  for (const application of applications) {
    const result = application.assessmentResultId;
    const email = application.userId?.email || null;
    const userId = application.userId?._id;
 
    // ── Case 1: No submission at all ──────────────────────────
    if (!result) {
      excluded.push({
        applicationId: application._id,
        userId,
        email,
        status: "REJECTED",
        reason: "no_submission",
        feedback:
          "You did not submit the assessment. You have not been moved to the next stage.",
      });
 
      bulkOps.push({
        updateOne: {
          filter: { _id: application._id },
          update: {
            $set: { status: "REJECTED", rank: null, jobFitScore: 0 },
          },
        },
      });
 
      continue;
    }
 
    // ── Case 2: Late submission ───────────────────────────────
    if (timeLimitMinutes !== null && !submittedOnTime(result, timeLimitMinutes)) {
      excluded.push({
        applicationId: application._id,
        userId,
        email,
        status: "REJECTED",
        reason: "late_submission",
        submittedAt: result.completedAt,
        feedback: `Your assessment was submitted after the ${timeLimitMinutes}-minute time limit elapsed. You have not been moved to the next stage.`,
      });
 
      bulkOps.push({
        updateOne: {
          filter: { _id: application._id },
          update: {
            $set: { status: "REJECTED", rank: null, jobFitScore: 0 },
          },
        },
      });
 
      continue;
    }
 
    // ── Case 3: Valid on-time submission ──────────────────────
    ranked.push({
      applicationId: application._id,
      userId,
      email,
      status: application.status,
      appliedAt: application.appliedAt,
      assessmentScore: result.percentage ?? 0,
      rawScore: result.score ?? 0,
      maxScore: result.maxScore ?? 0,
      completedAt: result.completedAt,
      timeTaken: result.timeTaken ?? null,
      hasSubmitted: true,
    });
  }
 
  // ── Sort: highest score → earliest submission ─────────────────
  ranked.sort((a, b) => {
    if (b.assessmentScore !== a.assessmentScore) {
      return b.assessmentScore - a.assessmentScore;
    }
    return new Date(a.completedAt) - new Date(b.completedAt);
  });
 
  // Assign ranks and queue DB updates
  ranked.forEach((candidate, index) => {
    candidate.rank = index + 1;
 
    bulkOps.push({
      updateOne: {
        filter: { _id: candidate.applicationId },
        update: {
          $set: {
            rank: candidate.rank,
            jobFitScore: candidate.assessmentScore,
            status: "ASSESSED",
          },
        },
      },
    });
  });
 
  // Persist all updates in one round trip
  if (bulkOps.length > 0) {
    await Application.bulkWrite(bulkOps);
  }
 
  return {
    jobId,
    title: job.title,
    totalApplications: applications.length,
    totalRanked: ranked.length,
    totalExcluded: excluded.length,
    ranked,
    excluded,
  };
};
 
/**
 * Get score breakdown for a specific application.
 * Also returns feedback if the candidate was excluded.
 */
export const getJobFitScoreBreakdown = async (applicationId, requester) => {
  assertValidObjectId(applicationId, "application ID");
 
  const application = await Application.findById(applicationId)
    .populate("jobId", "title requiredSkills postedBy assessmentId")
    .populate("userId", "email")
    .populate("assessmentResultId");
 
  if (!application) {
    const error = new Error("Application not found");
    error.status = 404;
    throw error;
  }
 
  const job = application.jobId;
  const isOwnerCandidate = String(application.userId?._id) === String(requester?._id);
  const isAdmin = requester?.role === "ADMIN";
  const isAllowedRecruiter = canRecruiterAccessJob(requester, job);
 
  if (!isOwnerCandidate && !isAdmin && !isAllowedRecruiter) {
    const error = new Error("You do not have permission to view this score");
    error.status = 403;
    throw error;
  }
 
  const result = application.assessmentResultId;
 
  // Check time limit for context
  let timeLimitMinutes = null;
  let submittedLate = false;
  if (job.assessmentId) {
    const assessment = await Assessment.findById(job.assessmentId).select("timeLimit");
    timeLimitMinutes = assessment?.timeLimit ?? null;
    if (result && timeLimitMinutes !== null) {
      submittedLate = !submittedOnTime(result, timeLimitMinutes);
    }
  }
 
  // Build feedback for candidate
  let feedback = null;
  if (!result) {
    feedback =
      "You did not submit the assessment. You have not been moved to the next stage.";
  } else if (submittedLate) {
    feedback = `Your assessment was submitted after the ${timeLimitMinutes}-minute time limit elapsed. You have not been moved to the next stage.`;
  }
 
  return {
    applicationId,
    jobId: job._id,
    jobTitle: job.title,
    status: application.status,
    appliedAt: application.appliedAt,
    rank: application.rank ?? null,
    assessment: result
      ? {
          score: result.score,
          maxScore: result.maxScore,
          percentage: result.percentage,
          completedAt: result.completedAt,
          timeTaken: result.timeTaken,
          submittedLate,
        }
      : null,
    hasSubmitted: !!result,
    feedback,
  };
};
 
/**
 * calculateScoreBreakdown shim — kept for any existing imports.
 */
export const calculateScoreBreakdown = (application) => {
  const result = application.assessmentResultId;
  const percentage = result?.percentage ?? 0;
 
  return {
    assessmentScore: percentage,
  };
};
 