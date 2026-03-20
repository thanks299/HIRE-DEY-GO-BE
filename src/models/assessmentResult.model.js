import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
    {
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const assessmentResultSchema = new mongoose.Schema(
    {
        assessmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assessment",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        answers: {
            type: [answerSchema],
            default: [],
        },
        score: {
            type: Number,
            required: true,
            default: 0,
        },
        maxScore: {
            type: Number,
            required: true,
        },
        percentage: {
            type: Number,
            default: 0,
        },
        feedback: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["in-progress", "completed"],
            default: "in-progress",
        },

        startedAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: {
            type: Date,
            default: Date.now,
        },
        timeTaken: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

assessmentResultSchema.index({ userId: 1 });
assessmentResultSchema.index({ jobId: 1 });

assessmentResultSchema.pre("save", function () {
    if (this.maxScore > 0) {
        this.percentage = Math.round((this.score / this.maxScore) * 100);
        this.feedback = this.percentage >= 70 ? "You passed! Your score has been recorded for ranking." : "You did not meet the required score. Your result has been recorded.";
    }
});

const AssessmentResult = mongoose.model("AssessmentResult", assessmentResultSchema);

export default AssessmentResult;
