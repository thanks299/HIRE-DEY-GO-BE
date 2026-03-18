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
 
const TEST_PASSWORD = process.env.TEST_PASSWORD || "TestPassword123";
 
describe("Company Endpoints Integration", () => {
  const suffix = Date.now();
  let recruiter, otherRecruiter, candidate;
  let recruiterToken, otherRecruiterToken, candidateToken;
  let company;
 
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDb();
    }
 
    recruiter = await User.create({
      firstName: "Recruiter",
      lastName: "Test",
      email: `recruiter-company-${suffix}@example.com`,
      password: TEST_PASSWORD,
      role: "RECRUITER",
      isVerified: true,
    });
 
    otherRecruiter = await User.create({
      firstName: "Other",
      lastName: "Recruiter",
      email: `other-recruiter-company-${suffix}@example.com`,
      password: TEST_PASSWORD,
      role: "RECRUITER",
      isVerified: true,
    });
 
    candidate = await User.create({
      firstName: "Candidate",
      lastName: "Test",
      email: `candidate-company-${suffix}@example.com`,
      password: TEST_PASSWORD,
      role: "CANDIDATE",
      isVerified: true,
    });
 
    recruiterToken = jwt.sign(
      { userId: recruiter._id, role: "RECRUITER" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
 
    otherRecruiterToken = jwt.sign(
      { userId: otherRecruiter._id, role: "RECRUITER" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
 
    candidateToken = jwt.sign(
      { userId: candidate._id, role: "CANDIDATE" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  });
 
  after(async () => {
    await Company.deleteMany({
      userId: { $in: [recruiter._id, otherRecruiter._id] },
    });
    await Job.deleteMany({ postedBy: recruiter._id });
    await User.deleteMany({
      _id: { $in: [recruiter._id, otherRecruiter._id, candidate._id] },
    });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });
 
  // ── Create ────────────────────────────────────────────────────
 
  test("POST /api/v1/companies should create a company for recruiter", async () => {
    const response = await request(app)
      .post("/api/v1/companies")
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({
        name: `Test Company ${suffix}`,
        description: "A test company",
        industry: "Technology",
        size: "11-50",
        location: "Lagos, Nigeria",
        website: "https://testcompany.com",
      });
 
    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data.name, `Test Company ${suffix}`);
    assert.ok(response.body.data._id);
 
    company = response.body.data;
  });
 
  test("POST /api/v1/companies should block candidate role", async () => {
    const response = await request(app)
      .post("/api/v1/companies")
      .set("Authorization", `Bearer ${candidateToken}`)
      .send({ name: "Candidate Company" });
 
    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.success, false);
  });
 
  test("POST /api/v1/companies should return 401 without token", async () => {
    const response = await request(app)
      .post("/api/v1/companies")
      .send({ name: "No Token Company" });
 
    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.success, false);
  });
 
  test("POST /api/v1/companies should return 400 when name is missing", async () => {
    const response = await request(app)
      .post("/api/v1/companies")
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({ description: "No name provided" });
 
    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.success, false);
  });
 
  test("POST /api/v1/companies should return 409 if recruiter already has a company", async () => {
    const response = await request(app)
      .post("/api/v1/companies")
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({ name: "Duplicate Company" });
 
    assert.strictEqual(response.status, 409);
    assert.strictEqual(response.body.success, false);
  });
 
  // ── Read ──────────────────────────────────────────────────────
 
  test("GET /api/v1/companies/me should return recruiter's own company", async () => {
    const response = await request(app)
      .get("/api/v1/companies/me")
      .set("Authorization", `Bearer ${recruiterToken}`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data._id, company._id);
  });
 
  test("GET /api/v1/companies/me should return 404 if recruiter has no company", async () => {
    const response = await request(app)
      .get("/api/v1/companies/me")
      .set("Authorization", `Bearer ${otherRecruiterToken}`);
 
    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.success, false);
  });
 
  test("GET /api/v1/companies/:id should return company publicly", async () => {
    const response = await request(app)
      .get(`/api/v1/companies/${company._id}`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data._id, company._id);
  });
 
  test("GET /api/v1/companies/:id should return 404 for non-existent company", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .get(`/api/v1/companies/${fakeId}`);
 
    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.success, false);
  });
 
  // ── Update ────────────────────────────────────────────────────
 
  test("PATCH /api/v1/companies/:id should update company for owner", async () => {
    const response = await request(app)
      .patch(`/api/v1/companies/${company._id}`)
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({ description: "Updated description", size: "51-200" });
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data.description, "Updated description");
    assert.strictEqual(response.body.data.size, "51-200");
  });
 
  test("PATCH /api/v1/companies/:id should return 403 for non-owner recruiter", async () => {
    const response = await request(app)
      .patch(`/api/v1/companies/${company._id}`)
      .set("Authorization", `Bearer ${otherRecruiterToken}`)
      .send({ description: "Hacked description" });
 
    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.success, false);
  });
 
  test("PATCH /api/v1/companies/:id should return 400 for empty update body", async () => {
    const response = await request(app)
      .patch(`/api/v1/companies/${company._id}`)
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({});
 
    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.success, false);
  });
 
  // ── Jobs by company ───────────────────────────────────────────
 
  test("GET /api/v1/companies/:id/jobs should return jobs for a company", async () => {
    // Create a job linked to this company
    await Job.create({
      companyId: company._id,
      postedBy: recruiter._id,
      title: "Test Job",
      description: "Job description",
      type: "FULL_TIME",
      status: "ACTIVE",
    });
 
    const response = await request(app)
      .get(`/api/v1/companies/${company._id}/jobs`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.ok(Array.isArray(response.body.jobs));
    assert.ok(response.body.jobs.length >= 1);
  });
 
  test("GET /api/v1/companies/:id/jobs should return 404 for non-existent company", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .get(`/api/v1/companies/${fakeId}/jobs`);
 
    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.success, false);
  });
 
  // ── Delete ────────────────────────────────────────────────────
 
  test("DELETE /api/v1/companies/:id should return 403 for non-owner", async () => {
    const response = await request(app)
      .delete(`/api/v1/companies/${company._id}`)
      .set("Authorization", `Bearer ${otherRecruiterToken}`);
 
    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.success, false);
  });
 
  test("DELETE /api/v1/companies/:id should delete company for owner", async () => {
    const response = await request(app)
      .delete(`/api/v1/companies/${company._id}`)
      .set("Authorization", `Bearer ${recruiterToken}`);
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
  });
 
  test("GET /api/v1/companies/:id should return 404 after deletion", async () => {
    const response = await request(app)
      .get(`/api/v1/companies/${company._id}`);
 
    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.success, false);
  });
});
 
setTimeout(() => process.exit(0), 2000).unref();
