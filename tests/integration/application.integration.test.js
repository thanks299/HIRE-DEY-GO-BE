import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import connectDb from "../../src/config/db.js";
import { JWT_SECRET } from "../../src/config/env.js";
import User from "../../src/models/user.model.js";
import Job from "../../src/models/job.model.js";
import Application from "../../src/models/application.model.js";


// At the top of the file add this
const TEST_PASSWORD = process.env.TEST_PASSWORD || "TestPassword123";

describe("Application Endpoints Integration", () => {
  const suffix = Date.now();
  let recruiter, candidate;
  let recruiterToken, candidateToken;
  let job, application;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDb();
    }

    recruiter = await User.create({
      firstName: "Recruiter",
      lastName: "Test",
      email: `recruiter-app-${suffix}@example.com`,
      password: TEST_PASSWORD,
      role: "RECRUITER",
      isVerified: true,
    });

    candidate = await User.create({
      firstName: "Candidate",
      lastName: "Test",
      email: `candidate-app-${suffix}@example.com`,
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

    job = await Job.create({
      companyId: new mongoose.Types.ObjectId(),
      postedBy: recruiter._id,
      title: "Backend Engineer",
      description: "Build and maintain scalable REST APIs using Node.js and MongoDB for production systems.",
      requiredSkills: ["Node.js", "MongoDB"],
      type: "FULL_TIME",
      status: "ACTIVE",
    });

    application = await Application.create({
      jobId: job._id,
      userId: candidate._id,
      status: "APPLIED",
    });
  });

  after(async () => {
    await Application.deleteMany({ jobId: job._id });
    await Job.deleteMany({ _id: job._id });
    await User.deleteMany({
      _id: { $in: [recruiter._id, candidate._id] },
    });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  test("GET /api/v1/applications/job/:jobId should return applications for recruiter", async () => {
    const response = await request(app)
      .get(`/api/v1/applications/job/${job._id.toString()}`)
      .set("Authorization", `Bearer ${recruiterToken}`);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.ok(Array.isArray(response.body.data));
    assert.ok(response.body.data.length >= 1);
  });

  test("GET /api/v1/applications/job/:jobId should block candidate role", async () => {
    const response = await request(app)
      .get(`/api/v1/applications/job/${job._id.toString()}`)
      .set("Authorization", `Bearer ${candidateToken}`);

    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.success, false);
  });

  test("GET /api/v1/applications/job/:jobId should return 400 for invalid jobId", async () => {
    const response = await request(app)
      .get("/api/v1/applications/job/invalidid")
      .set("Authorization", `Bearer ${recruiterToken}`);

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.success, false);
  });

  test("PATCH /api/v1/applications/:id/status should update status for recruiter", async () => {
    const response = await request(app)
      .patch(`/api/v1/applications/${application._id.toString()}/status`)
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({ status: "SHORTLISTED" });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data.status, "SHORTLISTED");
  });

  test("PATCH /api/v1/applications/:id/status should fail with invalid status", async () => {
    const response = await request(app)
      .patch(`/api/v1/applications/${application._id.toString()}/status`)
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send({ status: "INVALID_STATUS" });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.success, false);
  });

  test("PATCH /api/v1/applications/:id/status should block candidate role", async () => {
    const response = await request(app)
      .patch(`/api/v1/applications/${application._id.toString()}/status`)
      .set("Authorization", `Bearer ${candidateToken}`)
      .send({ status: "SHORTLISTED" });

    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.success, false);
  });

  test("PATCH /api/v1/applications/:id/status should return 401 without token", async () => {
    const response = await request(app)
      .patch(`/api/v1/applications/${application._id.toString()}/status`)
      .send({ status: "SHORTLISTED" });

    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.success, false);
  });
});

setTimeout(() => process.exit(0), 2000).unref();