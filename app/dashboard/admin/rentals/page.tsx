"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import DataTable, { Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Pagination from "@/components/dashboard/Pagination";
import InvoiceModal from "@/components/dashboard/InvoiceModal";
import Loader from "@/components/Loader";
import type { Booking, Paged } from "@/types";
import { Layers, ArrowRight, ExternalLink, Receipt } from "lucide-react";

export default function AdminRentalsPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useApi<Paged<Booking>>(
    `/bookings/admin?page=${page}&limit=10`
  );
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null);

  const bookings = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const columns: Column<Booking>[] = [
    {
      header: "Transaction",
      render: (b) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-foreground">
            #{b._id.slice(-8).toUpperCase()}
          </span>
          <p className="text-[11px] text-muted-foreground">
            {new Date(b.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      ),
    },
    {
      header: "Equipment",
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
            {b.equipmentImage ? (
              <Image src={b.equipmentImage} alt={b.equipmentName} fill className="object-cover" sizes="40px" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-bold">
                GEAR
              </div>
            )}
          </div>
          <div>
            <Link
              href={`/equipment/${b.equipmentId}`}
              className="font-bold text-foreground hover:text-amber-600 transition-colors line-clamp-1 inline-flex items-center gap-1 group"
            >
              <span>{b.equipmentName}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
            <p className="text-xs text-muted-foreground">Qty: {b.quantity}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Transacting Parties",
      render: (b) => (
        <div className="space-y-1 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Renter: </span>
            <span className="font-semibold text-foreground">{b.customerName}</span>
            <span className="text-muted-foreground text-[11px] block">{b.customerEmail}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Owner: </span>
            <span className="font-semibold text-foreground">{b.ownerName}</span>
            <span className="text-muted-foreground text-[11px] block">{b.ownerEmail}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Rental Duration",
      render: (b) => {
        const start = new Date(b.startDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const end = new Date(b.endDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        return (
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-foreground">
              {start} → {end}
            </p>
          </div>
        );
      },
    },
    {
      header: "Gross Amount",
      render: (b) => (
        <span className="font-mono font-extrabold text-foreground text-sm">
          ${Number(b.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: "Payment",
      render: (b) => <StatusBadge status={b.paymentStatus} />,
    },
    {
      header: "Rental Status",
      render: (b) => <StatusBadge status={b.bookingStatus} />,
    },
    {
      header: "Action",
      className: "text-right",
      render: (b) => (
        <div className="text-right">
          <button
            type="button"
            onClick={() => setSelectedInvoice(b)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer shadow-xs"
            title="Inspect Official Receipt"
          >
            <Receipt className="w-3.5 h-3.5 text-amber-600" />
            <span>Receipt</span>
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
            <Layers className="w-4 h-4" />
            <span>Financial & Rental Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Platform Rental Transactions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Complete audit trail of all equipment bookings, financial exchanges, and order statuses.
          </p>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <Loader message="Loading platform transaction ledger..." />
      ) : error ? (
        <div className="warm-card p-8 text-center rounded-2xl text-rose-600 border border-rose-500/20">
          <p className="font-semibold text-sm">Failed to load rentals: {error}</p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={bookings}
            emptyMessage="No rental records exist across the platform yet."
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(newPage) => setPage(newPage)}
          />
        </>
      )}

      {/* Invoice / Receipt Modal */}
      <InvoiceModal
        booking={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
}
