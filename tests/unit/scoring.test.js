import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { calculateScoreBreakdown } from "../../src/modules/scoring/scoring.service.js";
 
describe("Scoring Service Unit", () => {
  test("calculateScoreBreakdown should return assessmentScore from result", () => {
    const application = { assessmentResultId: { percentage: 80 } };
 
    const result = calculateScoreBreakdown(application);
 
    assert.strictEqual(result.assessmentScore, 80);
  });
 
  test("calculateScoreBreakdown should return 0 when no assessment result", () => {
    const result = calculateScoreBreakdown({ assessmentResultId: null });
 
    assert.strictEqual(result.assessmentScore, 0);
  });
 
  test("calculateScoreBreakdown should return 0 when assessmentResultId is undefined", () => {
    const result = calculateScoreBreakdown({});
 
    assert.strictEqual(result.assessmentScore, 0);
  });
});
 