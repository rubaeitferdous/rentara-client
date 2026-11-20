/**
 * Accurately calculates rental amounts identically to the server-side formula.
 * Used for live client preview during date and quantity selection.
 */
export function calcAmount(
  rentalType: string,
  price: number,
  startDate: string,
  endDate: string,
  quantity: number
): number {
  if (!startDate || !endDate || !price || quantity < 1) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return 0;
  }

  const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const days = Math.max(1, diffDays);

  const type = (rentalType || "Daily").toLowerCase();
  const units =
    type === "weekly"
      ? Math.ceil(days / 7)
      : type === "monthly"
      ? Math.ceil(days / 30)
      : days;

  return Math.round(units * price * quantity * 100) / 100;
}
