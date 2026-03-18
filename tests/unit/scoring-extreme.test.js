import { describe, test } from "node:test";
import assert from "node:assert";
import { calculateScoreBreakdown } from "../../src/modules/scoring/scoring.service.js";
 
describe("Scoring Service Extreme Values", () => {
  test("should handle 100% assessment score", () => {
    const application = { assessmentResultId: { percentage: 100 } };
    const result = calculateScoreBreakdown(application);
    assert.strictEqual(result.assessmentScore, 100);
  });
 
  test("should handle 0% assessment score", () => {
    const application = { assessmentResultId: { percentage: 0 } };
    const result = calculateScoreBreakdown(application);
    assert.strictEqual(result.assessmentScore, 0);
  });
 
  test("should handle missing assessmentResultId gracefully", () => {
    const result = calculateScoreBreakdown({ assessmentResultId: null });
    assert.strictEqual(result.assessmentScore, 0);
  });
 
  test("should handle empty application object gracefully", () => {
    const result = calculateScoreBreakdown({});
    assert.strictEqual(result.assessmentScore, 0);
  });
});