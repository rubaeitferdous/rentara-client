"use client";

import Link from "next/link";
import EquipmentForm from "@/components/EquipmentForm";
import { ArrowLeft, PlusCircle } from "lucide-react";

export default function AddEquipmentPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back link */}
      <div>
        <Link
          href="/dashboard/owner/my-equipment"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fleet Catalog</span>
        </Link>
      </div>

      {/* Equipment Form */}
      <EquipmentForm redirectTo="/dashboard/owner/my-equipment" />
    </div>
  );
}
