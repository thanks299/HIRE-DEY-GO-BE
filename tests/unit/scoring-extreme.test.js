import { describe, test } from "node:test";
import assert from "node:assert";
import { calculateSkillMatchScore, calculateCVRelevanceScore } from "../../src/modules/scoring/scoring.helper.js";

describe("Scoring Helper Extreme Values", () => {
  test("should handle very large skill lists", () => {
    const candidateSkills = new Array(1000).fill("Skill");
    const jobSkills = new Array(1000).fill("Skill");
    const score = calculateSkillMatchScore(candidateSkills, jobSkills);
    assert.strictEqual(score, 100);
  });

  test("should handle empty skill lists", () => {
    const score = calculateSkillMatchScore([], []);
    assert.strictEqual(score, 100);
  });

  test("should handle unusual CV profiles", () => {
    const profile = {
      bio: "",
      resumeUrl: "",
      education: [],
      experience: [],
      avatarUrl: "",
    };
    const score = calculateCVRelevanceScore(profile);
    assert.strictEqual(score, 0);
  });
});
