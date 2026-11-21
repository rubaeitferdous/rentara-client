"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import DataTable, { Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Loader from "@/components/Loader";
import type { Equipment } from "@/types";
import {
  Package,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
  Tag,
  MapPin,
  Filter,
} from "lucide-react";

export default function AdminEquipmentPage() {
  const { data: initialData, loading, error } = useApi<Equipment[]>("/equipment/admin/all");
  const [items, setItems] = useState<Equipment[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    if (initialData) {
      setItems(initialData);
    }
  }, [initialData]);

  const handleStatusChange = async (
    equipmentId: string,
    equipmentName: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      await api(`/equipment/${equipmentId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setItems((prev) =>
        prev.map((it) => (it._id === equipmentId ? { ...it, status: newStatus } : it))
      );
      toast.success(
        newStatus === "approved"
          ? `Approved "${equipmentName}" for public discovery`
          : `Rejected "${equipmentName}" listing`
      );
    } catch (err: any) {
      console.error("Status update error:", err);
      toast.error(err.message || "Could not update status");
    }
  };

  const handleDelete = async (equipmentId: string, equipmentName: string) => {
    const result = await Swal.fire({
      title: "Delete Equipment?",
      text: `Permanently delete "${equipmentName}"? All active associations and bookmarks will be removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      background: "var(--card)",
      color: "var(--foreground)",
    });

    if (!result.isConfirmed) return;

    try {
      await api(`/equipment/${equipmentId}`, { method: "DELETE" });
      setItems((prev) => prev.filter((it) => it._id !== equipmentId));
      toast.success("Equipment deleted successfully");
    } catch (err: any) {
      console.error("Delete equipment error:", err);
      toast.error(err.message || "Failed to delete equipment");
    }
  };

  const filteredItems = items.filter((it) => {
    if (filter === "all") return true;
    return it.status === filter;
  });

  const pendingCount = items.filter((i) => i.status === "pending").length;

  const columns: Column<Equipment>[] = [
    {
      header: "Equipment",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
            {item.image ? (
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-bold">
                GEAR
              </div>
            )}
          </div>
          <div>
            <span className="font-bold text-foreground line-clamp-1">{item.name}</span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-600" />
                {item.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {item.location}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Owner",
      render: (item) => (
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-foreground">{item.ownerName || "Owner"}</p>
          <p className="text-xs text-muted-foreground">{item.ownerEmail}</p>
        </div>
      ),
    },
    {
      header: "Rental Rate",
      render: (item) => (
        <div>
          <span className="font-mono font-bold text-sm text-foreground">
            ${Number(item.price).toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground ml-1">/{item.rentalType.toLowerCase()}</span>
        </div>
      ),
    },
    {
      header: "Stock",
      render: (item) => (
        <span className="text-xs font-bold font-mono text-foreground">
          {item.availableQuantity} units
        </span>
      ),
    },
    {
      header: "Review Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Moderation Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          {item.status !== "approved" && (
            <button
              type="button"
              onClick={() => handleStatusChange(item._id, item.name, "approved")}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer"
              title="Approve for public listing"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>
          )}

          {item.status !== "rejected" && (
            <button
              type="button"
              onClick={() => handleStatusChange(item._id, item.name, "rejected")}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-800 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-all cursor-pointer"
              title="Reject equipment listing"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
          )}

          <Link
            href={`/equipment/${item._id}`}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
            title="Inspect Details"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => handleDelete(item._id, item.name)}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
            title="Delete Equipment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="warm-card p-6 rounded-3xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>Listing Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Equipment Catalog Moderation
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Audit newly submitted gear, approve listings for public rental, or moderate existing items.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex rounded-xl p-1 bg-muted border border-border self-start sm:self-auto shrink-0">
          {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                filter === tab
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {tab === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-stone-900 font-extrabold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <Loader message="Loading catalog for administrative review..." />
      ) : error ? (
        <div className="warm-card p-8 text-center rounded-2xl text-rose-600 border border-rose-500/20">
          <p className="font-semibold text-sm">Failed to load equipment: {error}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={filteredItems}
          emptyMessage="No equipment listings match the selected moderation filter."
        />
      )}
    </div>
  );
}
