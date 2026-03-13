import { describe, test } from "node:test";
import assert from "node:assert";
import {
  calculateAssessmentScore,
  calculateSkillMatchScore,
  calculateCVRelevanceScore,
  calculateJobFitScore,
  getSkillAnalysis,
  normalizeScore,
} from "../../src/modules/scoring/scoring.helper.js";

describe("Scoring Helper Unit", () => {
  test("should calculate assessment score as percentage", () => {
    assert.strictEqual(calculateAssessmentScore(8, 10), 80);
    assert.strictEqual(calculateAssessmentScore(5, 0), 0);
  });

  test("should calculate skill match score from overlapping skills", () => {
    const score = calculateSkillMatchScore(
      ["Node.js", "MongoDB", "React"],
      ["Node.js", "MongoDB", "Docker", "TypeScript"]
    );

    assert.strictEqual(score, 50);
  });

  test("should return 100 when job has no required skills", () => {
    const score = calculateSkillMatchScore(["Node.js"], []);
    assert.strictEqual(score, 100);
  });

  test("should compute weighted job-fit score with default weights", () => {
    const result = calculateJobFitScore(80, 70, 60);
    assert.strictEqual(result, 73);
  });

  test("should compute CV relevance with profile completeness and experience", () => {
    const profile = {
      bio: "Backend engineer",
      resumeUrl: "https://example.com/resume.pdf",
      avatarUrl: "https://example.com/avatar.jpg",
      education: [{ institution: "Uni", degree: "BSc" }],
      experience: [
        {
          from: new Date("2020-01-01"),
          to: new Date("2024-01-01"),
        },
      ],
    };

    const score = calculateCVRelevanceScore(profile, ["Node.js"]);
    assert.ok(score >= 0);
    assert.ok(score <= 100);
  });
  
  test("should return matched and missing skill analysis", () => {
    const analysis = getSkillAnalysis(
      ["Node.js", "React"],
      ["Node.js", "MongoDB", "React"]
    );

    assert.deepStrictEqual(analysis.matchedSkills, ["Node.js", "React"]);
    assert.deepStrictEqual(analysis.missingSkills, ["MongoDB"]);
  });

  test("should normalize scores inside range", () => {
    assert.strictEqual(normalizeScore(130), 100);
    assert.strictEqual(normalizeScore(-10), 0);
    assert.strictEqual(normalizeScore(49.6), 50);
  });
});
