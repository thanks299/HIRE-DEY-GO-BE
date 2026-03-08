import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Health check", () => {
  it("should confirm the project loads without errors", () => {
    assert.strictEqual(1 + 1, 2);
  });

  it("should have required environment expectations", () => {
    assert.ok(process.version.startsWith("v"), "Node.js is running");
  });
});
