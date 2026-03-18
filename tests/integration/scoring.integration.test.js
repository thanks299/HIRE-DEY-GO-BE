import connectDb from '../../src/config/db.js';
import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import { JWT_SECRET } from "../../src/config/env.js";
import User from "../../src/models/user.model.js";
import Company from "../../src/models/company.model.js";
import Job from "../../src/models/job.model.js";
import Assessment from "../../src/models/assessment.model.js";
import Profile from "../../src/models/profile.model.js";
import Application from "../../src/models/application.model.js";
import AssessmentResult from "../../src/models/assessmentResult.model.js";
 
describe("Scoring Endpoints Integration", () => {
  const suffix = Date.now();
  let recruiter, candidate, outsider;
  let recruiterToken, candidateToken, outsiderToken;
  let company, job, assessment, application;
 
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDb();
    }
 
    recruiter = await User.create({
      firstName: "Recruiter",
      lastName: "User",
      email: `recruiter-score-${suffix}@example.com`,
      password: process.env.TEST_USER_PASSWORD || "TestPassword!@#",
      role: "RECRUITER",
      isVerified: true,
    });
 
    candidate = await User.create({
      firstName: "Candidate",
      lastName: "User",
      email: `candidate-score-${suffix}@example.com`,
      password: process.env.TEST_USER_PASSWORD || "TestPassword!@#",
      role: "CANDIDATE",
      isVerified: true,
    });
 
    outsider = await User.create({
      firstName: "Outsider",
      lastName: "User",
      email: `outsider-score-${suffix}@example.com`,
      password: process.env.TEST_USER_PASSWORD || "TestPassword!@#",
      role: "CANDIDATE",
      isVerified: true,
    });
 
    recruiterToken = jwt.sign(
      { userId: recruiter._id, role: "RECRUITER" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    candidateToken = jwt.sign(
      { userId: candidate._id, role: "CANDIDATE" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    outsiderToken = jwt.sign(
      { userId: outsider._id, role: "CANDIDATE" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
 
    company = await Company.create({
      userId: recruiter._id,
      name: `Scoring Co ${suffix}`,
      description: "Scoring test company",
    });
 
    // Create assessment with a 30-minute time limit
    assessment = await Assessment.create({
      createdBy: recruiter._id,
      title: `Test Assessment ${suffix}`,
      description: "Test",
      skills: ["Node.js"],
      questions: [
        {
          questionText: "What is Node.js?",
          type: "SHORT_ANSWER",
          correctAnswer: "A JS runtime",
          points: 10,
        },
      ],
      timeLimit: 30,
      totalPoints: 10,
    });
 
    job = await Job.create({
      companyId: company._id,
      postedBy: recruiter._id,
      title: "Node Engineer",
      description: "Build backend services",
      requiredSkills: ["Node.js", "MongoDB"],
      type: "FULL_TIME",
      status: "ACTIVE",
      assessmentId: assessment._id,
    });
 
    await Profile.create({
      userId: candidate._id,
      bio: "Backend dev",
      skills: ["Node.js", "MongoDB"],
      resumeUrl: "https://example.com/resume.pdf",
    });
 
    // Create an on-time assessment result
    // createdAt = now - 20 minutes, completedAt = now (within 30min limit)
    const startedAt = new Date(Date.now() - 20 * 60 * 1000);
    const assessmentResult = await AssessmentResult.create({
      assessmentId: assessment._id,
      userId: candidate._id,
      jobId: job._id,
      answers: [],
      score: 8,
      maxScore: 10,
      feedback: "Strong performance",
      timeTaken: 1200,
      createdAt: startedAt,
      completedAt: new Date(),
    });
 
    application = await Application.create({
      jobId: job._id,
      userId: candidate._id,
      assessmentResultId: assessmentResult._id,
      status: "ASSESSED",
    });
  });
 
  after(async () => {
    await Application.deleteMany({ jobId: job._id });
    await AssessmentResult.deleteMany({ jobId: job._id });
    await Profile.deleteMany({ userId: { $in: [candidate._id, outsider._id] } });
    await Assessment.deleteMany({ _id: assessment._id });
    await Job.deleteMany({ _id: job._id });
    await Company.deleteMany({ _id: company._id });
    await User.deleteMany({
      _id: { $in: [recruiter._id, candidate._id, outsider._id] },
    });
 
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
 
    setTimeout(() => process.exit(0), 500);
  });
 
  test("GET /api/v1/jobs/:jobId/rankings should return ranked candidates for recruiter", async () => {
    const response = await request(app)
      .get(`/api/v1/jobs/${job._id.toString()}/rankings`)
      .set("Authorization", `Bearer ${recruiterToken}`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data.jobId, job._id.toString());
    assert.strictEqual(response.body.data.totalApplications, 1);
    assert.strictEqual(response.body.data.totalRanked, 1);
    assert.strictEqual(response.body.data.totalExcluded, 0);
    assert.strictEqual(response.body.data.ranked[0].applicationId, application._id.toString());
    assert.strictEqual(response.body.data.ranked[0].rank, 1);
    assert.ok(response.body.data.ranked[0].assessmentScore >= 0);
  });
 
  test("GET /api/v1/jobs/:jobId/rankings should block candidate role", async () => {
    const response = await request(app)
      .get(`/api/v1/jobs/${job._id.toString()}/rankings`)
      .set("Authorization", `Bearer ${candidateToken}`);
 
    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.success, false);
  });
 
  test("GET /api/v1/applications/:applicationId/score should allow owner candidate", async () => {
    const response = await request(app)
      .get(`/api/v1/applications/${application._id.toString()}/score`)
      .set("Authorization", `Bearer ${candidateToken}`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data.applicationId, application._id.toString());
    assert.ok(response.body.data.assessment !== null);
    assert.ok(response.body.data.hasSubmitted === true);
  });
 
  test("GET /api/v1/applications/:applicationId/score should block unrelated candidate", async () => {
    const response = await request(app)
      .get(`/api/v1/applications/${application._id.toString()}/score`)
      .set("Authorization", `Bearer ${outsiderToken}`);
 
    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.success, false);
  });
 
  test("excluded candidate should have feedback and null rank", async () => {
    // Create a candidate with no assessment submission
    const noSubmitCandidate = await User.create({
      firstName: "NoSubmit",
      lastName: "User",
      email: `nosubmit-${suffix}@example.com`,
      password: process.env.TEST_USER_PASSWORD || "TestPassword!@#",
      role: "CANDIDATE",
      isVerified: true,
    });
 
    await Application.create({
      jobId: job._id,
      userId: noSubmitCandidate._id,
      assessmentResultId: null,
      status: "APPLIED",
    });
 
    const response = await request(app)
      .get(`/api/v1/jobs/${job._id.toString()}/rankings`)
      .set("Authorization", `Bearer ${recruiterToken}`);
 
    assert.strictEqual(response.status, 200);
    const excluded = response.body.data.excluded;
    assert.ok(excluded.length >= 1);
 
    const noSubmit = excluded.find(
      (e) => e.userId === noSubmitCandidate._id.toString()
    );
    assert.ok(noSubmit, "No-submit candidate should be in excluded list");
    assert.strictEqual(noSubmit.reason, "no_submission");
    assert.ok(noSubmit.feedback);
    assert.strictEqual(noSubmit.status, "REJECTED");
 
    // Cleanup
    await Application.deleteMany({ userId: noSubmitCandidate._id });
    await User.deleteMany({ _id: noSubmitCandidate._id });
  });
});
 