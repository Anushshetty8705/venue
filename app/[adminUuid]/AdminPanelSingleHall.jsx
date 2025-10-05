"use client";
import React, { useState, useEffect } from "react";
import AdminOfflineBookings from "./AdminOfflineBookings";
export default function AdminDashboard({ adminUuid }) {
  const [hall, setHall] = useState(null);
  const [editMode, setEditMode] = useState(false); // show form only when editing/creating
  const [error, setError] = useState(""); // show validation errors
  const [newHall, setNewHall] = useState({
    name: "",
    location: "",
    capacity: "",
    ac: false,
    pricePerSlot: "",
    priceFullDay: "",
    email: "",
    phone: "",
    images: [],
  });

  // Fetch hall info
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch(`/api/halls/entry?adminUuid=${adminUuid}`);
        const result = await res.json();

        if (result.success && result.data) {
          setHall(result.data);
        }
      } catch (err) {
        alert("Server error while loading entries");
      }
    };

    if (adminUuid) fetchEntries();
  }, [adminUuid]);

  // Upload images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
          })
      )
    ).then((base64Images) => {
      setNewHall((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Images],
      }));
    });
  };

  const deleteImage = (index) => {
    setNewHall((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Validate all fields before saving
  const validateHall = () => {
    if (
      !newHall.name ||
      !newHall.location ||
      !newHall.capacity ||
      !newHall.pricePerSlot ||
      !newHall.priceFullDay ||
      !newHall.email ||
      !newHall.phone
    ) {
      setError("⚠️ Please fill all the fields before submitting.");
      return false;
    }
    if (newHall.images.length === 0) {
      setError("⚠️ Please upload at least one image.");
      return false;
    }
    setError("");
    return true;
  };

  // Save or update hall
  const saveHall = async () => {
    if (!validateHall()) return;

    try {
      const isUpdate = !!hall;
      const url = isUpdate ? "/api/halls/update" : "/api/halls/add";
      const method = isUpdate ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newHall, adminUuid }),
      });

      const result = await response.json();

      if (result.success) {
        setHall(result.data);
        setEditMode(false);
        alert(isUpdate ? "✅ Hall updated!" : "✅ Hall created!");
      } else {
        alert(result.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">
        🏢 Admin Hall Management
      </h1>

      {/* Existing Hall Display */}
      {hall && !editMode && (
        <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-indigo-300">{hall.name}</h3>
          <p>📍 {hall.location}</p>
          <p>👥 Capacity: {hall.capacity}</p>
          <p>💰 Slot Price: ₹{hall.pricePerSlot}</p>
          <p>💰 Full Day: ₹{hall.priceFullDay}</p>
          <p>📞 {hall.phone}</p>
          <p>📧 {hall.email}</p>
          <p>❄️ AC Available: {hall.ac ? "Yes" : "No"}</p>

          <div className="flex gap-3 flex-wrap mt-3">
            {hall.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="hall"
                className="w-32 h-32 object-cover rounded border border-gray-600"
              />
            ))}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => {
                setEditMode(true);
                setNewHall(hall);
              }}
              className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
            >
              ✏️ Edit Hall
            </button>
          </div>
        </div>
      )}
      <AdminOfflineBookings adminUuid={adminUuid} />

      {/* Create Button */}
      {!hall && !editMode && (
        <div className="text-center mt-10">
          <button
            onClick={() => {
              setNewHall({
                name: "",
                location: "",
                capacity: "",
                ac: false,
                pricePerSlot: "",
                priceFullDay: "",
                email: "",
                phone: "",
                images: [],
              });
              setEditMode(true);
            }}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
          >
            ➕ Create Hall
          </button>
        </div>
      )}

      {/* Create/Edit Form */}
      {editMode && (
        <div className="border border-gray-700 p-6 rounded-lg shadow-lg bg-gray-800 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            {hall ? "✏️ Edit Hall" : "➕ Create Hall"}
          </h2>

          {error && (
            <p className="text-red-500 bg-red-100/10 p-2 rounded mb-4 text-sm">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            {[
              "name",
              "location",
              "capacity",
              "pricePerSlot",
              "priceFullDay",
              "email",
              "phone",
            ].map((field) => (
              <input
                key={field}
                type={
                  field === "capacity" || field.includes("price")
                    ? "number"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newHall[field] || ""}
                onChange={(e) =>
                  setNewHall({ ...newHall, [field]: e.target.value })
                }
                className="p-2 border rounded bg-gray-700 text-gray-100 no-scroll-number"
              />
            ))}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newHall.ac}
                onChange={(e) =>
                  setNewHall({ ...newHall, ac: e.target.checked })
                }
              />
              AC Available
            </label>

            {/* Custom Upload Button */}
            <div className="col-span-2">
              <input
                id="imageUpload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() =>
                  document.getElementById("imageUpload").click()
                }
                className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded w-full"
              >
                📸 Upload Images
              </button>
            </div>

            {newHall.images.length > 0 && (
              <div className="col-span-2 flex gap-3 flex-wrap mt-2">
                {newHall.images.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      alt="preview"
                      className="w-24 h-24 object-cover rounded border border-gray-600"
                    />
                    <button
                      onClick={() => deleteImage(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4 gap-3">
            <button
              onClick={() => setEditMode(false)}
              className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
            >
              Cancel
            </button>
            <button
              onClick={saveHall}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
            >
              {hall ? "Update Hall" : "Create Hall"}
            </button>
          </div>
        </div>
      )}

      {/* Custom style for number input scrollbar */}
      <style jsx>{`
        /* Remove number input arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
