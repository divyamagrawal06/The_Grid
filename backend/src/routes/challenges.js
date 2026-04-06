import express from "express";
import Challenge from "../models/Challenge.js";
import Submission from "../models/Submission.js";
import { authRequired } from "../middleware/auth.js";
import { isValidFlagSubmission } from "../utils/flag.js";

const router = express.Router();

router.get("/", authRequired, async (req, res) => {
  const [challenges, solved] = await Promise.all([
    Challenge.find({ isActive: true })
      .sort({ category: 1, value: 1, name: 1 })
      .lean(),
    Submission.find({ user: req.user._id, isCorrect: true })
      .select("challenge")
      .lean(),
  ]);

  const solvedSet = new Set(solved.map((x) => x.challenge.toString()));

  const safeChallenges = challenges.map((challenge) => ({
    id: challenge._id,
    name: challenge.name,
    category: challenge.category,
    value: challenge.value,
    description: challenge.description,
    solvedByMe: solvedSet.has(challenge._id.toString()),
  }));

  res.json({ challenges: safeChallenges });
});

router.post("/:id/submit", authRequired, async (req, res) => {
  const { flag } = req.body;
  const challengeId = req.params.id;

  if (!flag?.trim()) {
    return res.status(400).json({ message: "Flag is required." });
  }

  if (!req.user.team) {
    return res.status(400).json({ message: "User is not assigned to a team." });
  }

  const challenge = await Challenge.findById(challengeId).select("+flagHash");
  if (!challenge || !challenge.isActive) {
    return res.status(404).json({ message: "Challenge not found." });
  }

  const alreadySolved = await Submission.findOne({
    challenge: challenge._id,
    user: req.user._id,
    isCorrect: true,
  }).lean();

  if (alreadySolved) {
    return res.json({ correct: true, alreadySolved: true, pointsAwarded: 0 });
  }

  const correct = isValidFlagSubmission(flag, challenge.flagHash);

  await Submission.create({
    challenge: challenge._id,
    user: req.user._id,
    team: req.user.team._id,
    isCorrect: correct,
  });

  return res.json({
    correct,
    alreadySolved: false,
    pointsAwarded: correct ? challenge.value : 0,
  });
});

export default router;
