import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const user = await User.findOne({
    username: username.toLowerCase(),
  }).populate("team", "name slug");

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "12h",
    },
  );

  return res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      team: user.team,
    },
  });
});

router.get("/me", authRequired, async (req, res) => {
  const user = req.user;
  return res.json({
    user: {
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      team: user.team,
    },
  });
});

export default router;
