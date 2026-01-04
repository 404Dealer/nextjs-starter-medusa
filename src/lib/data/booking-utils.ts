/**
 * Utility functions for booking display and calculations.
 * These are client-safe pure functions (no "use server" directive).
 */

/**
 * Calculates the end time for an appointment
 */
export function calculateEndTime(startTime: string, date: string, blockMinutes: number): string {
  const [hours, minutes] = startTime.split(":").map(Number)
  const startDate = new Date(date)
  startDate.setHours(hours, minutes, 0, 0)

  const endDate = new Date(startDate.getTime() + blockMinutes * 60 * 1000)

  return endDate.toISOString()
}

/**
 * Formats time for display (e.g., "09:00" -> "9:00 AM")
 */
export function formatTimeForDisplay(time: string): string {
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
}

/**
 * Formats date for display (e.g., "2025-01-15" -> "Wednesday, January 15, 2025")
 */
export function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
