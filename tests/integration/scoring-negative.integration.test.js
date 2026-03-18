import { describe, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import { JWT_SECRET } from "../../src/config/env.js";
 
const candidateToken = jwt.sign(
  { userId: "000000000000000000000001", role: "CANDIDATE" },
  JWT_SECRET,
  { expiresIn: "1h" }
);
 
describe("Scoring Endpoints Negative Cases", () => {
  test("should return 400 for invalid jobId in rankings (RECRUITER role required)", async () => {
    const recruiterToken = jwt.sign(
      { userId: "000000000000000000000001", role: "RECRUITER" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    const res = await request(app)
      .get("/api/v1/jobs/invalidjobid/rankings")
      .set("Authorization", `Bearer ${recruiterToken}`);
    // Invalid ObjectId → 400
    assert.strictEqual(res.status, 400);
  });
 
  test("should return 403 for candidate trying to access rankings", async () => {
    const res = await request(app)
      .get("/api/v1/jobs/000000000000000000000001/rankings")
      .set("Authorization", `Bearer ${candidateToken}`);
    assert.strictEqual(res.status, 403);
  });
 
  test("should return 400 for invalid applicationId in score", async () => {
    const res = await request(app)
      .get("/api/v1/applications/invalidappid/score")
      .set("Authorization", `Bearer ${candidateToken}`);
    assert.strictEqual(res.status, 400);
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
 
setTimeout(() => process.exit(0), 2000).unref();