"use client";

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";

export default function AdminOfflineBookings({ adminUuid }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [bookingType, setBookingType] = useState("single");
  const [newBooking, setNewBooking] = useState({
    name: "",
    date: "",
    endDate: "",
    timeSlot: "",
    amount: "",
    description: "",
  });

  const slots = ["09:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-21:00"];

  const handleDateClick = (date) => {
    const formattedDate = formatDate(date);
    setNewBooking({
      ...newBooking,
      date: formattedDate,
      timeSlot: "", // reset
      endDate: "", // reset for single day
    });
    setBookingType("single");
    setShowForm(true);
  };

  // Fetch offline bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/bookings/get?adminUuid=${adminUuid}`);
        const result = await res.json();
        if (result.success) setBookings(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (adminUuid) fetchBookings();
  }, [adminUuid]);

  // Determine calendar tile classes based on booking status
  // Convert JS Date to YYYY-MM-DD without timezone shift
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper: convert JS Date to YYYY-MM-DD string
  const formatYMD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

const getTileClassName = (date, view, activeStartDate) => {
  if (view !== "month") return "";

  // Hide neighboring month tiles completely
  if (date.getMonth() !== activeStartDate.getMonth()) {
    return "opacity-0 pointer-events-none ";
  }

  const tileDate = formatYMD(date);
  const bookingsOnDate = bookings.filter((b) => {
    const start = formatYMD(new Date(b.date));
    const end = b.endDate ? formatYMD(new Date(b.endDate)) : start;
    return tileDate >= start && tileDate <= end;
  });

  if (bookingsOnDate.length === 0) return "bg-green-600 text-white m-1";
  if (bookingsOnDate.some((b) => !b.timeSlot || b.timeSlot === "")) return "pointer-events-none text-white m-1";
  if (bookingsOnDate.some((b) => b.timeSlot && b.timeSlot !== "")) return "bg-gray-500 text-white m-1";

  return "bg-green-600 text-white m-1";
};



  // Add booking
  const addBooking = async () => {
    const { name, date, amount } = newBooking;
    if (
      !name ||
      !date ||
      (bookingType === "single" && !newBooking.timeSlot) ||
      !amount
    )
      return alert("⚠️ Fill all required fields");

    try {
      const res = await fetch("/api/bookings/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newBooking,
          bookingType,
          adminUuid,
          offline: "offline",
        }),
      });
      const result = await res.json();
      if (result.success) {
        setBookings(result.data);
        setShowForm(false);
        setNewBooking({
          name: "",
          date: "",
          endDate: "",
          timeSlot: "",
          amount: "",
          description: "",
        });
        toast.success("✅ Booking added!");
      } else toast.error(result.error || "❌ Error adding booking");
    } catch (err) {
      console.error(err);
      toast.error("❌ Server error");
    }
  };

  // Delete booking
  const deleteBooking = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      toast.loading("Deleting...");
      const res = await fetch(
        `/api/bookings/delete?adminUuid=${adminUuid}&id=${id}`,
        { method: "DELETE" }
      );
      const result = await res.json();
      toast.dismiss();
      if (result.success) {
        setBookings(bookings.filter((b) => b._id !== id));
        toast.success("✅ Booking deleted!");
      } else toast.error(result.error || "❌ Failed to delete booking");
    } catch (err) {
      console.error(err);
      toast.error("❌ Server error while deleting booking");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <h2 className="text-xl font-bold text-indigo-400 mb-6">
        🧾 Bookings
      </h2>

      {/* Add Booking Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
        >
          {showForm ? "Cancel" : "➕ Add Booking"}
        </button>
      </div>

      {/* Booking Form */}
      {showForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Add Booking
          </h2>

          {/* Booking Type */}
          <div className="mb-4">
            <label className="mr-4">
              <input
                type="radio"
                name="bookingType"
                value="single"
                checked={bookingType === "single"}
                onChange={() => {
                  setBookingType("single");
                  setNewBooking({
                    ...newBooking,
                    date: "",
                    endDate: "",
                    timeSlot: "",
                  });
                }}
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
                onChange={() => {
                  setBookingType("multi");
                  setNewBooking({
                    ...newBooking,
                    date: "",
                    endDate: "",
                    timeSlot: "",
                  });
                }}
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

      {/* Calendar */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <Calendar
       showNeighboringMonth={true}
          onClickDay={handleDateClick}
            tileClassName={({ date, view, activeStartDate }) =>
    getTileClassName(date, view, activeStartDate)
  }
          className="text-white text-center rounded-lg calendar-dark"
          locale="en-US"
        />
      </div>

      {/* Booking List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 h-[70vh] overflow-y-auto p-2 scroll-bar-hide ">
        {bookings.length === 0 ? (
          <p className="text-center text-gray-400">
            No offline bookings found.
          </p>
        ) : (
          bookings.map((b, i) => (
            <div
              key={i}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-4 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 flex flex-col justify-between h-[30vh]"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {b?.date ? new Date(b.date).toLocaleDateString() : "—"}
                  {b?.endDate
                    ? ` - ${new Date(b.endDate).toLocaleDateString()}`
                    : ""}
                </span>
              </div>
              {b?.timeSlot && (
                <p className="text-sm text-gray-300 mb-1">
                  🕒 <span className="text-gray-100">{b.timeSlot}</span>
                </p>
              )}
              <p className="text-base font-medium text-green-400 mb-1">
                💰 ₹{b?.amount || 0}
              </p>
              {b?.description && (
                <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                  {b.description}
                </p>
              )}
              <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-700">
                <span className="text-xs text-indigo-400 font-medium uppercase">
                  Offline
                </span>
                <button
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg text-white transition-all"
                  onClick={() => deleteBooking(b?._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
