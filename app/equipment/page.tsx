"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import type { Equipment, Paged } from "@/types";
import { CATEGORIES, RENTAL_TYPES } from "@/lib/constants";
import EquipmentCard from "@/components/EquipmentCard";
import Loader from "@/components/Loader";
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  ArrowUpDown,
  Sparkles,
  X,
} from "lucide-react";

function EquipmentCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL Query State
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialRentalType = searchParams.get("rentalType") || "All";
  const initialSort = searchParams.get("sort") || "newest";
  const initialMinPrice = searchParams.get("minPrice") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";
  const initialAvailability = searchParams.get("availability") || "all";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  // Local Interactive States
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [rentalType, setRentalType] = useState(initialRentalType);
  const [sort, setSort] = useState(initialSort);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [availability, setAvailability] = useState(initialAvailability);
  const [page, setPage] = useState(initialPage);

  // Mobile Filters Drawer State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data fetching state
  const [data, setData] = useState<Paged<Equipment> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sync state to URL without refresh
  const syncQuery = useCallback(
    (updates: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "All" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Synchronize URL parameters with local state on browser navigation / external link clicks
  useEffect(() => {
    const qSearch = searchParams.get("search") || "";
    const qCat = searchParams.get("category") || "All";
    const qRent = searchParams.get("rentalType") || "All";
    const qSort = searchParams.get("sort") || "newest";
    const qMin = searchParams.get("minPrice") || "";
    const qMax = searchParams.get("maxPrice") || "";
    const qAvail = searchParams.get("availability") || "all";
    const qPage = parseInt(searchParams.get("page") || "1", 10);

    setSearch(qSearch);
    setDebouncedSearch(qSearch);
    setCategory(qCat);
    setRentalType(qRent);
    setSort(qSort);
    setMinPrice(qMin);
    setMaxPrice(qMax);
    setAvailability(qAvail);
    setPage(qPage);
  }, [searchParams]);

  // Debounce search input to avoid request flooding
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      if (search !== (searchParams.get("search") || "")) {
        syncQuery({ search, page: 1 });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [search, searchParams, syncQuery]);

  // Fetch equipment with server-side filters & sorting
  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams();
      if (debouncedSearch.trim()) queryParams.set("search", debouncedSearch.trim());
      if (category && category !== "All") queryParams.set("category", category);
      if (rentalType && rentalType !== "All") queryParams.set("rentalType", rentalType);
      if (minPrice) queryParams.set("minPrice", minPrice);
      if (maxPrice) queryParams.set("maxPrice", maxPrice);
      if (availability && availability !== "all") queryParams.set("availability", availability);
      if (sort) queryParams.set("sort", sort);
      queryParams.set("page", String(page));
      queryParams.set("limit", "9");

      const res = await api<Paged<Equipment>>(`/equipment?${queryParams.toString()}`, {}, false);
      setData(res);
    } catch (err: any) {
      console.error("Catalog fetch error:", err);
      setError(err.message || "Failed to load equipment catalog.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, rentalType, minPrice, maxPrice, availability, sort, page]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  // Handler functions
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    syncQuery({ search, page: 1 });
  };

  const handleCategorySelect = (newCat: string) => {
    setCategory(newCat);
    setPage(1);
    syncQuery({ category: newCat, page: 1 });
  };

  const handleRentalTypeSelect = (newType: string) => {
    setRentalType(newType);
    setPage(1);
    syncQuery({ rentalType: newType, page: 1 });
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    syncQuery({ sort: newSort });
  };

  const handleAvailabilityChange = (newAvail: string) => {
    setAvailability(newAvail);
    setPage(1);
    syncQuery({ availability: newAvail, page: 1 });
  };

  const handlePriceApply = () => {
    setPage(1);
    syncQuery({ minPrice, maxPrice, page: 1 });
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setRentalType("All");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setAvailability("all");
    setPage(1);
    router.push(pathname, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    syncQuery({ page: newPage });
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const items = data?.equipment || data?.items || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.total || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      {/* Page Title & Search Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Marketplace Fleet</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              All Equipment
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Browse, filter, and inspect verified machinery with guaranteed real-time availability.
            </p>
          </div>

          {/* Quick Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, location, brand..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-amber-700 transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
          <button
            type="button"
            onClick={() => handleCategorySelect("All")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              category === "All"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => handleCategorySelect(c.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                category === c.name
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Catalog Section: Filter Sidebar + 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block warm-card p-6 rounded-2xl space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>Filter &amp; Refine</span>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Rental Type Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Rental Horizon
            </label>
            <select
              value={rentalType}
              onChange={(e) => handleRentalTypeSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="All">All Horizons (Daily, Weekly, Monthly)</option>
              {RENTAL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Status Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Availability
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { id: "all", label: "All Items" },
                { id: "available", label: "In Stock Only" },
                { id: "unavailable", label: "Fully Rented Out" },
              ].map((av) => (
                <label
                  key={av.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 cursor-pointer font-medium text-foreground"
                >
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === av.id}
                    onChange={() => handleAvailabilityChange(av.id)}
                    className="accent-amber-600"
                  />
                  <span>{av.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Price Range ($)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <button
              type="button"
              onClick={handlePriceApply}
              className="w-full py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              Apply Price Bounds
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-b border-border/80">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {loading ? "Searching..." : `${totalCount} Equipment Items Available`}
              </span>
              {(search || category !== "All" || rentalType !== "All" || minPrice || maxPrice) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-bold text-foreground bg-card"
              >
                <Filter className="w-3.5 h-3.5 text-amber-600" />
                <span>Filters</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground shrink-0 font-medium">
                  Sort:
                </span>
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
                >
                  <option value="newest">Recently Added</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Equipment Grid (Strict 3-Column Layout as required) */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="warm-card h-96 rounded-2xl bg-muted/40 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 warm-card p-8 space-y-3">
              <p className="text-sm text-red-500 font-bold">{error}</p>
              <button
                type="button"
                onClick={fetchEquipment}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                Retry
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="warm-card p-12 text-center space-y-4 rounded-3xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center mx-auto">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                No Equipment Matches Your Criteria
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Try loosening your filters, selecting a different industry category, or
                resetting your search query.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-amber-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {items.map((item) => (
                <div key={item._id} className="h-full">
                  <EquipmentCard item={item} />
                </div>
              ))}
            </div>
          )}

          {/* Server-Side Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-6 mt-8">
              <div className="text-xs text-muted-foreground font-medium">
                Page <span className="font-bold text-foreground">{page}</span> of{" "}
                <span className="font-bold text-foreground">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="p-2 rounded-xl border border-border bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, pIdx) => {
                  const pageNum = pIdx + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        page === pageNum
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="p-2 rounded-xl border border-border bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-card border-l border-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                  <span>Filter Equipment</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rental Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Rental Horizon
                </label>
                <select
                  value={rentalType}
                  onChange={(e) => handleRentalTypeSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
                >
                  <option value="All">All Horizons</option>
                  {RENTAL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Bounds */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Price Bounds ($)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-2">
              <button
                type="button"
                onClick={() => {
                  handlePriceApply();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AllEquipmentPage() {
  return (
    <Suspense fallback={<Loader fullScreen message="Loading Equipment Catalog..." />}>
      <EquipmentCatalog />
    </Suspense>
  );
}
