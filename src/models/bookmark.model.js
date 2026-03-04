import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
    {
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
    },
    {
        timestamps: true, // createdAt serves as "bookmarked at"
    }
);

// ----- Prevent duplicate bookmarks: one bookmark per user per job -----
bookmarkSchema.index({ userId: 1, jobId: 1 }, { unique: true });
bookmarkSchema.index({ userId: 1 });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
