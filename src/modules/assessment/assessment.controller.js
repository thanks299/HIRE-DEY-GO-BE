import Assessment from "../../models/assessment.model.js";
import AssessmentResult from "../../models/assessmentResult.model.js";
import Job from "../../models/job.model.js";
 
export const createAssessment = async (req, res, next) => {
  try {
    const { title, description, skills, questions, timeLimit } = req.body;
 
    const assessment = await Assessment.create({
      createdBy: req.user.userId,
      title,
      description,
      skills,
      questions,
      timeLimit
    });
 
    res.status(201).json({
      success: true,
      data: assessment
    });
 
  } catch (error) {
    next(error);
  }
};
 
export const attachAssessmentToJob = async (req, res, next) => {
  try {
    const { jobId, assessmentId } = req.params;
 
    const job = await Job.findById(jobId);
 
    if (!job) {
      const error = new Error("Job posting not found");
      error.statusCode = 404;
      throw error;
    }
 
    job.assessmentId = assessmentId;
    await job.save();
 
    res.json({
      success: true,
      message: "Assessment attached to job",
      job
    });
 
  } catch (error) {
    next(error);
  }
};
 
export const startAssessment = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { jobId } = req.params;
 
    const job = await Job.findById(jobId).populate("assessmentId");
 
    if (!job || !job.assessmentId) {
      const error = new Error("Assessment not available for this job");
      error.statusCode = 404;
      throw error;
    }
 
    const assessment = job.assessmentId;
 
    const existingResult = await AssessmentResult.findOne({
      userId,
      jobId,
      assessmentId: assessment._id
    });
 
    if (existingResult) {
      const error = new Error("You have already taken this assessment");
      error.statusCode = 400;
      throw error;
    }
 
    const result = await AssessmentResult.create({
      assessmentId: assessment._id,
      userId,
      jobId,
      startedAt: new Date(),
      status: "in-progress"
    });
 
    res.status(200).json({
      success: true,
      resultId: result._id,
      startTime: result.startedAt,
      timeLimit: assessment.timeLimit,
      assessmentId: assessment._id,
      title: assessment.title,
      questions: assessment.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        type: q.type,
        options: q.options,
        points: q.points
      }))
    });
 
  } catch (error) {
    next(error);
  }
};
 
export const submitAssessment = async (req, res, next) => {
  try {
    const { assessmentId } = req.params;
    const { jobId, answers } = req.body;
    const userId = req.user.userId;
 
    const assessment = await Assessment.findById(assessmentId);
 
    if (!assessment) {
      const error = new Error("Assessment not found");
      error.statusCode = 404;
      throw error;
    }
 
    const result = await AssessmentResult.findOne({
      userId,
      jobId,
      assessmentId
    });
 
    if (!result) {
      const error = new Error("Assessment not started");
      error.statusCode = 400;
      throw error;
    }
 
    if (result.status === "completed") {
      const error = new Error("Assessment already submitted");
      error.statusCode = 400;
      throw error;
    }
 
    let score = 0;
 
    assessment.questions.forEach((question) => {
      const userAnswer = answers.find(
        answer => answer.questionId.toString() === question._id.toString()
      );
 
      if (!userAnswer) return;
 
      if (
        userAnswer.answer.trim().toLowerCase() ===
        question.correctAnswer.trim().toLowerCase()
      ) {
        score += question.points;
      }
    });
 
    const now = new Date();
    const timeTaken = (now - result.startedAt) / 1000 / 60; // minutes
 
    if (timeTaken >= assessment.timeLimit) {
      score = score - 20;
    }
 
    const percentage = (score / assessment.totalPoints) * 100;
 
    // ── Rich feedback based on score ──────────────────────────
    let feedback;
    let passed;
 
    if (percentage >= 90) {
      passed = true;
      feedback = {
        status: "Excellent",
        message: "Outstanding performance! You've demonstrated exceptional knowledge and skill. You are highly recommended for this role. Expect to hear from the recruiter shortly regarding next steps.",
        score: `${percentage.toFixed(1)}%`,
        recommendation: "Highly Recommended"
      };
    } else if (percentage >= 70) {
      passed = true;
      feedback = {
        status: "Passed",
        message: "Well done! You've passed the assessment and shown a solid understanding of the required skills. The recruiter will review your application and reach out if you are shortlisted for an interview.",
        score: `${percentage.toFixed(1)}%`,
        recommendation: "Recommended"
      };
    } else if (percentage >= 50) {
      passed = false;
      feedback = {
        status: "Below Threshold",
        message: "You showed some understanding but did not meet the minimum score required for this role. We encourage you to strengthen your skills and apply again in the future.",
        score: `${percentage.toFixed(1)}%`,
        recommendation: "Not Recommended"
      };
    } else {
      passed = false;
      feedback = {
        status: "Failed",
        message: "Unfortunately, your score did not meet the requirements for this position. Don't be discouraged — use this as an opportunity to identify areas for growth and try again.",
        score: `${percentage.toFixed(1)}%`,
        recommendation: "Not Recommended"
      };
    }
 
    result.answers = answers;
    result.score = score;
    result.maxScore = assessment.totalPoints;
    result.timeTaken = timeTaken;
    result.percentage = percentage;
    result.status = "completed";
    result.submittedAt = now;
    result.feedback = feedback.message;
 
    await result.save();
 
    res.status(201).json({
      success: true,
      message: "Assessment successfully submitted",
      data: {
        resultId: result._id,
        score: result.score,
        maxScore: result.maxScore,
        percentage: `${percentage.toFixed(1)}%`,
        timeTaken: `${timeTaken.toFixed(1)} minutes`,
        passed,
        feedback,
      }
    });
 
  } catch (error) {
    next(error);
  }
};
 
export const getAssessmentResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
 
    const result = await AssessmentResult.findOne({
      _id: id,
      userId
    });
 
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found"
      });
    }
 
    res.json({
      success: true,
      data: result
    });
 
  } catch (error) {
    next(error);
  }
};
 
export const updateAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
 
    const assessment = await Assessment.findById(id);
 
    if (!assessment) {
      const error = new Error("Assessment not found");
      error.statusCode = 404;
      throw error;
    }
 
    if (assessment.createdBy.toString() !== req.user.userId) {
      const error = new Error("Not authorized to update this assessment");
      error.statusCode = 403;
      throw error;
    }
 
    const updatedAssessment = await Assessment.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
 
    res.json({
      success: true,
      data: updatedAssessment
    });
 
  } catch (error) {
    next(error);
  }
};
 
export const deleteAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
 
    const assessment = await Assessment.findById(id);
 
    if (!assessment) {
      const error = new Error("Assessment not found");
      error.statusCode = 404;
      throw error;
    }
 
    if (assessment.createdBy.toString() !== req.user.userId) {
      const error = new Error("Not authorized to delete this assessment");
      error.statusCode = 403;
      throw error;
    }
 
    await assessment.deleteOne();
 
    res.json({
      success: true,
      message: "Assessment deleted successfully"
    });
 
  } catch (error) {
    next(error);
  }
};
 