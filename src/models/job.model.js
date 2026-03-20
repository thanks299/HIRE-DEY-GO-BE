import mongoose from "mongoose";
 
const jobSchema = new mongoose.Schema(
  {
    // ── Core References ────────────────────────────────────────
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Posted by is required"],
    },
 
    // ── Basic Info ─────────────────────────────────────────────
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    jobRole: {
      type: String,
      trim: true,
      maxlength: [100, "Job role cannot exceed 100 characters"],
    },
    companyName: {
      type: String,
      trim: true,
      maxlength: [200, "Company name cannot exceed 200 characters"],
    },
    category: {
      type: String,
      trim: true,
      maxlength: [100, "Category cannot exceed 100 characters"],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags) => tags.length <= 10,
        message: "Cannot specify more than 10 tags",
      },
    },
 
    // ── Salary ─────────────────────────────────────────────────
    salaryMin: {
      type: Number,
      min: [0, "Salary cannot be negative"],
    },
    salaryMax: {
      type: Number,
      min: [0, "Salary cannot be negative"],
    },
    salaryType: {
      type: String,
      enum: {
        values: ["HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
        message: "{VALUE} is not a valid salary type",
      },
      default: "MONTHLY",
    },
    currency: {
      type: String,
      default: "NGN",
      uppercase: true,
      trim: true,
      maxlength: [3, "Currency code cannot exceed 3 characters"],
    },
    isSalaryNegotiable: {
      type: Boolean,
      default: false,
    },
 
    // ── Vacancies ──────────────────────────────────────────────
    vacancies: {
      type: Number,
      min: [1, "At least 1 vacancy is required"],
      default: 1,
    },
 
    // ── Advanced Information ───────────────────────────────────
    educationLevel: {
      type: String,
      enum: {
        values: [
          "ANY",
          "HIGH_SCHOOL",
          "OND",
          "HND",
          "BSC",
          "PGD",
          "MSC",
          "PHD",
        ],
        message: "{VALUE} is not a valid education level",
      },
      default: "ANY",
    },
    experienceLevel: {
      type: String,
      enum: {
        values: ["ENTRY", "MID", "SENIOR", "LEAD", "EXECUTIVE"],
        message: "{VALUE} is not a valid experience level",
      },
    },
    experienceYears: {
      type: String,
      enum: {
        values: ["0", "1-2", "3-5", "6-10", "10+"],
        message: "{VALUE} is not a valid experience range",
      },
    },
    type: {
      type: String,
      enum: {
        values: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "VOLUNTEER", "REMOTE"],
        message: "{VALUE} is not a valid job type",
      },
      required: [true, "Job type is required"],
    },
    jobLevel: {
      type: String,
      enum: {
        values: ["JUNIOR", "MID_LEVEL", "SENIOR", "MANAGER", "DIRECTOR", "EXECUTIVE"],
        message: "{VALUE} is not a valid job level",
      },
    },
    deadline: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return value > new Date();
        },
        message: "Expiration date must be a future date",
      },
    },
 
    // ── Location ───────────────────────────────────────────────
    country: {
      type: String,
      trim: true,
      maxlength: [100, "Country cannot exceed 100 characters"],
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, "City cannot exceed 100 characters"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
 
    // ── Job Content ────────────────────────────────────────────
    description: {
      type: String,
      required: [true, "Job description is required"],
      minlength: [50, "Description must be at least 50 characters"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    requirements: {
      type: String,
      maxlength: [3000, "Requirements cannot exceed 3000 characters"],
    },
    responsibilities: {
      type: String,
      maxlength: [3000, "Responsibilities cannot exceed 3000 characters"],
    },
    benefits: {
      type: String,
      maxlength: [2000, "Benefits cannot exceed 2000 characters"],
    },
    requiredSkills: {
      type: [String],
      default: [],
      validate: {
        validator: (skills) => skills.length <= 20,
        message: "Cannot specify more than 20 required skills",
      },
    },
 
    // ── Assessment & Status ────────────────────────────────────
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ["DRAFT", "ACTIVE", "CLOSED"],
        message: "{VALUE} is not a valid status",
      },
      default: "ACTIVE",
    },
    closedAt: {
      type: Date,
      default: null,
    },
 
    // ── Counters ───────────────────────────────────────────────
    applicationCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
 
// ── Indexes ────────────────────────────────────────────────────
jobSchema.index({ status: 1, deadline: 1 });
jobSchema.index({ companyId: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ country: 1 });
jobSchema.index({ city: 1 });
jobSchema.index({ experienceLevel: 1 });
jobSchema.index({ jobLevel: 1 });
jobSchema.index({ educationLevel: 1 });
jobSchema.index({ isRemote: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ title: "text", description: "text", requirements: "text" });
 
// ── Virtuals ───────────────────────────────────────────────────
jobSchema.virtual("isExpired").get(function () {
  if (!this.deadline) return false;
  return new Date() > this.deadline;
});
 
jobSchema.virtual("isAcceptingApplications").get(function () {
  return this.status === "ACTIVE" && !this.isExpired;
});
 
jobSchema.virtual("salaryRange").get(function () {
  if (!this.salaryMin && !this.salaryMax) return null;
  const fmt = (n) => n.toLocaleString();
  const period = this.salaryType ? `/${this.salaryType.toLowerCase()}` : "";
  if (this.salaryMin && this.salaryMax) {
    return `${fmt(this.salaryMin)} - ${fmt(this.salaryMax)} ${this.currency}${period}`;
  }
  if (this.salaryMin) return `From ${fmt(this.salaryMin)} ${this.currency}${period}`;
  return `Up to ${fmt(this.salaryMax)} ${this.currency}${period}`;
});
 
// ── Pre-validate hooks ─────────────────────────────────────────
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
 
// ── Pre-save hooks ─────────────────────────────────────────────
jobSchema.pre("save", function () {
  if (this.isModified("tags")) {
    this.tags = [...new Set(this.tags.map((t) => t.trim().toLowerCase()))];
  }
  if (this.isModified("requiredSkills")) {
    this.requiredSkills = [...new Set(this.requiredSkills.map((s) => s.trim()))];
  }
});
 
jobSchema.pre("save", function () {
  if (this.isModified("status") && this.status === "CLOSED" && !this.closedAt) {
    this.closedAt = new Date();
  }
});
 
// ── Static methods ─────────────────────────────────────────────
jobSchema.statics.findActive = function (filter = {}) {
  return this.find({
    ...filter,
    status: "ACTIVE",
    $or: [{ deadline: null }, { deadline: { $gt: new Date() } }],
  });
};
 
jobSchema.statics.incrementViews = function (jobId) {
  return this.findByIdAndUpdate(jobId, { $inc: { viewCount: 1 } });
};
 
jobSchema.statics.incrementApplications = function (jobId) {
  return this.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });
};
 
const Job = mongoose.model("Job", jobSchema);
 
export default Job;
 