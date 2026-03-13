import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      // unique: true, // handled by schema.index below
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      trim: true, // e.g. "Programming", "Design", "Marketing", "Soft Skills"
    },
  },
  {
    timestamps: true,
  }
);

// ----- Indexes -----
skillSchema.index({ name: 1 }, { unique: true });
skillSchema.index({ category: 1 });

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
