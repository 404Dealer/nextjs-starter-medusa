"use client"

import { useState, useEffect } from "react"
import { Button } from "@medusajs/ui"
import { getAvailableSlots, TimeSlot } from "@lib/data/booking"
import { formatTimeForDisplay } from "@lib/data/booking-utils"

interface AppointmentPickerProps {
  blockMinutes?: number
  slotIncrement?: number
  onSelectSlot: (date: string, time: string, endTime: string) => void
  selectedDate?: string
  selectedTime?: string
  disabled?: boolean
}

export default function AppointmentPicker({
  blockMinutes = 60,
  slotIncrement = 15,
  onSelectSlot,
  selectedDate,
  selectedTime,
  disabled = false,
}: AppointmentPickerProps) {
  const [date, setDate] = useState<string>(selectedDate || "")
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate dates for the next 30 days (excluding past dates)
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d.toISOString().split("T")[0]
  })

  // Fetch available slots when date changes
  useEffect(() => {
    if (!date) {
      setSlots([])
      return
    }

    const fetchSlots = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getAvailableSlots(date, blockMinutes, slotIncrement)
        setSlots(response.slots)
      } catch (err) {
        setError("Unable to load available times. Please try again.")
        setSlots([])
      } finally {
        setLoading(false)
      }
    }

    fetchSlots()
  }, [date, blockMinutes, slotIncrement])

  const handleDateChange = (newDate: string) => {
    setDate(newDate)
  }

  const handleTimeSelect = (time: string) => {
    if (!date) return

    // Calculate end time
    const [hours, minutes] = time.split(":").map(Number)
    const startDateTime = new Date(date)
    startDateTime.setHours(hours, minutes, 0, 0)
    const endDateTime = new Date(startDateTime.getTime() + blockMinutes * 60 * 1000)

    onSelectSlot(date, time, endDateTime.toISOString())
  }

  const formatDateForDisplay = (dateStr: string) => {
    const d = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (dateStr === today.toISOString().split("T")[0]) {
      return "Today"
    }
    if (dateStr === tomorrow.toISOString().split("T")[0]) {
      return "Tomorrow"
    }

    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const availableSlots = slots.filter((slot) => slot.available)
  const hasAvailableSlots = availableSlots.length > 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {availableDates.slice(0, 7).map((d) => (
            <button
              key={d}
              onClick={() => handleDateChange(d)}
              disabled={disabled}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg border text-sm font-medium
                transition-colors duration-200
                ${
                  date === d
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {formatDateForDisplay(d)}
            </button>
          ))}
        </div>

        {/* Show full calendar dropdown for dates beyond first week */}
        <select
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          disabled={disabled}
          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">Select a date...</option>
          {availableDates.map((d) => (
            <option key={d} value={d}>
              {new Date(d).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </option>
          ))}
        </select>
      </div>

      {date && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time
          </label>

          {loading && (
            <div className="text-center py-4 text-gray-500">
              Loading available times...
            </div>
          )}

          {error && (
            <div className="text-center py-4 text-red-500">{error}</div>
          )}

          {!loading && !error && !hasAvailableSlots && (
            <div className="text-center py-4 text-gray-500">
              No available times for this date. Please select another date.
            </div>
          )}

          {!loading && !error && hasAvailableSlots && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => handleTimeSelect(slot.time)}
                  disabled={disabled}
                  className={`
                    px-3 py-2 rounded-lg border text-sm font-medium
                    transition-colors duration-200
                    ${
                      selectedTime === slot.time && selectedDate === date
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  {formatTimeForDisplay(slot.time)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedDate && selectedTime && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-sm font-medium text-green-800">
            Selected Appointment
          </div>
          <div className="text-sm text-green-700">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            at {formatTimeForDisplay(selectedTime)}
          </div>
        </div>
      )}
    </div>
  )
}
