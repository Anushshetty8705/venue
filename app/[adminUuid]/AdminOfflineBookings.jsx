"use client";

import React, { useState, useEffect } from "react";

export default function AdminOfflineBookings({ adminUuid }) {
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [bookingType, setBookingType] = useState("single"); // single | multi
  const [newBooking, setNewBooking] = useState({
    name: "",
    date: "",
    endDate: "",
    timeSlot: "",
    amount: "",
    description: "",
  });

  const slots = ["09:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-21:00"];

  // Fetch offline bookings
  useEffect(() => {
    const fetchOfflineBookings = async () => {
      try {
        const res = await fetch(`/api/bookings/get?adminUuid=${adminUuid}`);
        const result = await res.json();
        if (result.success) {console.log("good", result.data); setBookings(result.data) }
      } catch (err) {
        console.error("Error loading offline bookings", err);
      }
    };
    if (adminUuid) fetchOfflineBookings();
  }, [adminUuid]);



  const addBooking = async () => {
    const { name, date, amount } = newBooking;
    if (!name || !date || (bookingType === "single" && !newBooking.timeSlot) || !amount)
      return alert("⚠️ Please fill all required fields");

    try {
      const res = await fetch("/api/bookings/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newBooking, bookingType, adminUuid ,offline:" offline"}),
      });
      const result = await res.json();

      if (result.success) {
        setBookings([...bookings, result.data]);
        setShowForm(false);
        setBookingType("single");
        setNewBooking({
          name: "",
          date: "",
          endDate: "",
          timeSlot: "",
          amount: "",
          description: "",
        });
        alert("✅ Offline booking added!");
      } else {
        alert(result.error || "Error adding booking");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-3xl font-bold text-center text-indigo-400 mb-6">
        🧾 Offline Bookings
      </h1>

      {/* Add New Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
        >
          {showForm ? "Cancel" : "➕ Add Offline Booking"}
        </button>
      </div>

      {/* Booking Form */}
      {showForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Add Offline Booking
          </h2>

          {/* Booking Type */}
          <div className="mb-4">
            <label className="mr-4">
              <input
                type="radio"
                name="bookingType"
                value="single"
                checked={bookingType === "single"}
                onChange={() => setBookingType("single")}
                className="mr-1"
              />
              Single Day
            </label>
            <label>
              <input
                type="radio"
                name="bookingType"
                value="multi"
                checked={bookingType === "multi"}
                onChange={() => setBookingType("multi")}
                className="mr-1"
              />
              Multi Day
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newBooking.name}
              onChange={(e) =>
                setNewBooking({ ...newBooking, name: e.target.value })
              }
              className="p-2 border rounded bg-gray-700 text-gray-100"
            />

            {bookingType === "single" && (
              <>
                <input
                  type="date"
                  value={newBooking.date}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, date: e.target.value })
                  }
                  className="p-2 border rounded bg-gray-700 text-gray-100"
                />
                <select
                  value={newBooking.timeSlot}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, timeSlot: e.target.value })
                  }
                  className="p-2 border rounded bg-gray-700 text-gray-100"
                >
                  <option value="">Select Time Slot</option>
                  {slots.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </>
            )}

            {bookingType === "multi" && (
              <>
                <input
                  type="date"
                  value={newBooking.date}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, date: e.target.value })
                  }
                  className="p-2 border rounded bg-gray-700 text-gray-100"
                />
                <input
                  type="date"
                  value={newBooking.endDate}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, endDate: e.target.value })
                  }
                  className="p-2 border rounded bg-gray-700 text-gray-100"
                />
              </>
            )}

            <input
              type="number"
              placeholder="Amount"
              value={newBooking.amount}
              onChange={(e) =>
                setNewBooking({ ...newBooking, amount: e.target.value })
              }
              className="p-2 border rounded bg-gray-700 text-gray-100"
            />

            <textarea
              placeholder="Description (optional)"
              value={newBooking.description}
              onChange={(e) =>
                setNewBooking({ ...newBooking, description: e.target.value })
              }
              className="col-span-2 p-2 border rounded bg-gray-700 text-gray-100"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={addBooking}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              Save Booking
            </button>
          </div>
        </div>
      )}

      {/* Booking List */}
      <div className="grid gap-4">
        {bookings.length === 0 ? (
          <p className="text-center text-gray-400">No offline bookings found.</p>
        ) : (
          bookings.map((b, i) => (
            <div
              key={i}
              className="p-4 bg-gray-800 rounded border border-gray-700"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-indigo-300">
                  {b.name}
                </h3>
                <span className="text-sm text-gray-400">
                  {new Date(b.date).toLocaleDateString()}{" "}
                  {b.endDate && `- ${new Date(b.endDate).toLocaleDateString()}`}
                </span>
              </div>
              {b.timeSlot && <p>🕒 {b.timeSlot}</p>}
              <p>💰 ₹{b.amount}</p>
              {b.description && (
                <p className="text-gray-400 mt-1">{b.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
