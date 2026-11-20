import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";

export default async function DashboardIndex() {
  const session = await requireUser();
  const role = (session.user as { role?: string })?.role;

  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "owner") {
    redirect("/dashboard/owner");
  } else {
    redirect("/dashboard/customer/my-rentals");
  }
}
