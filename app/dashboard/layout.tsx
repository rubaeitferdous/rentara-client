import { requireUser } from "@/lib/session";
import DashboardShell from "@/components/dashboard/DashboardShell";
import type { Role } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();
  const user = session.user as {
    name: string;
    email: string;
    image?: string | null;
    role?: string;
  };

  const role = (user.role || "customer") as Role;

  return (
    <DashboardShell
      role={role}
      user={{
        name: user.name,
        email: user.email,
        image: user.image || "",
      }}
    >
      {children}
    </DashboardShell>
  );
}
