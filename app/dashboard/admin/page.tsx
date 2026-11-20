"use client";

import { useState } from "react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import StatCard from "@/components/dashboard/StatCard";
import Loader from "@/components/Loader";
import type { AdminAnalytics } from "@/types";
import {
  Users,
  Package,
  Layers,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  BarChart3,
  Shield,
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

export default function AdminDashboardPage() {
  const { data, loading, error } = useApi<AdminAnalytics>("/analytics/admin");
  const [metric, setMetric] = useState<"revenue" | "bookings">("revenue");

  const monthlyData = data?.monthly?.length
    ? data.monthly
    : [
        { month: "Jan", revenue: 0, bookings: 0 },
        { month: "Feb", revenue: 0, bookings: 0 },
        { month: "Mar", revenue: 0, bookings: 0 },
      ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="warm-card p-6 sm:p-8 rounded-3xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Platform Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            System Overview & Metrics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Global operational health, financial turnover, catalog growth, and user volume.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <Link
            href="/dashboard/admin/equipment"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Moderate Listings ({data?.pendingApprovals ?? 0})</span>
          </Link>
          <Link
            href="/dashboard/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition-all cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <Loader message="Aggregating platform intelligence..." />
      ) : error ? (
        <div className="warm-card p-8 text-center rounded-2xl text-rose-600 border border-rose-500/20">
          <p className="font-semibold text-sm">Failed to generate admin analytics: {error}</p>
        </div>
      ) : (
        <>
          {/* Key Metrics Grid - 6 StatCards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              label="Total Users"
              value={data?.totalUsers ?? 0}
              hint="Registered accounts"
              icon={<Users className="w-4 h-4" />}
            />
            <StatCard
              label="Equipment"
              value={data?.totalEquipment ?? 0}
              hint="Catalog items"
              icon={<Package className="w-4 h-4" />}
            />
            <StatCard
              label="Bookings"
              value={data?.totalBookings ?? 0}
              hint="All-time transactions"
              icon={<Layers className="w-4 h-4" />}
            />
            <StatCard
              label="Pending"
              value={data?.pendingApprovals ?? 0}
              hint="Awaiting moderation"
              icon={<AlertTriangle className="w-4 h-4" />}
            />
            <StatCard
              label="Completed"
              value={data?.completedRentals ?? 0}
              hint="Fulfilled orders"
              icon={<CheckCircle2 className="w-4 h-4" />}
            />
            <StatCard
              label="Gross Volume"
              value={`$${(data?.totalRevenue ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`}
              hint="Cleared platform payments"
              icon={<DollarSign className="w-4 h-4" />}
            />
          </div>

          {/* Dynamic Recharts Visualization */}
          <div className="warm-card p-6 rounded-3xl border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  <span>Platform Revenue & Activity Velocity</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Monthly trend tracking system-wide transaction volume and revenue generation.
                </p>
              </div>

              <div className="inline-flex rounded-xl p-1 bg-muted border border-border">
                <button
                  type="button"
                  onClick={() => setMetric("revenue")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    metric === "revenue"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Revenue ($)
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
                {metric === "revenue" ? (
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
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
                              <p className="text-[10px] text-muted-foreground">Total platform gross</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#d97706"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#adminRevenueGradient)"
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
