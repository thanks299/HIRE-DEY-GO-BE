import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    requirements: {
      type: String,
      maxlength: [3000, "Requirements cannot exceed 3000 characters"],
    },
    requiredSkills: {
      type: [String], // skills the role demands — tags linked to assessments
      default: [],
    },
    salaryMin: {
      type: Number,
      min: [0, "Salary cannot be negative"],
    },
    salaryMax: {
      type: Number,
      min: [0, "Salary cannot be negative"],
    },
    currency: {
      type: String,
      default: "NGN",
      uppercase: true,
    },
    location: {
      type: String,
      trim: true,
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"],
      required: [true, "Job type is required"],
    },
    category: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      default: null,
    },
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "CLOSED"],
      default: "ACTIVE",
    },
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ----- Indexes for search & filtering -----
jobSchema.index({ status: 1, deadline: 1 });
jobSchema.index({ companyId: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ title: "text", description: "text" }); // full-text search

// ----- Validate salaryMax >= salaryMin -----
jobSchema.pre("validate", function () {
  if (this.salaryMin != null && this.salaryMax != null) {
    if (this.salaryMax < this.salaryMin) {
      this.invalidate(
        "salaryMax",
        "Maximum salary must be greater than or equal to minimum salary"
      );
    }
  }
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
