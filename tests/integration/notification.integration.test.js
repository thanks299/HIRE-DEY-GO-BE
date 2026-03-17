import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import connectDb from "../../src/config/db.js";
import Notification from "../../src/models/notification.js";

const JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

const adminToken = jwt.sign(
  { userId: "000000000000000000000001", role: "ADMIN" },
  JWT_SECRET,
  { expiresIn: "1h" }
);

describe("Notification Endpoints Integration", () => {
  let notification;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDb();
    }

    notification = await Notification.create({
      type: "NEW_RECRUITER",
      message: "Test notification",
      isRead: false,
    });
  });

  after(async () => {
    await Notification.deleteMany({ message: "Test notification" });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  test("GET /api/v1/notifications should return notifications", async () => {
    const response = await request(app)
      .get("/api/v1/notifications")
      .set("Authorization", `Bearer ${adminToken}`);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.ok(Array.isArray(response.body.data));
  });

  test("PATCH /api/v1/notifications/read-all should mark all as read", async () => {
    const response = await request(app)
      .patch("/api/v1/notifications/read-all")
      .set("Authorization", `Bearer ${adminToken}`);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.message, "All notifications marked as read");
  });

  test("PATCH /api/v1/notifications/:id/read should mark one as read", async () => {
    const response = await request(app)
      .patch(`/api/v1/notifications/${notification._id.toString()}/read`)
      .set("Authorization", `Bearer ${adminToken}`);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.data.isRead, true);
  });

  test("DELETE /api/v1/notifications/:id should delete a notification", async () => {
    const response = await request(app)
      .delete(`/api/v1/notifications/${notification._id.toString()}`)
      .set("Authorization", `Bearer ${adminToken}`);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(response.body.message, "Notification deleted successfully");
  });

  test("DELETE /api/v1/notifications/:id should return 404 for non-existent notification", async () => {
    const response = await request(app)
      .delete(`/api/v1/notifications/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${adminToken}`);

    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.success, false);
  });
});

setTimeout(() => process.exit(0), 2000).unref();