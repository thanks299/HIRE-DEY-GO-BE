import { test, describe, before, after } from "node:test";
import assert from "node:assert";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import { MONGODB_URI } from "../src/config/env.js";

describe("Auth Endpoints", () => {
  before(async () => {
    await mongoose.connect(MONGODB_URI);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  const testUser = {
    firstName: "Test",
    lastName: "User",
    email: `test-${Date.now()}@example.com`,
    password: process.env.TEST_PASSWORD || "testPassword123",
    role: "CANDIDATE"
  };

  const invalidPassword = process.env.INVALID_PASSWORD || "wrongPassword";

  test("POST /api/v1/auth/register should create a new user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(testUser);
    
    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.success, true);
    assert.ok(response.body.tokens.accessToken);
    assert.ok(response.body.tokens.refreshToken);
  });

  test("POST /api/v1/auth/login should authenticate user and return tokens", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.ok(response.body.tokens.accessToken);
    assert.ok(response.body.tokens.refreshToken);
    assert.strictEqual(response.body.data.email, testUser.email);
  });

  test("POST /api/v1/auth/login should fail with invalid credentials", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testUser.email,
        password: invalidPassword
      });
    
    assert.strictEqual(response.status, 401);
    assert.strictEqual(response.body.success, false);
  });
});
