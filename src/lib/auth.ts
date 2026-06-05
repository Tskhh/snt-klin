import bcrypt from "bcryptjs";
export {
  COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
  isAdmin,
  type SessionUser,
} from "@/lib/jwt";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
