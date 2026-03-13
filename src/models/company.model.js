import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            // unique: true, // 1:1 — one company per recruiter
        },
        name: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
        },
        description: {
            type: String,
            maxlength: [2000, "Description cannot exceed 2000 characters"],
        },
        website: {
            type: String,
            trim: true,
        },
        logoUrl: {
            type: String,
        },
        industry: {
            type: String,
            trim: true,
        },
        size: {
            type: String,
            enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
        },
        location: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// ----- Indexes -----
companySchema.index({ userId: 1 }, { unique: true });
companySchema.index({ name: "text" });

const Company = mongoose.model("Company", companySchema);

export default Company;
