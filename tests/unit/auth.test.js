import { describe, test } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
  generateOTP,
  refreshUserToken,
} from "../../src/modules/auth/auth.service.js";
import {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from "../../src/config/env.js";

describe("Auth Service Unit", () => {
  test("should generate a 6-digit OTP", () => {
    const otp = generateOTP();
    assert.match(otp, /^\d{6}$/);
  });

  test("should generate access token that can be verified", () => {
    const userId = "507f1f77bcf86cd799439011";
    const token = generateAccessToken(userId);
    const payload = jwt.verify(token, JWT_SECRET);

    assert.strictEqual(payload.userId, userId);
    assert.ok(payload.exp > payload.iat);
    assert.ok(JWT_EXPIRES_IN);
  });

  test("should generate refresh token that can be verified", () => {
    const userId = "507f1f77bcf86cd799439012";
    const token = generateRefreshToken(userId);
    const payload = jwt.verify(token, JWT_REFRESH_SECRET);

    assert.strictEqual(payload.userId, userId);
    assert.ok(payload.exp > payload.iat);
    assert.ok(JWT_REFRESH_EXPIRES_IN);
  });

  test("refreshUserToken should reject malformed token", async () => {
    await assert.rejects(
      () => refreshUserToken("not-a-valid-jwt"),
      (error) => {
        assert.strictEqual(error.status, 401);
        assert.match(error.message, /invalid refresh token/i);
        return true;
      }
    );
  });
});
