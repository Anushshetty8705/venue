"use client";
import React, { useState } from "react";

export default function BookingForm({ hall, filters, onClose }) {
  const [details, setDetails] = useState({
    type: filters.type,
    slot: filters.slot || "",
    date: filters.date || "",
    from: filters.from || "",
    to: filters.to || "",
    name: "",
    phone: ""
  });

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

  const handleBookingSubmit = () => {
    const { type, slot, date, from, to, name, phone } = details;
    if (!name || !phone || (type === "slot" && (!slot || !date)) || (type === "day" && (!from || !to))) {
      return alert("⚠️ Fill all required fields");
    }

    const dates = type === "slot" ? [date] : getDatesBetween(from, to);
    const totalPrice = type === "slot" ? hall.pricing[slot] : hall.pricing["full-day"] * dates.length;

    alert(`✅ Booked ${hall.name}\n📅 Dates: ${dates.join(", ")}\n💰 Total: ₹${totalPrice}\n👤 ${name}\n📞 ${phone}`);
    onClose();
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl max-w-xl mx-auto">
      <h3 className="text-2xl font-bold text-sky-200 mb-4">Booking: {hall.name}</h3>

      {details.type === "slot" ? (
        <>
          <label className="text-white mb-2">Select Date:</label>
          <input
            type="date"
            value={details.date}
            onChange={e => setDetails({ ...details, date: e.target.value })}
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20 mb-4"
          />
          <label className="text-white mb-2">Select Slot:</label>
          <select
            value={details.slot}
            onChange={e => setDetails({ ...details, slot: e.target.value })}
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20 mb-4"
          >
            <option value="">Select slot</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="full-day">Full Day</option>
          </select>
        </>
      ) : (
        <>
          <label className="text-white mb-2">From Date:</label>
          <input
            type="date"
            value={details.from}
            onChange={e => setDetails({ ...details, from: e.target.value })}
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20 mb-4"
          />
          <label className="text-white mb-2">To Date:</label>
          <input
            type="date"
            value={details.to}
            onChange={e => setDetails({ ...details, to: e.target.value })}
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20 mb-4"
          />
        </>
      )}

      <label className="text-white mb-2">Your Name:</label>
      <input
        type="text"
        placeholder="John Doe"
        value={details.name}
        onChange={e => setDetails({ ...details, name: e.target.value })}
        className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20 mb-4"
      />
      <label className="text-white mb-2">Phone:</label>
      <input
        type="tel"
        placeholder="9876543210"
        value={details.phone}
        onChange={e => setDetails({ ...details, phone: e.target.value })}
        className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20 mb-4"
      />

      <div className="flex justify-between mt-6">
        <button onClick={onClose} className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition">Back</button>
        <button onClick={handleBookingSubmit} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition">Confirm Booking</button>
      </div>
    </div>
  );
}
