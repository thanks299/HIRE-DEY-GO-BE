import Assessment from "../../models/assessment.model.js";
import AssessmentResult from "../../models/assessmentResult.model.js";
import Job from "../../models/job.model.js";
import Application from "../../models/application.model.js";
 
export const createAssessment = async (req, res, next) => {
  try {
    const { title, description, skills, questions, timeLimit } = req.body;
    const  { userId } = req.user;

    const assessment = await Assessment.create({
      createdBy: userId,
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

    const  { userId } = req.user;
    const { jobId } = req.params;

    console.log("REQ USER:", req.user);
console.log("REQ USER ID:", req.userId);

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

    const totalPoints = assessment.questions.reduce(
      (sum, q) => sum + (q.points || 0),
      0
    );

    const result = await AssessmentResult.create({
      assessmentId: assessment._id,
      userId,
      jobId,
      maxScore: totalPoints,
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

    const  { userId } = req.user;

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
      score = Math.max(0, score - 20);
    }

    result.userId = userId;
    result.answers = answers;
    result.score = score;
    result.timeTaken = Number.parseInt(timeTaken);
    result.status = "completed";
    result.completedAt = now;

    await result.save();

    await Application.findOneAndUpdate(
      { userId, jobId },
      { assessmentResultId: result._id }
    );
 
    res.status(201).json({
      success: true,
      message: "Assessment successfully submitted",
      data: {
        resultId: result._id,
        userId: result.userId,
        score: result.score,
        maxScore: result.maxScore,
        startedAt: result.startedAt,
        completedAt: now,
        timeTaken: `${timeTaken.toFixed(1)} minutes`,
        status: "completed",
        feedback: result.feedback,
      }
    });
 
  } catch (error) {
    next(error);
  }
};
 
export const getAssessmentResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const  { userId } = req.user;

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
    const  { userId } = req.user;

    const assessment = await Assessment.findById(id);
 
    if (!assessment) {
      const error = new Error("Assessment not found");
      error.statusCode = 404;
      throw error;
    }

    if (assessment.createdBy.toString() !== userId) {
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
    const  { userId } = req.user;

    const assessment = await Assessment.findById(id);
 
    if (!assessment) {
      const error = new Error("Assessment not found");
      error.statusCode = 404;
      throw error;
    }

    if (assessment.createdBy.toString() !== userId) {
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
 