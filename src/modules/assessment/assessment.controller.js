import Assessment from "../../models/assessment.model.js";
import AssessmentResult from "../../models/assessmentResult.model.js";
import Job from "../../models/job.model.js";
//import User from "../../models/user.model.js";

export const createAssessment = async (req, res, next) => {
  try {
    const { title, description, skills, questions, timeLimit } = req.body;

    const assessment = await Assessment.create({
      createdBy: req.user.id,
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
    next(error)
  }
};

export const attachAssessmentToJob = async (req, res, next) => {
  try {
    const { jobId, assessmentId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
        const error = new Error('Job posting not found');
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
    next(error)
  }
};

export const startAssessment = async (req, res, next) => {
  try {

    const userId = req.user.id;
    const { jobId } = req.params;

    const job = await Job.findById(jobId).populate("assessmentId");

    if (!job || !job.assessmentId) {
      const error = new Error("Assessment not available for this job");
      error.statusCode = 404;
      throw error;
    }

    const assessment = job.assessmentId;

    // Check if candidate already took the test
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

    // Create result immediately to store start time
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

    const userId = req.userId;

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

    // calculate time spent
    const now = new Date();
    const timeTaken = (now - result.startedAt) / 1000 / 60; // minutes

    if (timeTaken >= assessment.timeLimit) {
      console.log("Auto submitting due to timeout");
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

    const percentage = (score / assessment.totalPoints) * 100;

    result.answers = answers;
    result.score = score;
    result.maxScore = assessment.totalPoints;
    result.timeTaken = timeTaken;
    result.percentage = percentage;
    result.status = "completed";
    result.submittedAt = now;

    result.feedback =
      percentage >= 70
        ? "Passed, prepare for an interview"
        : "Failed, you are not a fit for this role";

    await result.save();

    res.status(201).json({
      success: true,
      message: "Assessment successfully submitted",
      data: result
    });

  } catch (error) {
    next(error);
  }
};

export const getAssessmentResult = async (req, res, next) => {
  try {

    const { id } = req.params;
    const userId = req.userId;

    const result = await AssessmentResult.findOne({
      _id: id,
      userId
    });

    if (!result) {
      return res.status(404).json({
        message: "Result not found"
      });
    }

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error)
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

    if (assessment.createdBy.toString() !== req.userId) {
      const error = new Error("Not authorized to update this assessment");
      error.statusCode = 403;
      throw error;
    }

    const updatedAssessment = await Assessment.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: updatedAssessment
    });

  } catch (error) {
    next(error)
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

    if (assessment.createdBy.toString() !== req.userId) {
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
    next(error)
  }
};