import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BARBER_SERVICES } from "@modules/booking/data/services"

export const metadata: Metadata = {
  title: "Our Services | Classic Cuts Barbershop",
  description: "View our full range of haircuts and grooming services. From classic cuts to hot towel shaves.",
}

export default function ServicesPage() {
  return (
    <div className="content-container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Quality grooming services tailored to your style.
            All services include a consultation and finishing touches.
          </p>
        </div>

        <div className="grid grid-cols-1 small:grid-cols-2 gap-6 mb-12">
          {BARBER_SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{service.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {service.name}
                    </h2>
                    <span className="text-2xl font-bold text-gray-900">
                      ${service.price}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">
                    {service.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {service.duration} minutes
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <LocalizedClientLink
            href="/book"
            className="inline-block px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Book an Appointment
          </LocalizedClientLink>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 small:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick & Easy</h3>
            <p className="text-sm text-gray-600">
              Book your appointment in under a minute. No phone calls needed.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Skilled Barbers</h3>
            <p className="text-sm text-gray-600">
              Our team has 50+ years of combined experience.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Satisfaction Guaranteed</h3>
            <p className="text-sm text-gray-600">
              Not happy? We'll make it right, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
