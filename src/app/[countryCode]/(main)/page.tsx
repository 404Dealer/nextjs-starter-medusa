import { Metadata } from "next"
import BarberHero from "@modules/booking/components/barber-hero"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Classic Cuts Barbershop | Premium Grooming Services",
  description:
    "Book your haircut online. Classic cuts, beard trims, and hot towel shaves. Walk-ins welcome.",
}

// Featured services for the homepage
const FEATURED_SERVICES = [
  {
    id: "haircut",
    name: "Classic Haircut",
    description: "Traditional cut with clippers and scissors",
    duration: 30,
    price: 25,
    icon: "✂️",
  },
  {
    id: "haircut-beard",
    name: "Haircut + Beard",
    description: "Full haircut with beard shaping",
    duration: 45,
    price: 40,
    icon: "💈",
  },
  {
    id: "hot-towel-shave",
    name: "Hot Towel Shave",
    description: "Luxurious straight razor shave",
    duration: 30,
    price: 35,
    icon: "🪒",
  },
]

export default async function Home() {
  return (
    <>
      <BarberHero />

      {/* Featured Services Section */}
      <section className="py-16 bg-white">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Quality cuts at fair prices. No appointment needed for walk-ins,
              but booking guarantees your spot.
            </p>
          </div>

          <div className="grid grid-cols-1 small:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {FEATURED_SERVICES.map((service) => (
              <div
                key={service.id}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-200"
              >
                <span className="text-5xl mb-4 block">{service.icon}</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {service.description}
                </p>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  ${service.price}
                </div>
                <div className="text-sm text-gray-500">
                  {service.duration} min
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <LocalizedClientLink
              href="/services"
              className="text-gray-900 font-medium hover:underline"
            >
              View all services →
            </LocalizedClientLink>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Classic Cuts?
            </h2>
          </div>

          <div className="grid grid-cols-1 small:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                40+
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Years of Experience</h3>
              <p className="text-sm text-gray-600">Serving the community since 1985</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                5★
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Top Rated</h3>
              <p className="text-sm text-gray-600">500+ five-star reviews</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                $
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Fair Prices</h3>
              <p className="text-sm text-gray-600">Quality without the markup</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Easy Booking</h3>
              <p className="text-sm text-gray-600">Book online in seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="content-container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for a Fresh Cut?
          </h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Book your appointment now and skip the wait.
            Walk-ins welcome, but appointments get priority.
          </p>
          <LocalizedClientLink
            href="/book"
            className="inline-block px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Book Your Appointment
          </LocalizedClientLink>
        </div>
      </section>
    </>
  )
}
