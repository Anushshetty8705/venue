"use client";
import React, { useState, useEffect } from "react";
import { bookings, halls } from "./bookings";
import BookingForm from "../BookingForm";

export default function GuestPanel() {
  const [filters, setFilters] = useState({
    location: "",
    capacityRange: "",
    priceRange: "",
    type: "slot", // "slot" or "multi"
    date: "",
    from: "",
    to: "",
    slot: "",
  });

  const [filteredHalls, setFilteredHalls] = useState(halls);
  const [selectedHall, setSelectedHall] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ name: "", phone: "" });

  useEffect(() => {
    let temp = halls;
    if (filters.location) temp = temp.filter(h => h.location === filters.location);
    if (filters.capacityRange) {
      const [minC, maxC] = filters.capacityRange.split("-").map(Number);
      temp = temp.filter(h => h.capacity >= minC && h.capacity <= maxC);
    }
    if (filters.priceRange) {
      const [minP, maxP] = filters.priceRange.split("-").map(Number);
      temp = temp.filter(h => h.pricePerHour >= minP && h.pricePerHour <= maxP);
    }
    setFilteredHalls(temp);
  }, [filters]);

  const isAvailable = () => {
    if (filters.type === "slot") {
      return !bookings.some(b =>
        b.hallId === selectedHall.id &&
        (b.type === "multi" || (b.date === filters.date && b.slot === filters.slot))
      );
    } else {
      const fromDate = new Date(filters.from);
      const toDate = new Date(filters.to);
      for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];
        if (bookings.some(b => b.hallId === selectedHall.id &&
          ((b.type === "slot" && b.date === dateStr) ||
           (b.type === "multi" && new Date(b.from) <= d && new Date(b.to) >= d))
        )) return false;
      }
      return true;
    }
  };

  const handleBookingSubmit = () => {
    if (!bookingDetails.name || !bookingDetails.phone || (filters.type === "slot" && (!filters.date || !filters.slot))) {
      alert("Fill all fields!");
      return;
    }
    if (!isAvailable()) {
      alert("Selected slot/day is already booked!");
      return;
    }

    bookings.push({
      hallId: selectedHall.id,
      hallName: selectedHall.name,
      type: filters.type,
      date: filters.date,
      slot: filters.slot,
      from: filters.from,
      to: filters.to,
      name: bookingDetails.name,
      phone: bookingDetails.phone,
      status: "online",
      owner: "guest"
    });

    alert("Booking successful!");
    setSelectedHall(null);
    setBookingDetails({ name: "", phone: "" });
    setFilters({ ...filters, date: "", slot: "", from: "", to: "" });
  };

  return (
    <div>
      {!selectedHall && (
        <div className="mb-6">
          <div className="flex gap-3 flex-wrap">
            <select value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} className="p-2 border rounded">
              <option value="">All Locations</option>
              {halls.map(h => <option key={h.id} value={h.location}>{h.location}</option>)}
            </select>

            <select value={filters.capacityRange} onChange={e => setFilters({ ...filters, capacityRange: e.target.value })} className="p-2 border rounded">
              <option value="">Capacity</option>
              <option value="100-200">100-200</option>
              <option value="201-300">201-300</option>
              <option value="301-500">301-500</option>
            </select>

            <select value={filters.priceRange} onChange={e => setFilters({ ...filters, priceRange: e.target.value })} className="p-2 border rounded">
              <option value="">Price/hr</option>
              <option value="1000-2000">1000-2000</option>
              <option value="2001-3500">2001-3500</option>
            </select>

            <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })} className="p-2 border rounded">
              <option value="slot">Single Day / Slot</option>
              <option value="multi">Multiple Days</option>
            </select>
          </div>

          <div className="mt-3 flex gap-3 flex-wrap">
            {filters.type === "slot" ? (
              <>
                <input type="date" value={filters.date} onChange={e => setFilters({ ...filters, date: e.target.value })} className="p-2 border rounded" />
                <select value={filters.slot} onChange={e => setFilters({ ...filters, slot: e.target.value })} className="p-2 border rounded">
                  <option value="">Select Slot</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="full-day">Full Day</option>
                </select>
              </>
            ) : (
              <>
                <input type="date" value={filters.from} onChange={e => setFilters({ ...filters, from: e.target.value })} className="p-2 border rounded" />
                <input type="date" value={filters.to} onChange={e => setFilters({ ...filters, to: e.target.value })} className="p-2 border rounded" />
              </>
            )}
          </div>
        </div>
      )}

      {!selectedHall ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHalls.map(hall => (
            <div key={hall.id} className="border p-4 rounded">
              <h3 className="font-bold">{hall.name}</h3>
              <p>{hall.location}</p>
              <p>Capacity: {hall.capacity}</p>
              <p>₹{hall.pricePerHour} / hr</p>
              <p>{hall.ac ? "AC" : "Non-AC"}</p>
              <button onClick={() => setSelectedHall(hall)} className="mt-2 p-2 bg-blue-600 text-white rounded">Book Now</button>
            </div>
          ))}
        </div>
      ) : (
        <BookingForm hall={selectedHall} filters={filters} onClose={() => setSelectedHall(null)} />
      )}
    </div>
  );
}
