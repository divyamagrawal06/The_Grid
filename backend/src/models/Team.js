import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    bio: { type: String, default: "" },
    country: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

teamSchema.index({ slug: 1 });

export default mongoose.model("Team", teamSchema);
