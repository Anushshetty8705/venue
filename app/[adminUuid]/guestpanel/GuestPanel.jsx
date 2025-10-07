"use client";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";

export default function GuestPanel() {
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [slotType, setSlotType] = useState("slot"); // "slot" | "fullDay"
  const [location, setLocation] = useState("All");
  const [acFilter, setAcFilter] = useState("All"); // "All" | "AC" | "Non-AC"
  const [priceSort, setPriceSort] = useState("lowHigh"); // "lowHigh" | "highLow"
  const [filteredHalls, setFilteredHalls] = useState([]);

  // Fetch all halls
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await fetch("/api/guest"); 
        const result = await res.json();
        if (result.success) {
          setHalls(result.data);
          setFilteredHalls(result.data);
        }
      } catch (err) {
        console.error("Error fetching halls:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHalls();
  }, []);

  // Fetch bookings for selected hall
  const fetchBookings = async (adminUuid) => {
    try {
      const res = await fetch(`/api/bookings/get?adminUuid=${adminUuid}`);
      const data = await res.json();
      if (data.success) {
        setBookings(
          data.data.map((b) => ({
            ...b,
            start: new Date(b.date),
            end: b.endDate ? new Date(b.endDate) : new Date(b.date),
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // Filter halls whenever filters change
  useEffect(() => {
    let filtered = halls.filter((hall) => {
      const price =
        slotType === "slot" ? hall.pricePerSlot : hall.priceFullDay;
      const withinPrice = price >= priceRange[0] && price <= priceRange[1];
      const withinLocation =
        location === "All" || hall.location?.toLowerCase() === location.toLowerCase();
      const withinAC =
        acFilter === "All" ||
        (acFilter === "AC" && hall.ac) ||
        (acFilter === "Non-AC" && !hall.ac);
      return withinPrice && withinLocation && withinAC;
    });

    // Sort by price
    filtered.sort((a, b) => {
      const priceA = slotType === "slot" ? a.pricePerSlot : a.priceFullDay;
      const priceB = slotType === "slot" ? b.pricePerSlot : b.priceFullDay;
      return priceSort === "lowHigh" ? priceA - priceB : priceB - priceA;
    });

    setFilteredHalls(filtered);
  }, [priceRange, slotType, location, acFilter, priceSort, halls]);

  const formatYMD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getTileClassName = (date, view, activeStartDate) => {
    if (view !== "month") return "";
    if (date.getMonth() !== activeStartDate.getMonth()) {
      return "opacity-0 pointer-events-none";
    }

    const tileDate = formatYMD(date);
    const bookingsOnDate = bookings.filter((b) => {
      const start = formatYMD(new Date(b.date));
      const end = b.endDate ? formatYMD(new Date(b.endDate)) : start;
      return tileDate >= start && tileDate <= end;
    });

    if (bookingsOnDate.length === 0) return "bg-green-600 text-white m-1";
    if (bookingsOnDate.some((b) => !b.timeSlot || b.timeSlot === ""))
      return "pointer-events-none text-white m-1";
    if (bookingsOnDate.some((b) => b.timeSlot && b.timeSlot !== ""))
      return "bg-gray-500 text-white m-1";

    return "bg-green-600 text-white m-1";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-indigo-400">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-400 mb-4"></div>
        Loading Halls...
      </div>
    );
  }

  // Unique locations
  const locations = ["All", ...new Set(halls.map((h) => h.location))];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-3xl font-bold text-center text-indigo-400 mb-8">
        🏢 Guest Hall Viewer
      </h1>

      {/* --- FILTER BAR --- */}
      {!selectedHall && (
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap">
            {/* Slot Type */}
            <div className="flex items-center gap-3">
              <label className="font-medium text-indigo-300">Type:</label>
              <select
                value={slotType}
                onChange={(e) => setSlotType(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="slot">Per Slot</option>
                <option value="fullDay">Full Day</option>
              </select>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <label className="font-medium text-indigo-300">Location:</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {locations.map((loc, i) => (
                  <option key={i} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* AC Filter */}
            <div className="flex items-center gap-3">
              <label className="font-medium text-indigo-300">AC:</label>
              <select
                value={acFilter}
                onChange={(e) => setAcFilter(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All</option>
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
              </select>
            </div>

            {/* Price Sort */}
            <div className="flex items-center gap-3">
              <label className="font-medium text-indigo-300">Sort:</label>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="lowHigh">Price: Low → High</option>
                <option value="highLow">Price: High → Low</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="flex flex-col w-full md:w-1/3">
              <label className="font-medium text-indigo-300">
                Price Range (₹{priceRange[0]} – ₹{priceRange[1]})
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-indigo-500"
              />
              <div className="h-2 bg-gray-700 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 via-indigo-500 to-purple-500 transition-all duration-500"
                  style={{
                    width: `${(priceRange[1] / 100000) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- HALL LIST --- */}
      {!selectedHall && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredHalls.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">
              No halls match your filters.
            </p>
          ) : (
            filteredHalls.map((hall, i) => {
              const price =
                slotType === "slot"
                  ? hall.pricePerSlot
                  : hall.priceFullDay || hall.pricePerSlot * 3;
              return (
                <div
                  key={i}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  onClick={() => {
                    setSelectedHall(hall);
                    fetchBookings(hall.adminUuid);
                  }}
                >
                  <img
                    src={hall.images?.[0] || "/default-hall.jpg"}
                    alt="hall"
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="text-lg font-semibold text-indigo-300">
                    {hall.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{hall.location}</p>
                  <p className="text-gray-400 text-sm">
                    👥 {hall.capacity} | ❄️ {hall.ac ? "AC" : "Non-AC"}
                  </p>
                  <p className="text-green-400 text-sm mt-1">
                    💰 ₹{price.toLocaleString()} /{" "}
                    {slotType === "slot" ? "slot" : "day"}
                  </p>
                 <button
  onClick={(e) => {
    e.stopPropagation();
    // Open WhatsApp in new tab/window
    const phoneNumber = hall.phone.replace(/\D/g, ""); // remove any non-numeric characters
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }}
  className="mt-3 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-md transition"
>
  📞 Contact
</button>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* --- SELECTED HALL --- */}
      {selectedHall && (
        <div className="mt-6">
          <button
            onClick={() => setSelectedHall(null)}
            className="mb-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white"
          >
            ← Back to Halls
          </button>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-indigo-300 mb-2">
              {selectedHall.name}
            </h2>
            <p className="text-gray-400">{selectedHall.location}</p>
            <p className="text-gray-400">👥 Capacity: {selectedHall.capacity}</p>
            <p className="text-gray-400">
              ❄️ AC: {selectedHall.ac ? "Available" : "Not Available"}
            </p>
            <p className="text-green-400">
              💰 ₹{selectedHall.pricePerSlot} per slot | ₹
              {selectedHall.priceFullDay} full day
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {selectedHall.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="hall"
                  className="w-28 h-28 object-cover rounded-lg border border-gray-700"
                />
              ))}
            </div>

            <h3 className="text-lg mt-6 mb-2 text-indigo-300">📅 Availability</h3>
            <Calendar
              tileClassName={({ date, view, activeStartDate }) =>
                getTileClassName(date, view, activeStartDate)
              }
              className="text-white text-center rounded-lg calendar-dark"
            />

            <button
              onClick={() => alert("Contact for booking")}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-lg transition"
            >
              📞 Contact & Book Now
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .offline-date {
          background-color: #f87171 !important;
          color: white !important;
          border-radius: 50%;
        }
        .online-date {
          background-color: #fbbf24 !important;
          color: white !important;
          border-radius: 50%;
        }
        .available-date {
          background-color: #34d399 !important;
          color: white !important;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
