import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import AppointmentConfirmation from "@modules/booking/components/appointment-confirmation"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

/**
 * Check if order contains any bookable items
 */
function hasBookableItems(order: HttpTypes.StoreOrder): boolean {
  return (
    order.items?.some((item) => {
      const metadata = item.metadata as Record<string, unknown> | undefined
      return metadata?.appointment_date && metadata?.appointment_time
    }) ?? false
  )
}

/**
 * Check if order contains only bookable items (no physical products)
 */
function isBookingOnlyOrder(order: HttpTypes.StoreOrder): boolean {
  if (!order.items || order.items.length === 0) {
    return false
  }
  return order.items.every((item) => {
    const metadata = item.metadata as Record<string, unknown> | undefined
    return metadata?.appointment_date && metadata?.appointment_time
  })
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"
  const hasAppointments = hasBookableItems(order)
  const isBookingOnly = isBookingOnlyOrder(order)

  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-4"
          >
            <span>Thank you!</span>
            <span>
              {hasAppointments
                ? "Your appointment has been booked!"
                : "Your order was placed successfully."}
            </span>
          </Heading>

          {/* Show appointment confirmation prominently at the top */}
          {hasAppointments && <AppointmentConfirmation order={order} />}

          <OrderDetails order={order} />
          <Heading level="h2" className="flex flex-row text-3xl-regular">
            Summary
          </Heading>
          <Items order={order} />
          <CartTotals totals={order} />

          {/* Only show shipping details for orders with physical products */}
          {!isBookingOnly && <ShippingDetails order={order} />}

          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </div>
  )
}
