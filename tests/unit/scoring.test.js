import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { calculateScoreBreakdown } from "../../src/modules/scoring/scoring.service.js";

describe("Scoring Service Unit", () => {
  test("calculateScoreBreakdown should combine assessment, skills, and cv relevance", () => {
    const application = { assessmentResultId: { percentage: 80 } };
    const job = { requiredSkills: ["Node.js", "MongoDB", "Docker"] };
    const profile = {
      skills: ["Node.js", "MongoDB"],
      bio: "Software engineer",
      resumeUrl: "https://example.com/resume.pdf",
      avatarUrl: "https://example.com/avatar.jpg",
      education: [{ institution: "Uni", degree: "BSc", from: new Date("2018-01-01") }],
      experience: [{ from: new Date("2020-01-01"), to: new Date("2023-01-01") }],
    };

    const result = calculateScoreBreakdown(application, job, profile);

    assert.ok(result.jobFitScore >= 0);
    assert.ok(result.jobFitScore <= 100);
    assert.strictEqual(result.breakdown.assessmentScore, 80);
    assert.ok(result.breakdown.skillMatchScore >= 0);
    assert.ok(result.breakdown.cvRelevanceScore >= 0);
  });

  test("calculateScoreBreakdown should return zeroed components when no data exists", () => {
    const result = calculateScoreBreakdown(
      { assessmentResultId: null },
      { requiredSkills: [] },
      null
    );

    assert.strictEqual(result.breakdown.assessmentScore, 0);
    assert.strictEqual(result.breakdown.skillMatchScore, 0);
    assert.strictEqual(result.breakdown.cvRelevanceScore, 0);
    assert.strictEqual(result.jobFitScore, 0);
  });
});
