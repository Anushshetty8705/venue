// data.js
export const sampleHalls = [
  {
    id: "1",
    name: "Royal Orchid Banquet",
    location: "Downtown",
    capacity: 300,
    image: "/hall1.jpg",
    contact: { phone: "9876543210", email: "royal@orchid.com" },
    pricing: { morning: 6000, afternoon: 7000, evening: 8000, "full-day": 20000 },
  },
  {
    id: "2",
    name: "Skyline Grand",
    location: "Uptown",
    capacity: 500,
    image: "/hall2.jpg",
    contact: { phone: "9123456789", email: "skyline@grand.com" },
    pricing: { morning: 10000, afternoon: 11000, evening: 12000, "full-day": 30000 },
  },
  {
    id: "3",
    name: "Moonlight Hall",
    location: "Suburb",
    capacity: 200,
    image: "/hall3.jpg",
    contact: { phone: "9988776655", email: "moonlight@hall.com" },
    pricing: { morning: 4000, afternoon: 5000, evening: 6000, "full-day": 15000 },
  },
];

export const existingBookings = [
  { hallId: "1", date: "2025-10-10", slot: "morning" },
  { hallId: "1", date: "2025-10-10", slot: "afternoon" },
  { hallId: "1", date: "2025-10-10", slot: "evening" },
  { hallId: "2", date: "2025-10-10", slot: "full-day" },
];
