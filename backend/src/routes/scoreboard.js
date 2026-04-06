import express from "express";
import Submission from "../models/Submission.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authRequired, async (_req, res) => {
  const standings = await Submission.aggregate([
    { $match: { isCorrect: true } },
    {
      $lookup: {
        from: "challenges",
        localField: "challenge",
        foreignField: "_id",
        as: "challengeData",
      },
    },
    { $unwind: "$challengeData" },
    {
      $group: {
        _id: { challenge: "$challenge", team: "$team" },
        firstValue: { $first: "$challengeData.value" },
        firstSolveAt: { $min: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$_id.team",
        score: { $sum: "$firstValue" },
        solvedCount: { $sum: 1 },
        lastSolveAt: { $max: "$firstSolveAt" },
      },
    },
    {
      $lookup: {
        from: "teams",
        localField: "_id",
        foreignField: "_id",
        as: "teamData",
      },
    },
    { $unwind: "$teamData" },
    {
      $project: {
        _id: 0,
        id: "$teamData._id",
        name: "$teamData.name",
        slug: "$teamData.slug",
        score: 1,
        solvedCount: 1,
        lastSolveAt: 1,
      },
    },
    { $sort: { score: -1, solvedCount: -1, lastSolveAt: 1 } },
  ]);

  res.json({ standings });
});

export default router;
