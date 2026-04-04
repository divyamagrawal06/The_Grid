import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      index: true,
    },
    isCorrect: { type: Boolean, required: true, default: false, index: true },
  },
  { timestamps: true },
);

submissionSchema.index({ challenge: 1, user: 1, isCorrect: 1 });
submissionSchema.index({ challenge: 1, team: 1, isCorrect: 1 });
submissionSchema.index({ team: 1, createdAt: -1 });

export default mongoose.model("Submission", submissionSchema);
