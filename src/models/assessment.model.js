import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        questionText: {
            type: String,
            required: [true, "Question text is required"],
        },
        type: {
            type: String,
            enum: ["MCQ", "SHORT_ANSWER", "SITUATIONAL"],
            required: [true, "Question type is required"],
        },
        options: {
            type: [String],
            default: [],
            validate: {
                validator: function (v) {
                    if (this.type === "MCQ") return v.length >= 2;
                    return true;
                },
                message: "MCQ questions must have at least 2 options",
            },
        },
        correctAnswer: {
            type: String,
            required: [true, "Correct answer is required"],
        },
        points: {
            type: Number,
            required: [true, "Points value is required"],
            min: [1, "Points must be at least 1"],
        },
    },
    { _id: true }
);

const assessmentSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Assessment title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        description: {
            type: String,
            maxlength: [1000, "Description cannot exceed 1000 characters"],
        },
        skills: {
            type: [String],
            default: [],
        },
        questions: {
            type: [questionSchema],
            validate: {
                validator: function (v) {
                    return v.length >= 1;
                },
                message: "Assessment must have at least 1 question",
            },
        },
        timeLimit: {
            type: Number,
            required: [true, "Time limit is required"],
            min: [1, "Time limit must be at least 1 minute"],
        },
        totalPoints: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

assessmentSchema.index({ createdBy: 1 });
assessmentSchema.index({ skills: 1 });

assessmentSchema.pre("save", function (next) {
    if (this.questions && this.questions.length > 0) {
        this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
    }
    next();
});

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;
