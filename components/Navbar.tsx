"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
  Shield,
  Layers,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const user = session?.user;
  const userRole = (user as { role?: string })?.role || "customer";

  const getDashboardPath = (role: string) => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "owner") return "/dashboard/owner";
    return "/dashboard/customer";
  };

  const dashboardHref = getDashboardPath(userRole);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/equipment", label: "All Equipment" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#why-us", label: "About Us" },
    { href: "/#contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/85 border-b border-border/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-stone-900 flex items-center justify-center text-white shadow-md shadow-amber-900/10 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-amber-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-foreground flex items-center gap-1">
                Rentara
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground -mt-1">
                Equipment Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-amber-700 dark:text-amber-300 bg-amber-500/10 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Area (ThemeToggle + Auth Controls) */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {isPending ? (
              <div className="w-24 h-9 bg-muted/60 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-border bg-card/70 hover:bg-accent hover:border-amber-500/30 transition-all cursor-pointer shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-600/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-bold overflow-hidden">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User Avatar"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <span className="text-sm font-semibold max-w-[110px] truncate text-foreground">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border p-2 shadow-xl shadow-amber-950/10 z-50 animate-in fade-in-50 zoom-in-95">
                      <div className="px-3 py-2 border-b border-border/70 mb-1">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {user.email}
                        </p>
                        <div className="mt-1.5">
                          <span className="badge-warm text-[10px] py-0.5 px-2">
                            {userRole.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={dashboardHref}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300 rounded-lg transition-colors font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-600" />
                        Dashboard
                      </Link>

                      <Link
                        href="/dashboard/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300 rounded-lg transition-colors font-medium"
                      >
                        <User className="w-4 h-4 text-amber-600" />
                        My Profile
                      </Link>

                      <div className="border-t border-border/70 my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-amber-700 transition-all shadow-md shadow-amber-900/15 hover:shadow-lg hover:shadow-amber-900/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-border text-foreground hover:bg-muted"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-border pt-4">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-bold text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted"
                >
                  <User className="w-4 h-4 text-amber-600" />
                  My Profile
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-amber-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
