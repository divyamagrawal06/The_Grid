import express from "express";
import Challenge from "../models/Challenge.js";
import Team from "../models/Team.js";
import User from "../models/User.js";
import Submission from "../models/Submission.js";
import { authRequired, requireRole } from "../middleware/auth.js";
import { hashFlag } from "../utils/flag.js";

const router = express.Router();

router.use(authRequired, requireRole("gm"));

router.get("/stats", async (_req, res) => {
  const [teamCount, userCount, challengeCount, submissionCount] =
    await Promise.all([
      Team.countDocuments(),
      User.countDocuments({ role: "player" }),
      Challenge.countDocuments({ isActive: true }),
      Submission.countDocuments(),
    ]);

  res.json({
    stats: { teamCount, userCount, challengeCount, submissionCount },
  });
});

router.get("/challenges", async (_req, res) => {
  const list = await Challenge.find({}).sort({ createdAt: -1 }).lean();
  res.json({
    challenges: list.map((item) => ({
      id: item._id,
      name: item.name,
      category: item.category,
      value: item.value,
      description: item.description,
      isActive: item.isActive,
    })),
  });
});

router.post("/challenges", async (req, res) => {
  const { name, category, value, description, flag } = req.body;
  if (!name || !category || !value || !flag) {
    return res
      .status(400)
      .json({ message: "name, category, value, and flag are required." });
  }

  const challenge = await Challenge.create({
    name,
    category,
    value: Number(value),
    description: description || "",
    flagHash: hashFlag(flag),
    isActive: true,
  });

  res.status(201).json({
    challenge: {
      id: challenge._id,
      name: challenge.name,
      category: challenge.category,
      value: challenge.value,
      description: challenge.description,
      isActive: challenge.isActive,
    },
  });
});

router.put("/challenges/:id", async (req, res) => {
  const { name, category, value, description, flag, isActive } = req.body;
  const update = {
    ...(name !== undefined ? { name } : {}),
    ...(category !== undefined ? { category } : {}),
    ...(value !== undefined ? { value: Number(value) } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
  };

  if (flag) {
    update.flagHash = hashFlag(flag);
  }

  const challenge = await Challenge.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  }).lean();

  if (!challenge) {
    return res.status(404).json({ message: "Challenge not found." });
  }

  res.json({
    challenge: {
      id: challenge._id,
      name: challenge.name,
      category: challenge.category,
      value: challenge.value,
      description: challenge.description,
      isActive: challenge.isActive,
    },
  });
});

router.delete("/challenges/:id", async (req, res) => {
  const deleted = await Challenge.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Challenge not found." });
  }

  await Submission.deleteMany({ challenge: deleted._id });

  res.json({ message: "Challenge deleted." });
});

export default router;
