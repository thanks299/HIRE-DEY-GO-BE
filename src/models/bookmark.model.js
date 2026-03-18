import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["JOB", "COMPANY", "CANDIDATE"],
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ----- Prevent duplicate bookmarks -----
bookmarkSchema.index({ userId: 1, type: 1, jobId: 1 }, { unique: true, sparse: true });
bookmarkSchema.index({ userId: 1, type: 1, companyId: 1 }, { unique: true, sparse: true });
bookmarkSchema.index({ userId: 1, type: 1, candidateId: 1 }, { unique: true, sparse: true });
bookmarkSchema.index({ userId: 1 });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
