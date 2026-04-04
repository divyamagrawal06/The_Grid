import express from "express";
import Team from "../models/Team.js";
import User from "../models/User.js";
import Submission from "../models/Submission.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authRequired, async (_req, res) => {
  const [teams, usersPerTeam, scoreAgg] = await Promise.all([
    Team.find({}).sort({ name: 1 }).lean(),
    User.aggregate([
      { $match: { role: "player", team: { $ne: null } } },
      { $group: { _id: "$team", members: { $sum: 1 } } },
    ]),
    Submission.aggregate([
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
          _id: { team: "$team", challenge: "$challenge" },
          score: { $max: "$challengeData.value" },
        },
      },
      { $group: { _id: "$_id.team", totalScore: { $sum: "$score" } } },
    ]),
  ]);

  const membersMap = new Map(
    usersPerTeam.map((x) => [x._id?.toString(), x.members]),
  );
  const scoreMap = new Map(
    scoreAgg.map((x) => [x._id?.toString(), x.totalScore]),
  );

  const profiles = teams.map((team) => ({
    id: team._id,
    name: team.name,
    slug: team.slug,
    bio: team.bio,
    country: team.country,
    avatarUrl: team.avatarUrl,
    members: membersMap.get(team._id.toString()) || 0,
    score: scoreMap.get(team._id.toString()) || 0,
  }));

  res.json({ teams: profiles });
});

router.get("/:slug", authRequired, async (req, res) => {
  const team = await Team.findOne({ slug: req.params.slug }).lean();
  if (!team) {
    return res.status(404).json({ message: "Team not found." });
  }

  const [members, solves] = await Promise.all([
    User.find({ team: team._id, role: "player" })
      .select("username displayName createdAt")
      .lean(),
    Submission.aggregate([
      { $match: { team: team._id, isCorrect: true } },
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
          _id: "$challenge",
          name: { $first: "$challengeData.name" },
          value: { $first: "$challengeData.value" },
          firstSolvedAt: { $min: "$createdAt" },
        },
      },
      { $sort: { firstSolvedAt: -1 } },
      { $limit: 10 },
    ]),
  ]);

  return res.json({
    team: {
      id: team._id,
      name: team.name,
      slug: team.slug,
      bio: team.bio,
      country: team.country,
      avatarUrl: team.avatarUrl,
      members,
      recentSolves: solves,
    },
  });
});

export default router;
