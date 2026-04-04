import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    value: { type: Number, required: true, min: 1 },
    description: { type: String, default: "" },
    flagHash: { type: String, required: true, select: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

challengeSchema.index({ name: 1, category: 1 }, { unique: true });

export default mongoose.model("Challenge", challengeSchema);
