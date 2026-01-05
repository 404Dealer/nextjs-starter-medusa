export interface BarberService {
  id: string
  name: string
  description: string
  duration: number // in minutes
  price: number
  icon: string
}

export const BARBER_SERVICES: BarberService[] = [
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
    name: "Haircut + Beard Trim",
    description: "Full haircut with beard shaping and trim",
    duration: 45,
    price: 40,
    icon: "💈",
  },
  {
    id: "beard-trim",
    name: "Beard Trim",
    description: "Shape and trim your beard to perfection",
    duration: 20,
    price: 15,
    icon: "🧔",
  },
  {
    id: "hot-towel-shave",
    name: "Hot Towel Shave",
    description: "Luxurious straight razor shave with hot towel",
    duration: 30,
    price: 35,
    icon: "🪒",
  },
  {
    id: "kids-cut",
    name: "Kids Haircut",
    description: "Haircut for children under 12",
    duration: 20,
    price: 18,
    icon: "👦",
  },
  {
    id: "buzz-cut",
    name: "Buzz Cut",
    description: "Quick and clean all-over clipper cut",
    duration: 15,
    price: 15,
    icon: "⚡",
  },
]
