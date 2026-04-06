import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: missing token." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).populate("team", "name slug");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: user not found." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized: invalid token." });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions." });
    }
    next();
  };
}
