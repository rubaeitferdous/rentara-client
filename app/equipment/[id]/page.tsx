import { requireUser } from "@/lib/session";
import EquipmentDetails from "./EquipmentDetails";

interface EquipmentDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EquipmentDetailsPage({
  params,
}: EquipmentDetailsPageProps) {
  const { id } = await params;
  // Server-side guard protects private route and preserves callback target
  const session = await requireUser(`/equipment/${id}`);
  const userRole = (session.user as { role?: string })?.role || "customer";

  return <EquipmentDetails id={id} userRole={userRole} />;
}
