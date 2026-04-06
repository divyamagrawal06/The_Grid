import crypto from "crypto";

export function hashFlag(rawFlag) {
  const secret = process.env.FLAG_SECRET || "dev-flag-secret";
  return crypto
    .createHmac("sha256", secret)
    .update(rawFlag.trim())
    .digest("hex");
}

export function isValidFlagSubmission(inputFlag, expectedHash) {
  return hashFlag(inputFlag) === expectedHash;
}
