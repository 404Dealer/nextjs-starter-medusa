import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { formatTimeForDisplay, formatDateForDisplay } from "@lib/data/booking"

interface AppointmentReviewProps {
  cart: HttpTypes.StoreCart
}

interface AppointmentItem {
  id: string
  title: string
  variant: string
  date: string
  time: string
}

export default function AppointmentReview({ cart }: AppointmentReviewProps) {
  // Extract bookable items from cart
  const appointmentItems: AppointmentItem[] = []

  cart.items?.forEach((item) => {
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
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Appointment Details
        </Heading>
      </div>

      <div className="bg-ui-bg-subtle p-4 rounded-lg">
        {appointmentItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 border-b last:border-0 border-ui-border-base"
          >
            <div className="flex justify-between items-start">
              <div>
                <Text className="font-medium text-ui-fg-base">
                  {item.title}
                </Text>
                {item.variant && (
                  <Text className="text-sm text-ui-fg-subtle">
                    {item.variant}
                  </Text>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-2 text-ui-fg-base">
                <span className="text-lg">📅</span>
                <span className="font-medium">
                  {formatDateForDisplay(item.date)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-ui-fg-base">
                <span className="text-lg">🕐</span>
                <span className="font-medium">
                  {formatTimeForDisplay(item.time)}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <Text className="text-sm text-green-800">
            Your appointment{appointmentItems.length > 1 ? "s are" : " is"} reserved.
            Complete your payment to confirm.
          </Text>
        </div>
      </div>
    </div>
  )
}
