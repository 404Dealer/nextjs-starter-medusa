"use server"

import { sdk } from "@lib/config"
import { getCartId } from "./cookies"

/**
 * Time slot type from the booking API
 */
export interface TimeSlot {
  time: string
  available: boolean
}

/**
 * Availability response from the booking API
 */
export interface AvailabilityResponse {
  date: string
  block_minutes: number
  slots: TimeSlot[]
}

/**
 * Hold response from the booking API
 */
export interface HoldResponse {
  hold: {
    id: string
    cart_id: string
    line_item_id: string
    slot_start: string
    slot_end: string
    expires_at: string
  }
}

/**
 * Fetches available time slots for a given date
 */
export async function getAvailableSlots(
  date: string,
  blockMinutes: number = 60,
  slotIncrement?: number
): Promise<AvailabilityResponse> {
  const query: Record<string, string> = {
    date,
    block_minutes: blockMinutes.toString(),
  }

  if (slotIncrement) {
    query.slot_increment = slotIncrement.toString()
  }

  const response = await sdk.client.fetch<AvailabilityResponse>(
    "/store/bookings/availability",
    {
      method: "GET",
      query,
    }
  )

  return response
}

/**
 * Creates a temporary hold on a time slot
 */
export async function createSlotHold(
  lineItemId: string,
  slotStart: string,
  slotEnd: string
): Promise<HoldResponse> {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No cart found")
  }

  const response = await sdk.client.fetch<HoldResponse>(
    "/store/bookings/hold",
    {
      method: "POST",
      body: {
        cart_id: cartId,
        line_item_id: lineItemId,
        slot_start: slotStart,
        slot_end: slotEnd,
      },
    }
  )

  return response
}

/**
 * Releases a hold on a time slot
 */
export async function releaseSlotHold(
  holdId?: string,
  lineItemId?: string
): Promise<void> {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No cart found")
  }

  const body: Record<string, string> = { cart_id: cartId }

  if (holdId) {
    body.hold_id = holdId
  } else if (lineItemId) {
    body.line_item_id = lineItemId
  }

  await sdk.client.fetch("/store/bookings/hold", {
    method: "DELETE",
    body,
  })
}

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
