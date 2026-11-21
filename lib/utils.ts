export { cn } from "cn";

/**
 * Safely formats a date string (e.g. "YYYY-MM-DD" or ISO timestamp) to a localized human-readable date
 * without timezone drift.
 */
export function formatDate(
  dateInput?: string | Date | null,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
): string {
  if (!dateInput) return "—";

  if (typeof dateInput === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [year, month, day] = dateInput.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", options);
  }

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", options);
}

/**
 * Safely computes inclusive rental days between two dates.
 */
export function calculateRentalDays(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 1;
  return Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
}
