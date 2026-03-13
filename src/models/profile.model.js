import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    from: { type: Date, required: true },
    to: { type: Date }, // null = current role
    current: { type: Boolean, default: false },
    description: { type: String },
  },
  { _id: true }
);

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String },
    from: { type: Date, required: true },
    to: { type: Date },
    current: { type: Boolean, default: false },
    description: { type: String },
  },
  { _id: true }
);

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // unique: true, // 1:1 relationship — one profile per user
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    skills: {
      type: [String], // extracted from CV or manually entered
      default: [],
    },
    experience: {
      type: [experienceSchema],
      default: [],
    },
    education: {
      type: [educationSchema],
      default: [],
    },
    resumeUrl: {
      type: String, // Cloudinary / S3 URL to uploaded PDF
    },
    parsedResume: {
      type: mongoose.Schema.Types.Mixed, // auto-extracted data from CV parsing
      default: null,
    },
    avatarUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// ----- Indexes -----
//profileSchema.index({ userId: 1 }); <- causing schema index issue has you have already set userId unique to true
profileSchema.index({ skills: 1 });

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
