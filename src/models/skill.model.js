import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      unique: true,
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
skillSchema.index({ name: 1 });
skillSchema.index({ category: 1 });

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
