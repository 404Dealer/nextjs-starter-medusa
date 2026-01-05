import { BarberService } from "@modules/booking/data/services"

interface BookingSummaryProps {
  service: BarberService | null
  date: string
  time: string
}

export default function BookingSummary({
  service,
  date,
  time,
}: BookingSummaryProps) {
  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>

      {!service && !date && !time ? (
        <p className="text-sm text-gray-500">
          Select a service to get started
        </p>
      ) : (
        <div className="space-y-4">
          {service && (
            <div className="flex items-center gap-3">
              <span className="text-2xl">{service.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">{service.name}</div>
                <div className="text-sm text-gray-500">{service.duration} min</div>
              </div>
            </div>
          )}

          {date && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                {time && (
                  <div className="text-sm text-gray-500">
                    at {formatTime(time)}
                  </div>
                )}
              </div>
            </div>
          )}

          {service && (
            <>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  ${service.price}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Payment collected at the shop
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
