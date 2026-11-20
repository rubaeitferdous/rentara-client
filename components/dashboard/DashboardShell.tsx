"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import type { Role } from "@/types";
import {
  Compass,
  LayoutDashboard,
  CalendarDays,
  Heart,
  PlusCircle,
  Package,
  Layers,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
  User,
  ShoppingBag,
} from "lucide-react";

interface MenuItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const DASHBOARD_MENUS: Record<Role, MenuItem[]> = {
  customer: [
    { href: "/dashboard/customer/my-rentals", label: "My Rentals", icon: CalendarDays },
    { href: "/dashboard/customer/favorites", label: "Saved Favorites", icon: Heart },
    { href: "/dashboard/profile", label: "My Profile", icon: User },
  ],
  owner: [
    { href: "/dashboard/owner", label: "Earnings Analytics", icon: LayoutDashboard },
    { href: "/dashboard/owner/add-equipment", label: "Add Equipment", icon: PlusCircle },
    { href: "/dashboard/owner/my-equipment", label: "My Equipment", icon: Package },
    { href: "/dashboard/owner/my-equipment-rental", label: "Rental Orders", icon: Layers },
    { href: "/dashboard/profile", label: "My Profile", icon: User },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Platform Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/equipment", label: "All Equipment", icon: Package },
    { href: "/dashboard/admin/rentals", label: "Global Ledger", icon: Layers },
    { href: "/dashboard/profile", label: "My Profile", icon: User },
  ],
};

interface DashboardShellProps {
  role: Role;
  user: {
    name: string;
    email: string;
    image?: string;
  };
  children: React.ReactNode;
}

export default function DashboardShell({ role, user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = DASHBOARD_MENUS[role] || DASHBOARD_MENUS.customer;

  const handleLogout = async () => {
    try {
      await signOut();
      clearTokenCache();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (href: string) => {
    if (href === "/dashboard/customer/my-rentals") {
      return pathname === href || pathname === "/dashboard/customer";
    }
    return pathname === href;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-68 flex-col justify-between border-r border-border bg-card/70 backdrop-blur-md p-4 shrink-0 fixed inset-y-0 z-30">
        <div className="space-y-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 px-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-stone-900 flex items-center justify-center text-white shadow-md">
              <Compass className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-foreground">
                Rentara
              </span>
              <span className="text-[10px] block font-semibold uppercase tracking-wider text-muted-foreground -mt-1">
                {role} Console
              </span>
            </div>
          </Link>

          {/* User Profile Mini Card */}
          <div className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-600/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
              <span className="badge-warm text-[10px] py-0 px-1.5 mt-0.5 capitalize">
                {role}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-amber-900/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-2 pt-4 border-t border-border">
          <Link
            href="/equipment"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span>Browse Catalog</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-68 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl border border-border lg:hidden text-foreground hover:bg-muted"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-foreground capitalize">
              {role} Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border hover:bg-muted hidden sm:inline-flex"
            >
              Main Site
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[80vw] bg-card border-r border-border p-5 flex flex-col justify-between z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                  <Compass className="w-5 h-5 text-amber-600" />
                  <span>Rentara</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Mini Info */}
              <div className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-600/20 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="truncate flex-1">
                  <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                  <span className="badge-warm text-[10px] py-0 px-1.5 capitalize">{role}</span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <Link
                href="/equipment"
                onClick={() => setMobileSidebarOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted"
              >
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <span>Browse Catalog</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 text-xs font-bold text-red-600 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
