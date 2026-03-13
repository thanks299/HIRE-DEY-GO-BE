/**
 * Helper functions for job-fit score calculation
 * Includes assessment scoring, skill matching, and CV relevance
 */

/**
 * Calculate assessment score as a percentage
 * @param {number} score - User's assessment score
 * @param {number} maxScore - Maximum possible score
 * @returns {number} - Percentage score (0-100)
 */
export const calculateAssessmentScore = (score, maxScore) => {
  if (!maxScore || maxScore === 0) return 0;
  return Math.min(100, (score / maxScore) * 100);
};

/**
 * Calculate skill match score
 * Compares candidate's skills with required job skills
 * @param {string[]} candidateSkills - Skills from candidate's profile
 * @param {string[]} requiredSkills - Required skills from job posting
 * @returns {number} - Score 0-100 based on skill overlap
 */
export const calculateSkillMatchScore = (candidateSkills = [], requiredSkills = []) => {
  if (!requiredSkills || requiredSkills.length === 0) return 100; // No required skills = perfect match

  const candidateSkillsLower = new Set(
    candidateSkills.map((skill) =>
      skill.toLowerCase().trim()
    )
  );
  const requiredSkillsLower = requiredSkills.map((skill) =>
    skill.toLowerCase().trim()
  );

  // Count how many required skills the candidate has
  const matchedSkills = requiredSkillsLower.filter((skill) =>
    candidateSkillsLower.has(skill)
  ).length;

  // Calculate percentage match
  return (matchedSkills / requiredSkillsLower.length) * 100;
};

/**
 * Build matched and missing skill lists for response payloads
 * @param {string[]} candidateSkills
 * @param {string[]} requiredSkills
 * @returns {{candidateSkills: string[], requiredSkills: string[], matchedSkills: string[], missingSkills: string[]}}
 */
export const getSkillAnalysis = (candidateSkills = [], requiredSkills = []) => {
  const normalizedCandidateSkills = candidateSkills.map((skill) =>
    skill.toLowerCase().trim()
  );

  const candidateSkillSet = new Set(normalizedCandidateSkills);

  const matchedSkills = requiredSkills.filter((skill) =>
    candidateSkillSet.has(skill.toLowerCase().trim())
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !candidateSkillSet.has(skill.toLowerCase().trim())
  );

  return {
    candidateSkills,
    requiredSkills,
    matchedSkills,
    missingSkills,
  };
};

/**
 * Calculate CV relevance score
 * Based on candidate's experience and education relevance
 * @param {object} profile - Candidate's profile object
 * @param {string[]} _requiredSkills - Required skills from job (not used in calculation)
 * @returns {number} - Score 0-100
 */
export const calculateCVRelevanceScore = (profile, _requiredSkills = []) => {
  let relevanceScore = 0; 

  if (!profile) return relevanceScore;

  // Check if candidate has relevant experience
  if (profile.experience && profile.experience.length > 0) {
    // More experience typically means higher relevance
    const experienceYears = profile.experience.reduce((total, exp) => {
      if (exp.from && exp.to) {
        const years = (new Date(exp.to) - new Date(exp.from)) / (1000 * 60 * 60 * 24 * 365);
        return total + Math.max(0, years);
      }
      return total;
    }, 0);

    // Add points based on experience (max 25 points)
    const experienceBonus = Math.min(25, Math.floor(experienceYears * 3));
    relevanceScore += experienceBonus;
  }

  // Check if candidate has education
  if (profile.education && profile.education.length > 0) {
    // Having relevant education adds points (max 15 points)
    relevanceScore += 15;
  }

  // Check if profile is complete (portfolio, bio, etc.)
  let profileCompletenessScore = 0;
  if (profile.bio) profileCompletenessScore += 5;
  if (profile.resumeUrl) profileCompletenessScore += 10;
  if (profile.avatarUrl) profileCompletenessScore += 5;

  relevanceScore += profileCompletenessScore;

  // Cap at 100
  return Math.min(100, relevanceScore);
};

/**
 * Calculate overall job-fit score
 * Weighted combination of assessment, skill match, and CV relevance
 * @param {number} assessmentScore - Assessment score (0-100)
 * @param {number} skillMatchScore - Skill match score (0-100)
 * @param {number} cvRelevanceScore - CV relevance score (0-100)
 * @param {object} weights - Weight configuration for each component
 * @returns {number} - Overall job-fit score (0-100)
 */
export const calculateJobFitScore = (
  assessmentScore = 0,
  skillMatchScore = 0,
  cvRelevanceScore = 0,
  weights = {}
) => {
  // Default weights (can be customized)
  const defaultWeights = {
    assessment: 0.5, // 50% — most important
    skillMatch: 0.3, // 30%
    cvRelevance: 0.2, // 20%
  };

  const finalWeights = { ...defaultWeights, ...weights };

  const jobFitScore =
    assessmentScore * finalWeights.assessment +
    skillMatchScore * finalWeights.skillMatch +
    cvRelevanceScore * finalWeights.cvRelevance;

  return Math.min(100, Math.round(jobFitScore));
};

/**
 * Normalize scores to ensure consistency
 * @param {number} score - Score to normalize
 * @param {number} min - Minimum value (default: 0)
 * @param {number} max - Maximum value (default: 100)
 * @returns {number} - Normalized score within min-max range
 */
export const normalizeScore = (score, min = 0, max = 100) => {
  return Math.max(min, Math.min(max, Math.round(score)));
};
