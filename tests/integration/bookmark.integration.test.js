import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import connectDb from "../../src/config/db.js";
import { JWT_SECRET } from "../../src/config/env.js";
import User from "../../src/models/user.model.js";
import Company from "../../src/models/company.model.js";
import Job from "../../src/models/job.model.js";
import Bookmark from "../../src/models/bookmark.model.js";
 
const TEST_PASSWORD = process.env.TEST_PASSWORD || "TestPassword123";
 
describe("Bookmark Endpoints Integration", () => {
  const suffix = Date.now();
  let recruiter, candidate;
  let recruiterToken, candidateToken;
  let company, job;
 
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDb();
    }
 
    recruiter = await User.create({
      firstName: "Recruiter",
      lastName: "Test",
      email: `recruiter-bookmark-${suffix}@example.com`,
      password: TEST_PASSWORD,
      role: "RECRUITER",
      isVerified: true,
    });
 
    candidate = await User.create({
      firstName: "Candidate",
      lastName: "Test",
      email: `candidate-bookmark-${suffix}@example.com`,
      password: TEST_PASSWORD,
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
 
    company = await Company.create({
      userId: recruiter._id,
      name: `Bookmark Co ${suffix}`,
      description: "Company for bookmark tests",
    });
 
    job = await Job.create({
      companyId: company._id,
      postedBy: recruiter._id,
      title: "Bookmark Test Job",
      description: "Job for bookmark tests",
      type: "FULL_TIME",
      status: "ACTIVE",
    });
  });
 
  after(async () => {
    await Bookmark.deleteMany({
      userId: { $in: [recruiter._id, candidate._id] },
    });
    await Job.deleteMany({ _id: job._id });
    await Company.deleteMany({ _id: company._id });
    await User.deleteMany({
      _id: { $in: [recruiter._id, candidate._id] },
    });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });
 
  // ── Job Bookmarks (CANDIDATE) ─────────────────────────────────
 
  test("POST /api/v1/bookmarks/jobs/:jobId should bookmark a job for candidate", async () => {
    const response = await request(app)
      .post(`/api/v1/bookmarks/jobs/${job._id}`)
      .set("Authorization", `Bearer ${candidateToken}`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data.bookmarked, true);
    assert.strictEqual(response.body.message, "Job bookmarked");
  });
 
  test("POST /api/v1/bookmarks/jobs/:jobId should remove bookmark on second call (toggle)", async () => {
    const response = await request(app)
      .post(`/api/v1/bookmarks/jobs/${job._id}`)
      .set("Authorization", `Bearer ${candidateToken}`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data.bookmarked, false);
    assert.strictEqual(response.body.message, "Job bookmark removed");
  });
 
  test("POST /api/v1/bookmarks/jobs/:jobId should return 403 for recruiter role", async () => {
    const response = await request(app)
      .post(`/api/v1/bookmarks/jobs/${job._id}`)
      .set("Authorization", `Bearer ${recruiterToken}`);
 
    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.success, false);
  });
 
  test("POST /api/v1/bookmarks/jobs/:jobId should return 404 for non-existent job", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .post(`/api/v1/bookmarks/jobs/${fakeId}`)
      .set("Authorization", `Bearer ${candidateToken}`);
 
    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.success, false);
  });
 
  test("POST /api/v1/bookmarks/jobs/:jobId should return 401 without token", async () => {
    const response = await request(app)
      .post(`/api/v1/bookmarks/jobs/${job._id}`);
 
    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.success, false);
  });
 
  test("GET /api/v1/bookmarks/jobs should return bookmarked jobs for candidate", async () => {
    // Re-bookmark the job first
    await request(app)
      .post(`/api/v1/bookmarks/jobs/${job._id}`)
      .set("Authorization", `Bearer ${candidateToken}`);
 
    const response = await request(app)
      .get("/api/v1/bookmarks/jobs")
      .set("Authorization", `Bearer ${candidateToken}`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.ok(Array.isArray(response.body.jobs));
    assert.ok(response.body.jobs.length >= 1);
    assert.ok(response.body.pagination);
  });
 
  test("GET /api/v1/bookmarks/jobs should return 403 for recruiter role", async () => {
    const response = await request(app)
      .get("/api/v1/bookmarks/jobs")
      .set("Authorization", `Bearer ${recruiterToken}`);
 
    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.success, false);
  });
 
  // ── Company Bookmarks (CANDIDATE) ─────────────────────────────
 
  test("POST /api/v1/bookmarks/companies/:companyId should bookmark a company for candidate", async () => {
    const response = await request(app)
      .post(`/api/v1/bookmarks/companies/${company._id}`)
      .set("Authorization", `Bearer ${candidateToken}`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data.bookmarked, true);
    assert.strictEqual(response.body.message, "Company bookmarked");
  });
 
  test("POST /api/v1/bookmarks/companies/:companyId should toggle off on second call", async () => {
    const response = await request(app)
      .post(`/api/v1/bookmarks/companies/${company._id}`)
      .set("Authorization", `Bearer ${candidateToken}`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.data.bookmarked, false);
    assert.strictEqual(response.body.message, "Company bookmark removed");
  });
 
  test("POST /api/v1/bookmarks/companies/:companyId should return 404 for non-existent company", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .post(`/api/v1/bookmarks/companies/${fakeId}`)
      .set("Authorization", `Bearer ${candidateToken}`);
 
    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.success, false);
  });
 
  test("GET /api/v1/bookmarks/companies should return bookmarked companies for candidate", async () => {
    // Re-bookmark the company first
    await request(app)
      .post(`/api/v1/bookmarks/companies/${company._id}`)
      .set("Authorization", `Bearer ${candidateToken}`);
 
    const response = await request(app)
      .get("/api/v1/bookmarks/companies")
      .set("Authorization", `Bearer ${candidateToken}`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.ok(Array.isArray(response.body.companies));
    assert.ok(response.body.companies.length >= 1);
    assert.ok(response.body.pagination);
  });
 
  test("GET /api/v1/bookmarks/companies should return 403 for recruiter role", async () => {
    const response = await request(app)
      .get("/api/v1/bookmarks/companies")
      .set("Authorization", `Bearer ${recruiterToken}`);
 
    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.success, false);
  });
 
  // ── Candidate Bookmarks (RECRUITER) ───────────────────────────
 
  test("POST /api/v1/bookmarks/candidates/:candidateId should bookmark a candidate for recruiter", async () => {
    const response = await request(app)
      .post(`/api/v1/bookmarks/candidates/${candidate._id}`)
      .set("Authorization", `Bearer ${recruiterToken}`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data.bookmarked, true);
    assert.strictEqual(response.body.message, "Candidate bookmarked");
  });
 
  test("POST /api/v1/bookmarks/candidates/:candidateId should toggle off on second call", async () => {
    const response = await request(app)
      .post(`/api/v1/bookmarks/candidates/${candidate._id}`)
      .set("Authorization", `Bearer ${recruiterToken}`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.data.bookmarked, false);
    assert.strictEqual(response.body.message, "Candidate bookmark removed");
  });
 
  test("POST /api/v1/bookmarks/candidates/:candidateId should return 403 for candidate role", async () => {
    const response = await request(app)
      .post(`/api/v1/bookmarks/candidates/${recruiter._id}`)
      .set("Authorization", `Bearer ${candidateToken}`);
 
    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.success, false);
  });
 
  test("POST /api/v1/bookmarks/candidates/:candidateId should return 404 for non-candidate user", async () => {
    // Trying to bookmark another recruiter (not a CANDIDATE role)
    const fakeId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .post(`/api/v1/bookmarks/candidates/${fakeId}`)
      .set("Authorization", `Bearer ${recruiterToken}`);
 
    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.success, false);
  });
 
  test("GET /api/v1/bookmarks/candidates should return bookmarked candidates for recruiter", async () => {
    // Re-bookmark the candidate first
    await request(app)
      .post(`/api/v1/bookmarks/candidates/${candidate._id}`)
      .set("Authorization", `Bearer ${recruiterToken}`);
 
    const response = await request(app)
      .get("/api/v1/bookmarks/candidates")
      .set("Authorization", `Bearer ${recruiterToken}`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.ok(Array.isArray(response.body.candidates));
    assert.ok(response.body.candidates.length >= 1);
    assert.ok(response.body.pagination);
  });
 
  test("GET /api/v1/bookmarks/candidates should return 403 for candidate role", async () => {
    const response = await request(app)
      .get("/api/v1/bookmarks/candidates")
      .set("Authorization", `Bearer ${candidateToken}`);
 
    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.success, false);
  });
 
  test("GET /api/v1/bookmarks/candidates should return 401 without token", async () => {
    const response = await request(app)
      .get("/api/v1/bookmarks/candidates");
 
    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.success, false);
  });
});
 
setTimeout(() => process.exit(0), 2000).unref();