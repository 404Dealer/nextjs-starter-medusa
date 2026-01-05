import { Metadata } from "next"
import BookingFlow from "@modules/booking/templates/booking-flow"

export const metadata: Metadata = {
  title: "Book Appointment | Classic Cuts Barbershop",
  description: "Book your haircut or grooming appointment online. Quick, easy scheduling.",
}

export default function BookingPage() {
  return <BookingFlow />
}
