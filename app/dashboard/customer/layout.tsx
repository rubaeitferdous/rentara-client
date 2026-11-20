import { ReactNode } from "react";
import { requireRole } from "@/lib/session";

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  await requireRole(["customer", "owner", "admin"]);
  return <>{children}</>;
}
