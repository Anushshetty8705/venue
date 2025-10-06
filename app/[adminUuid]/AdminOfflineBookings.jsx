"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AdminOfflineBookings({ adminUuid }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state
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
  const deleteBooking = async (bookingId) => {
  if (!confirm("Are you sure you want to delete this booking?")) return;
  // console.log("Deleting booking with id:", bookingId);
  try {
    toast.loading("deletng....")
    const res = await fetch(
      `/api/bookings/delete?adminUuid=${adminUuid}&id=${bookingId}`,
      { method: "DELETE" }
    );
    const result = await res.json();

    if (result.success) {
      // Remove booking from state to refresh UI
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      toast.dismiss()
    toast.success("✅ Booking deleted successfully!");
    } else {
      toast.error(result.error || "❌ Failed to delete booking");
    }
  } catch (err) {
    console.error(err);
    toast.error("❌ Server error while deleting booking");
  }
};


  const slots = ["09:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-21:00"];

  // ✅ Fetch offline bookings
  useEffect(() => {
    const fetchOfflineBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/bookings/get?adminUuid=${adminUuid}`);
        const result = await res.json();

        if (result.success) {
       
          setBookings(result.data);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error("Error loading offline bookings", err);
      } finally {
        setLoading(false);
      }
    };

    if (adminUuid) fetchOfflineBookings();
  }, [adminUuid]);

  // ✅ Add booking
  const addBooking = async () => {
    const { name, date, amount } = newBooking;
    if (!name || !date || (bookingType === "single" && !newBooking.timeSlot) || !amount)
      return alert("⚠️ Please fill all required fields");

    try {
      const res = await fetch("/api/bookings/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newBooking, bookingType, adminUuid, offline: "offline" }),
      });
      const result = await res.json();
      toast.loading("Addng....")
      if (result.success) {
      
          setBookings(result.data);
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
          toast.dismiss()
        toast.success("✅ Offline booking added!")
      
      } else {
        toast.error(result.error || "Error adding booking");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Server error");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <h2 className="text-xl font-bold text-start text-indigo-400 mb-6">
        🧾 Offline Bookings
      </h2>

      {/* ✅ Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-400"></div>
          <p className="mt-3 text-indigo-400">Loading offline bookings...</p>
        </div>
      ) : (
        <>
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
              <p className="text-center text-gray-400">
                No offline bookings found.
              </p>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[60vh] overflow-y-auto p-2 scroll-bar-hide">
  {bookings.map((b, i) => (
  <div
    key={i}
    className="bg-gray-800 border border-gray-700 rounded-2xl p-4 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 flex flex-col justify-between h-[30vh]"
  >
    {/* Header */}
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs text-gray-400 whitespace-nowrap">
        {b?.date ? new Date(b.date).toLocaleDateString() : "—"}
        {b?.endDate ? ` - ${new Date(b.endDate).toLocaleDateString()}` : ""}
      </span>
    </div>

    {/* Time Slot */}
    {b?.timeSlot && (
      <p className="text-sm text-gray-300 mb-1">
        🕒 <span className="text-gray-100">{b.timeSlot}</span>
      </p>
    )}

    {/* Amount */}
    <p className="text-base font-medium text-green-400 mb-1">
      💰 ₹{b?.amount || 0}
    </p>

    {/* Description */}
    {b?.description && (
      <p className="text-sm text-gray-400 line-clamp-2 mb-2">
        {b.description}
      </p>
    )}

    {/* Footer */}
    <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-700">
      <span className="text-xs text-indigo-400 font-medium uppercase">Offline</span>
      <button
        className="text-xs bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg text-white transition-all"
        onClick={() => deleteBooking(b?._id)}
      >
        Delete
      </button>
    </div>
  </div>
))}

</div>


            )}
          </div>
        </>
      )}
    </div>
  );
}
