import { test, describe } from "node:test";
import assert from "node:assert";

describe("Auth Endpoints", () => {
  const testUser = {
    name: "Test User",
    email: `test-${Date.now()}@example.com`,
    password: process.env.TEST_PASSWORD || "testPassword123",
    role: "CANDIDATE"
  };

  const invalidPassword = process.env.INVALID_PASSWORD || "wrongPassword";

  test("POST /api/v1/auth/register should create a new user", async () => {
    const response = await fetch("http://localhost:5000/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    assert.strictEqual(response.status, 201);
    assert.strictEqual(data.success, true);
    assert.ok(data.tokens.accessToken);
    assert.ok(data.tokens.refreshToken);
  });

  test("POST /api/v1/auth/login should authenticate user and return tokens", async () => {
    const response = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    const data = await response.json();
    console.log("Login Response Status:", response.status);
    console.log("Login Response Body:", JSON.stringify(data, null, 2));
    
    assert.strictEqual(response.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.tokens.accessToken);
    assert.ok(data.tokens.refreshToken);
    assert.strictEqual(data.data.email, testUser.email);
  });

  test("POST /api/v1/auth/login should fail with invalid credentials", async () => {
    const response = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: invalidPassword
      })
    });
    
    const data = await response.json();
    assert.strictEqual(response.status, 401);
    assert.strictEqual(data.success, false);
  });
});