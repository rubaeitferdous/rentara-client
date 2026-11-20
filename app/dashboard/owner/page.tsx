"use client";

import { useState } from "react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import StatCard from "@/components/dashboard/StatCard";
import Loader from "@/components/Loader";
import type { OwnerAnalytics } from "@/types";
import {
  Package,
  Layers,
  CheckCircle2,
  DollarSign,
  PlusCircle,
  TrendingUp,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export default function OwnerDashboardPage() {
  const { data, loading, error } = useApi<OwnerAnalytics>("/analytics/owner");
  const [metric, setMetric] = useState<"earnings" | "bookings">("earnings");

  const monthlyData = data?.monthly?.length
    ? data.monthly
    : [
        { month: "Jan", earnings: 0, bookings: 0 },
        { month: "Feb", earnings: 0, bookings: 0 },
        { month: "Mar", earnings: 0, bookings: 0 },
      ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="warm-card p-6 sm:p-8 rounded-3xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Owner Enterprise Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Earnings & Fleet Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time business performance, rental velocity, and income generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <Link
            href="/dashboard/owner/add-equipment"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Equipment</span>
          </Link>
          <Link
            href="/dashboard/owner/my-equipment"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition-all cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>Manage Fleet</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <Loader message="Synthesizing owner business analytics..." />
      ) : error ? (
        <div className="warm-card p-8 text-center rounded-2xl text-rose-600 border border-rose-500/20">
          <p className="font-semibold text-sm">Failed to generate analytics: {error}</p>
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Listed Equipment"
              value={data?.totalEquipment ?? 0}
              hint="Total units in platform catalog"
              icon={<Package className="w-4 h-4" />}
            />
            <StatCard
              label="Total Bookings"
              value={data?.totalBookings ?? 0}
              hint="Reservations placed by customers"
              icon={<Layers className="w-4 h-4" />}
            />
            <StatCard
              label="Completed Rentals"
              value={data?.completedRentals ?? 0}
              hint="Successfully fulfilled orders"
              icon={<CheckCircle2 className="w-4 h-4" />}
            />
            <StatCard
              label="Total Gross Earnings"
              value={`$${(data?.totalEarnings ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`}
              hint="Cleared Stripe payment revenues"
              icon={<DollarSign className="w-4 h-4" />}
            />
          </div>

          {/* Dynamic Recharts Visualization */}
          <div className="warm-card p-6 rounded-3xl border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  <span>Revenue & Activity Performance</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Monthly trend analysis aggregated from confirmed rental transactions.
                </p>
              </div>

              <div className="inline-flex rounded-xl p-1 bg-muted border border-border">
                <button
                  type="button"
                  onClick={() => setMetric("earnings")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    metric === "earnings"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Earnings ($)
                </button>
                <button
                  type="button"
                  onClick={() => setMetric("bookings")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    metric === "bookings"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Bookings (Count)
                </button>
              </div>
            </div>

            <div className="w-full h-72 sm:h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {metric === "earnings" ? (
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                    <XAxis
                      dataKey="month"
                      stroke="currentColor"
                      className="text-xs opacity-60"
                      tickLine={false}
                    />
                    <YAxis
                      stroke="currentColor"
                      className="text-xs opacity-60"
                      tickLine={false}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="warm-card p-3 rounded-xl border border-border shadow-lg text-xs space-y-1">
                              <p className="font-bold text-foreground">{label}</p>
                              <p className="font-mono text-amber-600 font-extrabold text-sm">
                                ${Number(payload[0].value).toLocaleString()}
                              </p>
                              <p className="text-[10px] text-muted-foreground">Gross cleared revenue</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="#d97706"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#earningsGradient)"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                    <XAxis
                      dataKey="month"
                      stroke="currentColor"
                      className="text-xs opacity-60"
                      tickLine={false}
                    />
                    <YAxis
                      stroke="currentColor"
                      className="text-xs opacity-60"
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="warm-card p-3 rounded-xl border border-border shadow-lg text-xs space-y-1">
                              <p className="font-bold text-foreground">{label}</p>
                              <p className="font-mono text-amber-600 font-extrabold text-sm">
                                {payload[0].value} {payload[0].value === 1 ? "booking" : "bookings"}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="bookings" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
