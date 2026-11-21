"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import DataTable, { Column } from "@/components/dashboard/DataTable";
import Loader from "@/components/Loader";
import type { UserRecord, Role } from "@/types";
import {
  Users,
  Shield,
  ShieldAlert,
  Trash2,
  Search,
  UserCheck,
  Calendar,
} from "lucide-react";

export default function AdminUsersPage() {
  const { data: initialData, loading, error } = useApi<UserRecord[]>("/users");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (initialData) {
      setUsers(initialData);
    }
  }, [initialData]);

  const handleRoleChange = async (userId: string, userName: string, newRole: Role) => {
    const result = await Swal.fire({
      title: "Update Account Role?",
      text: `Change permission tier for ${userName} to "${newRole.toUpperCase()}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
      background: "var(--card)",
      color: "var(--foreground)",
    });

    if (!result.isConfirmed) return;

    try {
      await api(`/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      toast.success(`Role updated to ${newRole}`);
    } catch (err: any) {
      console.error("Failed to update role:", err);
      toast.error(err.message || "Could not change role");
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const result = await Swal.fire({
      title: "Delete User Account?",
      text: `Permanently delete account for "${userName}"? This will terminate their access and data.`,
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
      await api(`/users/${userId}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User account deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      toast.error(err.message || "Could not delete user account");
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  const columns: Column<UserRecord>[] = [
    {
      header: "User Account",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-amber-500/10 text-amber-600 border border-border shrink-0 flex items-center justify-center font-bold text-xs">
            {u.image ? (
              <Image src={u.image} alt={u.name} fill className="object-cover" sizes="40px" unoptimized />
            ) : (
              <span>{u.name?.slice(0, 2).toUpperCase() || "US"}</span>
            )}
          </div>
          <div>
            <p className="font-bold text-foreground line-clamp-1">{u.name}</p>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Current Role",
      render: (u) => {
        const badgeColors: Record<Role, string> = {
          admin: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
          owner: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
          customer: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
        };
        const role = (u.role || "customer") as Role;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${
              badgeColors[role] || "bg-muted text-muted-foreground"
            }`}
          >
            {role === "admin" && <ShieldAlert className="w-3 h-3" />}
            {role === "owner" && <UserCheck className="w-3 h-3" />}
            {role}
          </span>
        );
      },
    },
    {
      header: "Joined Date",
      render: (u) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {u.createdAt
            ? new Date(u.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      header: "Modify Role",
      render: (u) => (
        <select
          value={u.role || "customer"}
          onChange={(e) => handleRoleChange(u._id, u.name, e.target.value as Role)}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500"
        >
          <option value="customer">Customer</option>
          <option value="owner">Owner</option>
          <option value="admin">Administrator</option>
        </select>
      ),
    },
    {
      header: "Action",
      className: "text-right",
      render: (u) => (
        <div className="text-right">
          <button
            type="button"
            onClick={() => handleDeleteUser(u._id, u.name)}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            title="Delete User"
            aria-label="Delete User"
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
            <Users className="w-4 h-4" />
            <span>Platform Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            User Management & Roles
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review user identities, assign operational privileges, and moderate access.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <Loader message="Loading registered users..." />
      ) : error ? (
        <div className="warm-card p-8 text-center rounded-2xl text-rose-600 border border-rose-500/20">
          <p className="font-semibold text-sm">Failed to load users: {error}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={filteredUsers}
          emptyMessage="No matching users found."
        />
      )}
    </div>
  );
}
