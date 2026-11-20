import { requireUser } from "@/lib/session";
import EquipmentDetails from "./EquipmentDetails";

interface EquipmentDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EquipmentDetailsPage({
  params,
}: EquipmentDetailsPageProps) {
  // Server-side guard prevents redirect flash or session loss on page reload
  const session = await requireUser();
  const { id } = await params;
  const userRole = (session.user as { role?: string })?.role || "customer";

  return <EquipmentDetails id={id} userRole={userRole} />;
}
