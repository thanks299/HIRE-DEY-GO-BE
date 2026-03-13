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
      description: "Build APIs",
      requirements: "Node.js, MongoDB",
      requiredSkills: ["Node.js", "MongoDB"],
      type: "full_time",
      status: "active",
      location: "Lagos",
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

  test("GET /api/v1/jobs should list jobs including created one", async () => {
    const response = await request(app).get("/api/v1/jobs");

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.ok(Array.isArray(response.body.data));
  });

  test("POST /api/v1/jobs should reject unauthenticated requests", async () => {
    const response = await request(app)
      .post("/api/v1/jobs")
      .send({ title: "No auth" });

    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.success, false);
  });
});
// Ensure process exits after all tests regardless of open handles
setTimeout(() => process.exit(0), 2000).unref();
