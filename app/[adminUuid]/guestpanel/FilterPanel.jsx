"use client";
import React from "react";

export default function FilterPanel({ filters, setFilters }) {
  const locationOptions = ["Downtown", "Uptown", "Suburb", "Riverside"];
  const capacityOptions = [
    { label: "All", value: "" },
    { label: "100-200", value: "100-200" },
    { label: "200-300", value: "200-300" },
    { label: "300-500", value: "300-500" },
  ];
  const priceOptions = [
    { label: "All", value: "" },
    { label: "₹1000 - ₹5000", value: "1000-5000" },
    { label: "₹5000 - ₹10000", value: "5000-10000" },
    { label: "₹10000 - ₹20000", value: "10000-20000" },
    { label: "₹20000+", value: "20000-999999" },
  ];

  return (
    <div className="mb-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white/5 border border-white/10 rounded-xl p-4 shadow">
        {/* Booking Type */}
        <select
          className="px-4 py-2 rounded bg-white/10 text-white border border-white/20"
          value={filters.type}
          onChange={e =>
            setFilters({ ...filters, type: e.target.value, slot: "", date: "", from: "", to: "" })
          }
        >
          <option value="slot">Single Day</option>
          <option value="day">Multiple Days</option>
        </select>

        {/* Location */}
        <select
          value={filters.location}
          onChange={e => setFilters({ ...filters, location: e.target.value })}
          className="px-4 py-2 rounded bg-white/10 text-white border border-white/20"
        >
          <option value="">All Locations</option>
          {locationOptions.map(loc => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Capacity Range */}
        <select
          value={filters.capacityRange}
          onChange={e => setFilters({ ...filters, capacityRange: e.target.value })}
          className="px-4 py-2 rounded bg-white/10 text-white border border-white/20"
        >
          {capacityOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <select
          value={filters.priceRange}
          onChange={e => setFilters({ ...filters, priceRange: e.target.value })}
          className="px-4 py-2 rounded bg-white/10 text-white border border-white/20"
        >
          {priceOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Conditional Inputs */}
        {filters.type === "slot" ? (
          <>
            <input
              type="date"
              value={filters.date}
              onChange={e => setFilters({ ...filters, date: e.target.value })}
              className="px-4 py-2 rounded bg-white/10 text-white border border-white/20"
            />
            <select
              value={filters.slot}
              onChange={e => setFilters({ ...filters, slot: e.target.value })}
              className="px-4 py-2 rounded bg-white/10 text-white border border-white/20"
            >
              <option value="">All Slots</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="full-day">Full Day</option>
            </select>
          </>
        ) : (
          <>
            <input
              type="date"
              value={filters.from}
              onChange={e => setFilters({ ...filters, from: e.target.value })}
              className="px-4 py-2 rounded bg-white/10 text-white border border-white/20"
            />
            <input
              type="date"
              value={filters.to}
              onChange={e => setFilters({ ...filters, to: e.target.value })}
              className="px-4 py-2 rounded bg-white/10 text-white border border-white/20"
            />
          </>
        )}
      </div>
    </div>
  );
}
