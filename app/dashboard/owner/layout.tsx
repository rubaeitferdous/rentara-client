import { ReactNode } from "react";
import { requireRole } from "@/lib/session";

export default async function OwnerLayout({ children }: { children: ReactNode }) {
  await requireRole(["owner", "admin"]);
  return <>{children}</>;
}
