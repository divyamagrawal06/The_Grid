import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import Team from "../models/Team.js";
import User from "../models/User.js";
import Challenge from "../models/Challenge.js";
import Submission from "../models/Submission.js";
import { hashFlag } from "../utils/flag.js";

const teams = [
  {
    name: "0xDEADBEEF",
    slug: "0xdeadbeef",
    bio: "Reverse engineering and web exploitation specialists.",
    country: "US",
    avatarUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=0xdeadbeef",
  },
  {
    name: "NullPointers",
    slug: "nullpointers",
    bio: "Full-stack breakers. Loves binary and forensics.",
    country: "CA",
    avatarUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=nullpointers",
  },
  {
    name: "SegFault Squad",
    slug: "segfault-squad",
    bio: "CTF newcomers with elite scripting speed.",
    country: "GB",
    avatarUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=segfaultsquad",
  },
  {
    name: "Shell Shocked",
    slug: "shell-shocked",
    bio: "OSINT + network traffic analysis.",
    country: "DE",
    avatarUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=shellshocked",
  },
];

const users = [
  {
    username: "player1",
    displayName: "Player One",
    role: "player",
    team: "0xdeadbeef",
  },
  {
    username: "player2",
    displayName: "Player Two",
    role: "player",
    team: "nullpointers",
  },
  {
    username: "player3",
    displayName: "Player Three",
    role: "player",
    team: "segfault-squad",
  },
  {
    username: "player4",
    displayName: "Player Four",
    role: "player",
    team: "shell-shocked",
  },
  { username: "gmaster", displayName: "Game Master", role: "gm", team: null },
];

const challenges = [
  {
    name: "Cookie Monster",
    category: "Web",
    value: 100,
    description:
      "Someone left their cookies out. Inspect browser storage and recover the flag.",
    flag: "FLAG{c00k13s_ar3_d3licious}",
  },
  {
    name: "SQL Injection 101",
    category: "Web",
    value: 200,
    description: "Bypass a vulnerable login form using SQL injection.",
    flag: "FLAG{sql_1nj3ct10n_ftw}",
  },
  {
    name: "Caesar's Secret",
    category: "Crypto",
    value: 100,
    description: "Decode a Caesar cipher.",
    flag: "FLAG{caesar_is_easy}",
  },
  {
    name: "PCAP Detective",
    category: "Forensics",
    value: 300,
    description: "Analyze packet captures for plaintext secrets.",
    flag: "FLAG{wireshark_detective}",
  },
];

async function run() {
  await connectDB();

  await Promise.all([
    Submission.deleteMany({}),
    User.deleteMany({}),
    Team.deleteMany({}),
    Challenge.deleteMany({}),
  ]);

  const insertedTeams = await Team.insertMany(teams);
  const teamMap = new Map(insertedTeams.map((team) => [team.slug, team]));

  const playerPassword = process.env.SEED_PLAYER_PASSWORD || "pass123";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin123";

  const seededUsers = await Promise.all(
    users.map(async (u) => {
      const passwordHash = await bcrypt.hash(
        u.role === "gm" ? adminPassword : playerPassword,
        10,
      );
      return {
        username: u.username,
        displayName: u.displayName,
        role: u.role,
        team: u.team ? teamMap.get(u.team)?._id : null,
        passwordHash,
      };
    }),
  );

  await User.insertMany(seededUsers);

  await Challenge.insertMany(
    challenges.map((challenge) => ({
      name: challenge.name,
      category: challenge.category,
      value: challenge.value,
      description: challenge.description,
      flagHash: hashFlag(challenge.flag),
      isActive: true,
    })),
  );

  console.log("Seed completed successfully.");
  process.exit(0);
}

run().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
