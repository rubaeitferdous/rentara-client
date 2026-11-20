"use client";

import { use } from "react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import EquipmentForm from "@/components/EquipmentForm";
import Loader from "@/components/Loader";
import type { Equipment } from "@/types";
import { ArrowLeft } from "lucide-react";

interface EditEquipmentPageProps {
  params: Promise<{ id: string }>;
}

export default function EditEquipmentPage({ params }: EditEquipmentPageProps) {
  const { id } = use(params);
  const { data: item, loading, error } = useApi<Equipment>(`/equipment/${id}`);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/dashboard/owner/my-equipment"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fleet Catalog</span>
        </Link>
      </div>

      {loading ? (
        <Loader message="Loading equipment details..." />
      ) : error || !item ? (
        <div className="warm-card p-8 text-center rounded-2xl text-rose-600 border border-rose-500/20">
          <p className="font-semibold text-sm">Failed to load equipment: {error || "Item not found"}</p>
        </div>
      ) : (
        <EquipmentForm initial={item} redirectTo="/dashboard/owner/my-equipment" />
      )}
    </div>
  );
}
