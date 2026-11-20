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
  PlusCircle,
  Pencil,
  Trash2,
  ExternalLink,
  MapPin,
  Tag,
  AlertCircle,
} from "lucide-react";

export default function MyEquipmentPage() {
  const { data: initialData, loading, error } = useApi<Equipment[]>("/equipment/mine");
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);

  useEffect(() => {
    if (initialData) {
      setEquipmentList(initialData);
    }
  }, [initialData]);

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Delete Equipment?",
      text: `Are you sure you want to permanently delete "${name}"? This cannot be undone.`,
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
      await api(`/equipment/${id}`, { method: "DELETE" });
      setEquipmentList((prev) => prev.filter((item) => item._id !== id));
      toast.success("Equipment deleted successfully");
    } catch (err: any) {
      console.error("Delete equipment error:", err);
      toast.error(err.message || "Failed to delete equipment");
    }
  };

  const columns: Column<Equipment>[] = [
    {
      header: "Equipment",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="48px"
              />
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
              {item.brand && (
                <>
                  <span>•</span>
                  <span>{item.brand} {item.model}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Location",
      render: (item) => (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {item.location}
        </span>
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
      header: "Status",
      render: (item) => (
        <div className="space-y-1">
          <StatusBadge status={item.status} />
          {item.status === "pending" && (
            <p className="text-[10px] text-amber-600 flex items-center gap-0.5">
              <AlertCircle className="w-2.5 h-2.5" />
              Under review
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          {item.status === "approved" && (
            <Link
              href={`/equipment/${item._id}`}
              className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
              title="View Public Details"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
          <Link
            href={`/dashboard/owner/equipment/${item._id}/edit`}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-amber-600 transition-colors cursor-pointer"
            title="Edit Equipment"
          >
            <Pencil className="w-4 h-4" />
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
            <span>Fleet Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            My Equipment Catalog
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your listed equipment, track review statuses, and edit rental configurations.
          </p>
        </div>

        <Link
          href="/dashboard/owner/add-equipment"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Equipment</span>
        </Link>
      </div>

      {/* Main Content */}
      {loading ? (
        <Loader message="Loading your equipment inventory..." />
      ) : error ? (
        <div className="warm-card p-8 text-center rounded-2xl text-rose-600 border border-rose-500/20">
          <p className="font-semibold text-sm">Failed to load equipment: {error}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={equipmentList}
          emptyMessage="You have not listed any equipment yet."
        />
      )}
    </div>
  );
}
