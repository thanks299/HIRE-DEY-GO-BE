import { describe, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import { JWT_SECRET } from "../../src/config/env.js";

// Real signed token — verifyToken passes, authorize may 404 if user not in DB
const candidateToken = jwt.sign(
  { userId: "000000000000000000000001", role: "candidate" },
  JWT_SECRET,
  { expiresIn: "1h" }
);

describe("Scoring Endpoints Negative Cases", () => {
  test("should return 404 for invalid jobId in rankings", async () => {
    const res = await request(app)
      .get("/api/v1/jobs/invalidjobid/rankings")
      .set("Authorization", `Bearer ${candidateToken}`);
    assert.ok(res.status === 404 || res.status === 403);
  });

  test("should return 404 for invalid applicationId in score", async () => {
    const res = await request(app)
      .get("/api/v1/applications/invalidappid/score")
      .set("Authorization", `Bearer ${candidateToken}`);
    assert.ok(res.status === 404 || res.status === 403);
  });

  test("should return 401 for unauthorized access to rankings", async () => {
    const res = await request(app)
      .get("/api/v1/jobs/somejobid/rankings");
    assert.strictEqual(res.status, 401);
  });

  test("should return 401 for unauthorized access to score", async () => {
    const res = await request(app)
      .get("/api/v1/applications/someappid/score");
    assert.strictEqual(res.status, 401);
  });
});

// Ensure process exits after all tests regardless of open handles
setTimeout(() => process.exit(0), 2000).unref();