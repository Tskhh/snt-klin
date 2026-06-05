import { cookies } from "next/headers";
import { verifySessionToken, COOKIE_NAME, type SessionUser } from "@/lib/jwt";

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
