import mongoose from "mongoose";
 
const socialLinksSchema = new mongoose.Schema(
  {
    linkedin: { type: String, trim: true, default: null },
    twitter: { type: String, trim: true, default: null },
    facebook: { type: String, trim: true, default: null },
    instagram: { type: String, trim: true, default: null },
    youtube: { type: String, trim: true, default: null },
  },
  { _id: false }
);
 
const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: [2, "Company name must be at least 2 characters"],
      maxlength: [200, "Company name cannot exceed 200 characters"],
    },
    about: {
      type: String,
      maxlength: [3000, "About cannot exceed 3000 characters"],
    },
    description: {
      type: String,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [300, "Address cannot exceed 300 characters"],
    },
    website: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
        "Please provide a valid website URL",
      ],
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^\+?[\d\s\-().]{7,20}$/,
        "Please provide a valid phone number",
      ],
      default: null,
    },
    workEmail: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid work email address"],
      default: null,
    },
    logoUrl: {
      type: String,
      default: null,
    },
    industry: {
      type: String,
      trim: true,
      maxlength: [100, "Industry cannot exceed 100 characters"],
    },
    organizationType: {
      type: String,
      enum: {
        values: [
          "PRIVATE",
          "PUBLIC",
          "NON_PROFIT",
          "GOVERNMENT",
          "STARTUP",
          "FREELANCE",
          "OTHER",
        ],
        message: "{VALUE} is not a valid organization type",
      },
    },
    teamSize: {
      type: String,
      enum: {
        values: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
        message: "{VALUE} is not a valid team size",
      },
    },
    yearEstablished: {
      type: Number,
      min: [1800, "Year established cannot be before 1800"],
      max: [new Date().getFullYear(), `Year cannot be in the future`],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
 
// ── Indexes ────────────────────────────────────────────────────
companySchema.index({ userId: 1 }, { unique: true });
companySchema.index({ name: "text", about: "text", description: "text" });
companySchema.index({ industry: 1 });
companySchema.index({ organizationType: 1 });
companySchema.index({ teamSize: 1 });
companySchema.index({ isVerified: 1 });
companySchema.index({ location: 1 });
 
const Company = mongoose.model("Company", companySchema);
 
export default Company;