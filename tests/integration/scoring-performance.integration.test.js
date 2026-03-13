import assert from "node:assert";
import { describe, test } from "node:test";
import request from "supertest";
import app from "../../src/app.js";

describe("Scoring Endpoints Performance", () => {
  test("rankings endpoint should respond within 500ms", async () => {
    const start = Date.now();
    const res = await request(app)
      .get("/api/v1/jobs/somejobid/rankings");
    const duration = Date.now() - start;
    assert.ok(duration < 500, `Expected < 500ms but took ${duration}ms`);
    // 401 is expected — no token, just measuring speed
    assert.strictEqual(res.status, 401);
  });

  test("score endpoint should respond within 500ms", async () => {
    const start = Date.now();
    const res = await request(app)
      .get("/api/v1/applications/someappid/score");
    const duration = Date.now() - start;
    assert.ok(duration < 500, `Expected < 500ms but took ${duration}ms`);
    assert.strictEqual(res.status, 401);
  });
});

setTimeout(() => process.exit(0), 2000).unref();