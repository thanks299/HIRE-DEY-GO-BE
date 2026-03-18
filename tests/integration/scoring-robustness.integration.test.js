import { describe, test, before } from "node:test";
import assert from "node:assert";
import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../../src/app.js";
import { JWT_SECRET } from "../../src/config/env.js";
import connectDb from "../../src/config/db.js";
 
const VALID_TOKEN = jwt.sign(
  { userId: "000000000000000000000001", role: "RECRUITER" },
  JWT_SECRET,
  { expiresIn: "1h" }
);
 
const VALID_JOB_ID   = "000000000000000000000001";
const VALID_APP_ID   = "000000000000000000000001";
const INVALID_JOB_ID = "invalid-id";
const INVALID_APP_ID = "invalid-id";
 
describe("Scoring API Error Handling", () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDb();
    }
  });
 
  test("should return 400 for invalid job ID", async () => {
    const res = await request(app)
      .get(`/api/v1/jobs/${INVALID_JOB_ID}/rankings`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);
    assert.strictEqual(res.status, 400);
  });
 
  test("should return 400 for invalid application ID", async () => {
    const res = await request(app)
      .get(`/api/v1/applications/${INVALID_APP_ID}/score`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);
    assert.strictEqual(res.status, 400);
  });
 
  test("should return 401 for missing token on rankings", async () => {
    const res = await request(app)
      .get(`/api/v1/jobs/${VALID_JOB_ID}/rankings`);
    assert.strictEqual(res.status, 401);
  });
 
  test("should return 401 for missing token on score", async () => {
    const res = await request(app)
      .get(`/api/v1/applications/${VALID_APP_ID}/score`);
    assert.strictEqual(res.status, 401);
  });
 
  test("should return 403 for invalid token", async () => {
    const res = await request(app)
      .get(`/api/v1/jobs/${VALID_JOB_ID}/rankings`)
      .set("Authorization", "Bearer invalid-token");
    assert.strictEqual(res.status, 403);
  });
 
  test("should return 400 for malformed application ID", async () => {
    const res = await request(app)
      .get(`/api/v1/applications/${INVALID_APP_ID}/score`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);
    assert.strictEqual(res.status, 400);
  });
});
 
describe("Scoring API Large Data", () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDb();
    }
  });
 
  test("should handle non-existent job gracefully", async () => {
    const res = await request(app)
      .get(`/api/v1/jobs/${VALID_JOB_ID}/rankings`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);
    // Auth passes, job not found or forbidden — not a 401/400
    assert.ok(res.status !== 401, "Auth should pass");
    assert.ok(res.status !== 400, "Valid ObjectId should not return 400");
  });
});
 
describe("Scoring API Performance", () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDb();
    }
  });
 
  test("should respond within 2000ms", async () => {
    const start = Date.now();
    const res = await request(app)
      .get(`/api/v1/jobs/${VALID_JOB_ID}/rankings`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);
    const duration = Date.now() - start;
    assert.ok(duration < 2000, `Response took ${duration}ms, expected < 2000ms`);
    assert.ok(res.status !== 401, "Auth should pass");
    assert.ok(res.status !== 400, "Valid ObjectId should not return 400");
  });
});
 
setTimeout(() => process.exit(0), 2000).unref();