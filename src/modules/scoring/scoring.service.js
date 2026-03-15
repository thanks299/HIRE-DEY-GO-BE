/**
 * Scoring Service
 * Handles job-fit score calculation, ranking, and candidate evaluation
 */

import {
  calculateSkillMatchScore,
  calculateCVRelevanceScore,
  calculateJobFitScore,
  getSkillAnalysis,
  normalizeScore,
} from "./scoring.helper.js";
import { Application, Job, Profile } from "../../models/index.js";
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
 * Get ranked candidates for a specific job
 * Fetches all applications for a job, calculates scores, and returns ranked list
 * @param {string} jobId - The job ID
 * @returns {object} - Ranked candidates with scores and details
 */
export const getRankedCandidatesForJob = async (jobId, requester) => {
  assertValidObjectId(jobId, "job ID");

  const job = await Job.findById(jobId).select("title requiredSkills postedBy");
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

  const applications = await Application.find({ jobId })
    .populate("userId", "email")
    .populate("assessmentResultId", "score maxScore percentage feedback completedAt timeTaken");

  if (applications.length === 0) {
    return {
      jobId,
      title: job.title,
      totalApplications: 0,
      candidates: [],
    };
  }

  const userIds = applications
    .map((application) => application.userId?._id)
    .filter(Boolean);

  const profiles = await Profile.find({ userId: { $in: userIds } })
    .select("userId skills experience education bio resumeUrl avatarUrl");

  const profileByUserId = new Map(
    profiles.map((profile) => [String(profile.userId), profile])
  );

  const candidatesWithScores = applications.map((application) => {
    const userId = application.userId?._id;
    const profile = userId ? profileByUserId.get(String(userId)) : null;
    const scoreBreakdown = calculateScoreBreakdown(application, job, profile);

    return {
      applicationId: application._id,
      userId,
      email: application.userId?.email || null,
      status: application.status,
      appliedAt: application.appliedAt,
      jobFitScore: scoreBreakdown.jobFitScore,
      scoreBreakdown: scoreBreakdown.breakdown,
      skillAnalysis: getSkillAnalysis(profile?.skills || [], job.requiredSkills || []),
    };
  });

  candidatesWithScores.sort((a, b) => b.jobFitScore - a.jobFitScore);

  candidatesWithScores.forEach((candidate, index) => {
    candidate.rank = index + 1;
  });

  await Application.bulkWrite(
    candidatesWithScores.map((candidate) => ({
      updateOne: {
        filter: { _id: candidate.applicationId },
        update: {
          $set: {
            rank: candidate.rank,
            jobFitScore: candidate.jobFitScore,
            scoreBreakdown: candidate.scoreBreakdown,
          },
        },
      },
    }))
  );

  return {
    jobId,
    title: job.title,
    totalApplications: candidatesWithScores.length,
    candidates: candidatesWithScores,
  };
};

/**
 * Calculate score breakdown for a specific application
 * @param {object} application - Application document
 * @param {object} job - Job document
 * @returns {object} - Score breakdown with component scores
 */
export const calculateScoreBreakdown = (application, job, profile = null) => {
  let assessmentScore = 0;
  let skillMatchScore = 0;
  let cvRelevanceScore = 0;

  // Step 1: Get assessment score
  if (application.assessmentResultId) {
    const assessmentResult = application.assessmentResultId;
    assessmentScore = assessmentResult.percentage || 0;
  }

  // Step 2: Get skill match score
  if (profile) {
    skillMatchScore = calculateSkillMatchScore(
      profile.skills,
      job.requiredSkills
    );

    // Step 3: Get CV relevance score
    cvRelevanceScore = calculateCVRelevanceScore(profile, job.requiredSkills);
  }

  // Step 4: Calculate overall job-fit score
  const jobFitScore = calculateJobFitScore(
    assessmentScore,
    skillMatchScore,
    cvRelevanceScore
  );

  return {
    jobFitScore: normalizeScore(jobFitScore),
    breakdown: {
      assessmentScore: normalizeScore(assessmentScore),
      skillMatchScore: normalizeScore(skillMatchScore),
      cvRelevanceScore: normalizeScore(cvRelevanceScore),
    },
  };
};

/**
 * Get detailed job-fit score breakdown for a specific application
 * @param {string} applicationId - The application ID
 * @returns {object} - Detailed score breakdown
 */
export const getJobFitScoreBreakdown = async (applicationId, requester) => {
  assertValidObjectId(applicationId, "application ID");

  const application = await Application.findById(applicationId)
    .populate("jobId", "title requiredSkills postedBy")
    .populate("userId", "email")
    .populate("assessmentResultId", "score maxScore percentage feedback completedAt timeTaken");

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

  const profile = await Profile.findOne({ userId: application.userId._id });

  const scoreBreakdown = calculateScoreBreakdown(application, job, profile);

  await Application.findByIdAndUpdate(application._id, {
    $set: {
      jobFitScore: scoreBreakdown.jobFitScore,
      scoreBreakdown: scoreBreakdown.breakdown,
    },
  });

  const assessmentResult = application.assessmentResultId;
  const assessmentFeedback = assessmentResult
    ? {
        score: assessmentResult.score,
        maxScore: assessmentResult.maxScore,
        percentage: assessmentResult.percentage,
        timeTaken: assessmentResult.timeTaken,
        feedback: assessmentResult.feedback,
        completedAt: assessmentResult.completedAt,
      }
    : null;

  const skillAnalysis = getSkillAnalysis(
    profile?.skills || [],
    job.requiredSkills || []
  );

  return {
    applicationId,
    jobId: job._id,
    jobTitle: job.title,
    status: application.status,
    appliedAt: application.appliedAt,
    jobFitScore: scoreBreakdown.jobFitScore,
    scoreBreakdown: scoreBreakdown.breakdown,
    assessmentFeedback,
    skillAnalysis,
    recommendations: generateRecommendations(scoreBreakdown, skillAnalysis, profile),
  };
};

/**
 * Generate recommendations for candidate based on their score breakdown
 * @param {object} scoreBreakdown - The score breakdown object
 * @param {object} skillAnalysis - Skill analysis data
 * @param {object} profile - Candidate's profile
 * @returns {array} - Array of recommendation strings
 */
const generateRecommendations = (scoreBreakdown, skillAnalysis, profile) => {
  const recommendations = [];

  const { assessmentScore, cvRelevanceScore } =
    scoreBreakdown.breakdown;

  // Assessment recommendations
  if (assessmentScore < 50) {
    recommendations.push(
      "Consider studying the required skills more thoroughly before reapplying"
    );
  } else if (assessmentScore < 75) {
    recommendations.push("Good effort! Practice more to improve your score");
  }

  // Skill match recommendations
  if (skillAnalysis.missingSkills && skillAnalysis.missingSkills.length > 0) {
    recommendations.push(
      `Consider learning: ${skillAnalysis.missingSkills.slice(0, 3).join(", ")}`
    );
  }

  // CV relevance recommendations
  if (cvRelevanceScore < 60) {
    if (!profile?.resumeUrl) {
      recommendations.push("Upload your resume to improve your CV relevance score");
    }
    if (!profile?.experience || profile.experience.length === 0) {
      recommendations.push("Add your work experience to strengthen your profile");
    }
  }

  return recommendations;
};
