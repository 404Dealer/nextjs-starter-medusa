import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import AppointmentReview from "@modules/booking/components/appointment-review"

/**
 * Check if all items in cart are bookable (appointments only)
 */
function isBookingOnlyCart(cart: HttpTypes.StoreCart): boolean {
  if (!cart.items || cart.items.length === 0) {
    return false
  }

  return cart.items.every((item) => {
    const metadata = item.metadata as Record<string, unknown> | undefined
    return metadata?.appointment_date && metadata?.appointment_time
  })
}

/**
 * Check if cart contains any bookable items
 */
function hasBookableItems(cart: HttpTypes.StoreCart): boolean {
  if (!cart.items || cart.items.length === 0) {
    return false
  }

  return cart.items.some((item) => {
    const metadata = item.metadata as Record<string, unknown> | undefined
    return metadata?.appointment_date && metadata?.appointment_time
  })
}

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const isBookingOnly = isBookingOnlyCart(cart)
  const hasBookings = hasBookableItems(cart)

  // Only fetch shipping methods if cart has physical (non-booking) items
  const shippingMethods = isBookingOnly
    ? []
    : await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!paymentMethods) {
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />

      {/* Show appointment review for carts with bookable items */}
      {hasBookings && <AppointmentReview cart={cart} />}

      {/* Only show shipping for carts with physical items */}
      {!isBookingOnly && shippingMethods && (
        <Shipping cart={cart} availableShippingMethods={shippingMethods} />
      )}

      <Payment cart={cart} availablePaymentMethods={paymentMethods} />

      <Review cart={cart} />
    </div>
  )
}
