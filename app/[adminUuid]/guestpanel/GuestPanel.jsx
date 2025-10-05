"use client";
import React, { useState } from "react";
import { halls, bookings } from "./bookings";
import BookingForm from "../../dashboard/BookingForm";

export default function GuestPanel() {
  const hall = halls[0];

  if (!hall) return <p>No hall available.</p>; // <-- Guard

  const [filters, setFilters] = useState({
    type: "slot",
    date: "",
    slot: "",
    from: "",
    to: ""
  });

  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleBookingSubmit = (details) => {
    const { type, date, slot, from, to, name, phone } = details;

    bookings.push({
      hallId: hall.id,
      hallName: hall.name,
      type,
      date: type === "slot" ? date : null,
      slot: type === "slot" ? slot : null,
      from: type === "multi" ? from : null,
      to: type === "multi" ? to : null,
      name,
      phone,
      status: "online",
      owner: "guest"
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Book Hall</h2>

      {!showBookingForm ? (
        <div className="border p-4 rounded mb-4 max-w-md">
          <h3 className="font-semibold mb-2">{hall.name}</h3>
          <p>{hall.location}</p>
          <p>Capacity: {hall.capacity}</p>
          <p>{hall.ac ? "AC" : "Non-AC"}</p>
          <p>Price per slot: ₹{hall.pricePerSlot}, Full day: ₹{hall.priceFullDay}</p>

          <div className="mt-4">
            <label className="mr-2">Booking Type:</label>
            <select
              value={filters.type}
              onChange={e => setFilters({ ...filters, type: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="slot">Slot Booking</option>
              <option value="multi">Full Day / Multi-day</option>
            </select>
          </div>

          <button
            onClick={() => setShowBookingForm(true)}
            className="mt-4 p-2 bg-blue-600 text-white rounded"
          >
            Book Now
          </button>
        </div>
      ) : (
        <BookingForm
          hall={hall}
          filters={filters}
          onClose={() => setShowBookingForm(false)}
          bookings={bookings}
          onBookingSubmit={handleBookingSubmit}
        />
      )}

      <h3 className="text-xl font-semibold mt-6 mb-2">All Bookings</h3>
      {bookings.map((b, i) => (
        <div key={i} className="border p-2 rounded mb-1 max-w-md">
          <p>
            {b.type === "slot"
              ? `${b.date} ${b.slot}`
              : `${b.from} to ${b.to}`}{" "}
            - {b.status === "offline" ? "(Offline)" : "(Guest)"} Name: {b.name} Phone: {b.phone}
          </p>
        </div>
      ))}
    </div>
  );
}
