import crypto from "crypto";
import { randomBytes } from "crypto";

// export function generateTempAuthToken() {
//   return randomBytes(32).toString("hex"); // Generates a 64-character hex string
// }
function generateVerificationCode() {
  return crypto.randomBytes(20).toString("hex"); // Generates a 40-character hexadecimal string
}

export default generateVerificationCode;
