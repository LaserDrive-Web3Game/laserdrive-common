import { randomBytes } from "crypto";

export const generateNonce = () => {
  return randomBytes(16).toString("hex");
};
