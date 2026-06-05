import { SignJWT, jwtVerify } from "jose";
import type { UserRole, UserStatus } from "@/generated/prisma/client";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "snt-klin-dev-secret-change-in-production"
);

export const COOKIE_NAME = "snt_session";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
};

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    status: user.status,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifySessionToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      fullName: payload.fullName as string,
      role: payload.role as UserRole,
      status: payload.status as UserStatus,
    };
  } catch {
    return null;
  }
}

export function isAdmin(role: UserRole) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}
