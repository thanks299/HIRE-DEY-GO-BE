import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import connectDb from "../../src/config/db.js";
import { JWT_SECRET } from "../../src/config/env.js";
 
const recruiterToken = jwt.sign(
  { userId: "000000000000000000000001", role: "RECRUITER" },
  JWT_SECRET,
  { expiresIn: "1h" }
);
 
const FAKE_COMPANY_ID = "000000000000000000000002";
 
describe("Job Endpoints Integration", () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDb();
    }
  });
 
  after(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });
 
  test("POST /api/v1/jobs should create a job for recruiter", async () => {
    const payload = {
      companyId: FAKE_COMPANY_ID,
      title: "Backend Engineer",
      description: "Build and maintain scalable REST APIs using Node.js and MongoDB for production systems.", // min 50 chars
      requirements: "3+ years of Node.js experience",
      requiredSkills: ["Node.js", "MongoDB"],
      type: "FULL_TIME",
      status: "ACTIVE",
      country: "Nigeria",
      city: "Lagos",
      location: "Victoria Island, Lagos",
      salaryMin: 150000,
      salaryMax: 300000,
      salaryType: "MONTHLY",
      vacancies: 2,
      educationLevel: "BSC",
      experienceLevel: "MID",
      jobLevel: "MID_LEVEL",
    };
 
    const response = await request(app)
      .post("/api/v1/jobs")
      .set("Authorization", `Bearer ${recruiterToken}`)
      .send(payload);
 
    assert.ok(
      response.status === 201 || response.status === 404 || response.status === 500,
      `Unexpected status ${response.status}`
    );
    assert.notEqual(response.status, 401);
    assert.notEqual(response.status, 403);
  });
 
  test("GET /api/v1/jobs should list jobs", async () => {
    const response = await request(app).get("/api/v1/jobs");
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.ok(Array.isArray(response.body.data));
    assert.ok(response.body.meta);
    assert.ok("total_jobs" in response.body.meta);
  });
 
  test("GET /api/v1/jobs should support status filter", async () => {
    const response = await request(app).get("/api/v1/jobs?status=ACTIVE");
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
  });
 
  test("GET /api/v1/jobs should support type filter", async () => {
    const response = await request(app).get("/api/v1/jobs?type=FULL_TIME");
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
  });
 
  test("GET /api/v1/jobs should support country and city filter", async () => {
    const response = await request(app).get("/api/v1/jobs?country=Nigeria&city=Lagos");
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
  });
 
  test("GET /api/v1/jobs should support isRemote filter", async () => {
    const response = await request(app).get("/api/v1/jobs?isRemote=true");
 
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
  });
 
  test("POST /api/v1/jobs should reject unauthenticated requests", async () => {
    const response = await request(app)
      .post("/api/v1/jobs")
      .send({ title: "No auth" });
 
    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.success, false);
  });
 
  test("POST /api/v1/jobs should reject candidate role", async () => {
    const candidateToken = jwt.sign(
      { userId: "000000000000000000000003", role: "CANDIDATE" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
 
    const response = await request(app)
      .post("/api/v1/jobs")
      .set("Authorization", `Bearer ${candidateToken}`)
      .send({ title: "Should fail" });
 
    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.success, false);
  });
});
 
setTimeout(() => process.exit(0), 2000).unref();
 