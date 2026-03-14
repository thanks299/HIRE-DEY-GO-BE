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

    const userId = req.userId;
    console.log(userId)
    const { jobId } = req.params;

    const job = await Job.findById(jobId).populate("assessmentId");

    if (!job || !job.assessmentId) {
        const error = new Error('Assessment not available for this job');
        error.statusCode = 404;
        throw error;
    }

    const assessment = job.assessmentId;

    // CHECK IF USER ALREADY TOOK TEST
    const existingResult = await AssessmentResult.findOne({
      userId,
      jobId,
      assessmentId: assessment._id
    });

    if (existingResult) {
        const error = new Error('You have already taken this assessment');
        error.statusCode = 400;
        throw error;
    }

    // // CHECK SKILL SCORE
    // const user = await User.findById(userId);

    // if (user.skillScore < job.minimumSkillScore) {
    //   return res.status(403).json({
    //     message: "Your skill score does not meet job requirement"
    //   });
    // }

    res.json({
      success: true,
      assessmentId: assessment._id,
      title: assessment.title,
      timeLimit: assessment.timeLimit,
      questions: assessment.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        type: q.type,
        options: q.options,
        points: q.points
      }))
    });

  } catch (error) {
    next(error)
  }
};

export const submitAssessment = async (req, res, next) => {
  try {

    const { assessmentId } = req.params;
    const { jobId, timeTaken, answers } = req.body;

    const userId = req.user.id;

    const assessment = await Assessment.findById(assessmentId);
    

    if (!assessment) {
      const error = new Error('Assessment not found');
      error.statusCode = 400;
      throw error;
    }

    // Prevent multiple submissions
    const existingResult = await AssessmentResult.findOne({
      userId,
      jobId,
      assessmentId: assessmentId
    });

    if (existingResult) {
      const error = new Error('Assessment already submitted');
      error.statusCode = 400;
      throw error;
    }

    let score = 0;

    assessment.questions.forEach((question) => {

      const userAnswer = answers.find(answer => answer.questionId.toString() === question._id.toString());

      console.log(userAnswer)

      if (!userAnswer) return;

      if (
        userAnswer.answer.trim().toLowerCase() ===
        question.correctAnswer.trim().toLowerCase()
      ) {
        score += question.points;
      }

      console.log(score)

    });

    console.log({
      assessmentId: assessmentId,
      userId,
      jobId,
      answers,
      score,
      maxScore: 80,
      timeTaken
    })
    console.log(req.originalUrl);

    const maxScore = 80

    const percentage = (score / assessment.totalPoints) * 100;

    console.log({
      assessmentId: assessmentId,
      userId,
      jobId,
      answers,
      score,
      maxScore: maxScore,
      timeTaken,
      percentage: percentage,
      feedback: (score >= maxScore) ? "passed, prepare for an interview" : "failed, You are not a fit for this role"
    })

    const result = await AssessmentResult.create({
      assessmentId: assessmentId,
      userId,
      jobId,
      answers,
      score,
      maxScore: maxScore,
      timeTaken,
      percentage: percentage,
      feedback: (score >= maxScore) ? "passed, prepare for an interview" : "failed, You are not a fit for this role"
    });

    

    res.status(201).json({
      success: true,
      message: "Assessment successfully submitted",
      data: result
    });

  } catch (error) {
    next(error)
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



/**const startTime = req.body.startTime

const now = Date.now()

const timeSpent = (now - startTime) / 1000 / 60

if (timeSpent > assessment.timeLimit) {
   console.log("Auto submitted due to timeout")
}
 */