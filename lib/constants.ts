export const CATEGORIES = [
  {
    name: "Construction Equipment",
    description: "Excavators, mixers, scaffolding, and compactors for heavy civil builds.",
    icon: "HardHat",
    badge: "Industrial Grade",
  },
  {
    name: "Photography Equipment",
    description: "Cinema cameras, prime lenses, drone kits, and production lighting.",
    icon: "Camera",
    badge: "4K / 8K Cinema",
  },
  {
    name: "Vehicles & Transportation",
    description: "Cargo vans, flatbed trucks, utility pickups, and passenger haulers.",
    icon: "Truck",
    badge: "Commercial Fleet",
  },
  {
    name: "Agriculture Equipment",
    description: "High-horsepower tractors, harvesters, rotavators, and irrigation pumps.",
    icon: "Tractor",
    badge: "Heavy Ag",
  },
  {
    name: "Electronics",
    description: "High-end render laptops, mobile workstations, displays, and audio rigs.",
    icon: "Laptop",
    badge: "High Performance",
  },
  {
    name: "Event Equipment",
    description: "Line-array PA audio, staging, intelligent moving heads, and mixers.",
    icon: "Speaker",
    badge: "Pro Audio/Visual",
  },
] as const;

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"] as const;
