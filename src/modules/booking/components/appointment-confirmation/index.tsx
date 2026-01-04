import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { formatTimeForDisplay, formatDateForDisplay } from "@lib/data/booking"

interface AppointmentConfirmationProps {
  order: HttpTypes.StoreOrder
}

interface AppointmentItem {
  id: string
  title: string
  variant: string
  date: string
  time: string
}

export default function AppointmentConfirmation({
  order,
}: AppointmentConfirmationProps) {
  // Extract bookable items from order
  const appointmentItems: AppointmentItem[] = []

  order.items?.forEach((item) => {
    const metadata = item.metadata as Record<string, unknown> | undefined
    if (metadata?.appointment_date && metadata?.appointment_time) {
      appointmentItems.push({
        id: item.id,
        title: item.product_title || "Appointment",
        variant: item.variant?.title || "",
        date: metadata.appointment_date as string,
        time: metadata.appointment_time as string,
      })
    }
  })

  if (appointmentItems.length === 0) {
    return null
  }

  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl">✅</div>
        <Heading level="h2" className="text-xl font-semibold text-green-800">
          Appointment{appointmentItems.length > 1 ? "s" : ""} Confirmed!
        </Heading>
      </div>

      <div className="space-y-4">
        {appointmentItems.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-lg p-4 shadow-sm border border-green-100"
          >
            <div className="flex flex-col gap-2">
              <Text className="font-semibold text-ui-fg-base text-lg">
                {item.title}
              </Text>
              {item.variant && (
                <Text className="text-sm text-ui-fg-subtle">{item.variant}</Text>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  <div>
                    <Text className="text-xs text-ui-fg-subtle uppercase tracking-wide">
                      Date
                    </Text>
                    <Text className="font-medium text-ui-fg-base">
                      {formatDateForDisplay(item.date)}
                    </Text>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <Text className="text-xs text-ui-fg-subtle uppercase tracking-wide">
                      Time
                    </Text>
                    <Text className="font-medium text-ui-fg-base">
                      {formatTimeForDisplay(item.time)}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-green-700">
        <p>
          We look forward to seeing you! If you need to reschedule or have any
          questions, please contact us.
        </p>
      </div>
    </div>
  )
}
