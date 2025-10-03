"use client";
import React from "react";
import { existingBookings } from "./data"; // move your sampleHalls and bookings to a data file if needed

export default function HallList({ halls, filters, onSelectHall }) {
  const getDatesBetween = (from, to) => {
    const dates = [];
    const start = new Date(from);
    const end = new Date(to);
    while (start <= end) {
      dates.push(start.toISOString().split("T")[0]);
      start.setDate(start.getDate() + 1);
    }
    return dates;
  };

  const filteredHalls = halls.filter(h => {
    let ok = true;

    // Location
    if (filters.location && h.location !== filters.location) ok = false;

    // Capacity
    if (filters.capacityRange) {
      const [min, max] = filters.capacityRange.split("-").map(Number);
      if (h.capacity < min || h.capacity > max) ok = false;
    }

    // Price
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange.split("-").map(Number);
      const hallMin = Math.min(...Object.values(h.pricing));
      const hallMax = Math.max(...Object.values(h.pricing));
      if (hallMax < minPrice || hallMin > maxPrice) ok = false;
    }

    // Booking availability
    if (filters.type === "slot" && filters.date) {
      const bookings = existingBookings.filter(b => b.hallId === h.id && b.date === filters.date);
      if (filters.slot) {
        if (bookings.some(b => b.slot === filters.slot || b.slot === "full-day")) ok = false;
      } else {
        if (["morning", "afternoon", "evening"].every(s => bookings.map(b => b.slot).includes(s))) ok = false;
      }
    }

    if (filters.type === "day" && filters.from && filters.to) {
      const dates = getDatesBetween(filters.from, filters.to);
      if (dates.some(d => existingBookings.some(b => b.hallId === h.id && b.date === d && b.slot === "full-day")))
        ok = false;
    }

    return ok;
  });

  if (!filteredHalls.length) return <div className="text-white text-center mt-10">No halls match your filters.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredHalls.map(h => (
        <div key={h.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg backdrop-blur-md">
          <img src={h.image} alt={h.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-xl font-semibold text-sky-200">{h.name}</h3>
            <p className="text-sm text-sky-100">{h.location}</p>
            <p className="text-sm text-white mt-2">Capacity: {h.capacity}</p>
            <p className="text-sm text-white">💰 From ₹{Math.min(...Object.values(h.pricing))}</p>
            <p className="text-sm text-white mt-1">📞 {h.contact.phone}</p>
            <p className="text-sm text-white">✉️ {h.contact.email}</p>
            <button
              onClick={() => onSelectHall(h)}
              className="mt-4 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
