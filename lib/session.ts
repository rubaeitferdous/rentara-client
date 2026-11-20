import "server-only";
import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@/types";

/**
 * Retrieves the current verified BetterAuth session from incoming request headers.
 */
export async function getSession() {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch (err) {
    console.error("Session retrieval error:", err);
    return null;
  }
}

/**
 * Server Component Guard:
 * Redirects to /login if there is no active authenticated session.
 * Prevents client-side hydration flickers or logout flash on page reload.
 */
export async function requireUser() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

/**
 * Server Component Role Guard:
 * Enforces role permissions (customer, owner, admin).
 */
export async function requireRole(allowedRole: Role | Role[]) {
  const session = await requireUser();
  const userRole = (session.user as { role?: string }).role || "customer";

  const isAllowed = Array.isArray(allowedRole)
    ? allowedRole.includes(userRole as Role)
    : userRole === allowedRole;

  if (!isAllowed) {
    redirect("/dashboard");
  }

  return session;
}
