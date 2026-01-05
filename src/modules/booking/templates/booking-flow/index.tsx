"use client"

import { useState } from "react"
import ServiceSelection, { BarberService, BARBER_SERVICES } from "@modules/booking/components/service-selection"
import AppointmentPicker from "@modules/booking/components/appointment-picker"
import BookingSummary from "@modules/booking/components/booking-summary"

type BookingStep = "service" | "datetime" | "confirm"

interface BookingData {
  service: BarberService | null
  date: string
  time: string
  endTime: string
}

export default function BookingFlow() {
  const [step, setStep] = useState<BookingStep>("service")
  const [booking, setBooking] = useState<BookingData>({
    service: null,
    date: "",
    time: "",
    endTime: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)

  const handleServiceSelect = (service: BarberService) => {
    setBooking((prev) => ({ ...prev, service }))
  }

  const handleSlotSelect = (date: string, time: string, endTime: string) => {
    setBooking((prev) => ({ ...prev, date, time, endTime }))
  }

  const handleContinue = () => {
    if (step === "service" && booking.service) {
      setStep("datetime")
    } else if (step === "datetime" && booking.date && booking.time) {
      setStep("confirm")
    }
  }

  const handleBack = () => {
    if (step === "datetime") {
      setStep("service")
    } else if (step === "confirm") {
      setStep("datetime")
    }
  }

  const handleConfirmBooking = async () => {
    setIsSubmitting(true)

    // TODO: Replace with actual API call when backend is ready
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setBookingComplete(true)
  }

  const handleStartOver = () => {
    setBooking({
      service: null,
      date: "",
      time: "",
      endTime: "",
    })
    setStep("service")
    setBookingComplete(false)
  }

  const canContinue =
    (step === "service" && booking.service) ||
    (step === "datetime" && booking.date && booking.time)

  // Booking confirmed view
  if (bookingComplete) {
    return (
      <div className="content-container py-12">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>

          <p className="text-gray-600 mb-8">
            We've sent a confirmation to your email. See you soon!
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Your Appointment</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service</span>
                <span className="font-medium">{booking.service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">
                  {new Date(booking.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="font-medium">
                  {formatTime(booking.time)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{booking.service?.duration} min</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-lg">${booking.service?.price}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartOver}
            className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="content-container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <Step number={1} label="Service" active={step === "service"} completed={step !== "service"} />
            <div className={`w-12 h-0.5 ${step !== "service" ? "bg-gray-900" : "bg-gray-300"}`} />
            <Step number={2} label="Date & Time" active={step === "datetime"} completed={step === "confirm"} />
            <div className={`w-12 h-0.5 ${step === "confirm" ? "bg-gray-900" : "bg-gray-300"}`} />
            <Step number={3} label="Confirm" active={step === "confirm"} completed={false} />
          </div>
        </div>

        <div className="grid grid-cols-1 small:grid-cols-[1fr_320px] gap-8">
          {/* Main Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {step === "service" && (
              <ServiceSelection
                selectedService={booking.service}
                onSelectService={handleServiceSelect}
              />
            )}

            {step === "datetime" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Pick a Date & Time
                </h2>
                <AppointmentPicker
                  blockMinutes={booking.service?.duration || 30}
                  slotIncrement={15}
                  selectedDate={booking.date}
                  selectedTime={booking.time}
                  onSelectSlot={handleSlotSelect}
                />
              </div>
            )}

            {step === "confirm" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Confirm Your Booking
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <span className="text-3xl">{booking.service?.icon}</span>
                    <div>
                      <h3 className="font-semibold">{booking.service?.name}</h3>
                      <p className="text-sm text-gray-600">{booking.service?.description}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="font-medium">
                          {new Date(booking.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatTime(booking.time)} - {booking.service?.duration} minutes
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-sm text-yellow-800">
                        Please arrive 5 minutes before your appointment time.
                        Cancellations must be made at least 2 hours in advance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="small:sticky small:top-24 h-fit">
            <BookingSummary
              service={booking.service}
              date={booking.date}
              time={booking.time}
            />

            <div className="mt-4 space-y-3">
              {step !== "service" && (
                <button
                  onClick={handleBack}
                  className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors"
                >
                  Back
                </button>
              )}

              {step !== "confirm" ? (
                <button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className={`
                    w-full px-6 py-3 font-semibold rounded-lg transition-colors
                    ${canContinue
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }
                  `}
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Booking...
                    </span>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step({
  number,
  label,
  active,
  completed,
}: {
  number: number
  label: string
  active: boolean
  completed: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
          ${active ? "bg-gray-900 text-white" : ""}
          ${completed ? "bg-gray-900 text-white" : ""}
          ${!active && !completed ? "bg-gray-200 text-gray-600" : ""}
        `}
      >
        {completed ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          number
        )}
      </div>
      <span className={`text-sm ${active ? "font-semibold text-gray-900" : "text-gray-600"}`}>
        {label}
      </span>
    </div>
  )
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
}
