"use client"

import { BARBER_SERVICES, BarberService } from "@modules/booking/data/services"

export type { BarberService }

interface ServiceSelectionProps {
  selectedService: BarberService | null
  onSelectService: (service: BarberService) => void
}

export default function ServiceSelection({
  selectedService,
  onSelectService,
}: ServiceSelectionProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Select a Service
      </h2>

      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        {BARBER_SERVICES.map((service) => {
          const isSelected = selectedService?.id === service.id

          return (
            <button
              key={service.id}
              onClick={() => onSelectService(service)}
              className={`
                p-4 rounded-xl border-2 text-left transition-all duration-200
                ${isSelected
                  ? "border-gray-900 bg-gray-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }
              `}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{service.icon}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <span className="font-bold text-gray-900">
                      ${service.price}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {service.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {service.duration} min
                  </div>
                </div>

                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
