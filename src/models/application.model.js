import mongoose from "mongoose";

const scoreBreakdownSchema = new mongoose.Schema(
    {
        assessmentScore: {
            type: Number,
            default: 0,
        },
        skillMatchScore: {
            type: Number,
            default: 0,
        },
        cvRelevanceScore: {
            type: Number,
            default: 0,
        },
    },
    { _id: false }
);

const applicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        coverLetter: {
            type: String,
            maxlength: [3000, "Cover letter cannot exceed 3000 characters"],
        },
        resumeUrl: {
            type: String,
        },
        assessmentResultId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AssessmentResult",
            default: null,
        },
        jobFitScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        scoreBreakdown: {
            type: scoreBreakdownSchema,
            default: () => ({}),
        },
        rank: {
            type: Number,
            default: null,
        },
        status: {
            type: String,
            enum: [
                "APPLIED",
                "ASSESSED",
                "SHORTLISTED",
                "INTERVIEW",
                "HIRED",
                "REJECTED",
            ],
            default: "APPLIED",
        },
        interviewDate: {
            type: Date,
            default: null,
        },
        interviewNotes: {
            type: String,
            maxlength: [2000, "Interview notes cannot exceed 2000 characters"],
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });
applicationSchema.index({ jobId: 1, jobFitScore: -1 });
applicationSchema.index({ userId: 1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
