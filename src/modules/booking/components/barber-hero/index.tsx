import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function BarberHero() {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
        {/* Barber pole icon */}
        <div className="mb-8">
          <div className="w-16 h-32 rounded-full bg-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 flex flex-col">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 ${i % 2 === 0 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ transform: `skewY(-45deg) translateY(${i * 2}px)` }}
                />
              ))}
            </div>
          </div>
        </div>

        <h1 className="text-4xl small:text-5xl font-bold text-white mb-4 tracking-tight">
          Classic Cuts Barbershop
        </h1>

        <p className="text-lg small:text-xl text-gray-300 max-w-md mb-8">
          Premium grooming services since 1985.
          Book your appointment in seconds.
        </p>

        <div className="flex flex-col small:flex-row gap-4">
          <LocalizedClientLink
            href="/book"
            className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
          >
            Book Appointment
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/services"
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-200"
          >
            View Services
          </LocalizedClientLink>
        </div>

        {/* Quick info */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Mon-Sat: 9AM - 7PM</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>123 Main Street</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>(555) 123-4567</span>
          </div>
        </div>
      </div>
    </div>
  )
}
