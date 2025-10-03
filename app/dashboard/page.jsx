"use client";
import React, { useState, useRef } from "react";
import AdminPanelSingleHall from "./AdminPanelSingleHall"; // Single hall admin panel
import GuestPanel from "./guestpanel/GuestPanel";
import EditProfile from "./EditProfile"; 
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const search = useSearchParams();
  const action = search.get("action") || "";
  const hallId = search.get("hallId") || "";

  const [mode, setMode] = useState(""); // admin or guest
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    username: "JohnDoe",
    email: "john@example.com",
    image: "/profile-pic.jpg",
  });

  const profileRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Shared single hall & bookings
  const [hall, setHall] = useState({
    name: "Royal Orchid Banquet",
    location: "Downtown",
    capacity: 300,
    ac: true,
    pricePerSlot: 2000,
    priceFullDay: 5000,
    image: null,
  });

  const [bookings, setBookings] = useState([]);

  // Profile handlers
  const onLogout = () => { setMode(""); alert("Logged out"); };
  const onSwitch = () => { setMode(mode === "admin" ? "guest" : "admin"); };

  const handleProfileSave = (formData) => {
    const updatedProfile = {
      username: formData.get("username"),
      email: formData.get("email"),
      image: formData.get("image") ? URL.createObjectURL(formData.get("image")) : profile.image,
    };
    setProfile(updatedProfile);
    setShowEditProfile(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="sticky top-6 z-50 max-w-6xl mx-auto px-6">
        <div className="backdrop-blur-md bg-gradient-to-r from-purple-800/70 via-indigo-800/60 to-indigo-900/50 border border-white/6 rounded-full px-4 py-2 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-black font-bold">VV</div>
            <div>
              <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-white to-rose-400">Venue Vista</div>
              <div className="text-sm text-amber-200">Banquet hall & bookings</div>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center gap-3">
            {mode ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(prev => !prev)}
                  className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full hover:bg-white/20"
                >
                  <img src={profile.image} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                  <span className="text-sm">My Profile</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded shadow-lg overflow-hidden">
                    <button
                      onClick={() => { setShowEditProfile(true); setProfileOpen(false); }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    >Edit Profile</button>

                    <button
                      onClick={() => { if(confirm("Are you sure you want to delete your profile?")) { alert("Profile deleted!"); onLogout(); setProfileOpen(false); } }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    >Delete Profile</button>

                    <button
                      onClick={() => { onSwitch(); setProfileOpen(false); }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    >Switch to Admin</button>

                    <button
                      onClick={() => { onLogout(); setProfileOpen(false); }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    >Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-white/70">Choose a role to continue</div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        {/* Role chooser */}
        {!mode && (
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-neutral-900/40 to-neutral-800/30 border border-amber-500/20 rounded-2xl p-6 shadow-2xl backdrop-blur-md hover:scale-105 transform transition">
                <h4 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-rose-400">Admin</h4>
                <p className="text-sm text-amber-200 mt-2">Manage hall, bookings and settings.</p>
                <div className="mt-4">
                  <button
                    onClick={() => setMode("admin")}
                    className="px-4 py-2 rounded bg-amber-400 text-black font-semibold shadow"
                  >Enter Admin</button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-sky-900/40 to-indigo-900/30 border border-sky-500/10 rounded-2xl p-6 shadow-2xl backdrop-blur-md hover:scale-105 transform transition">
                <h4 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-400">Guest</h4>
                <p className="text-sm text-sky-200 mt-2">Browse hall and make bookings.</p>
                <div className="mt-4">
                  <button
                    onClick={() => setMode("guest")}
                    className="px-4 py-2 rounded bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold shadow"
                  >Enter as Guest</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile */}
        {showEditProfile && (
          <EditProfile initialProfile={profile} onSave={handleProfileSave} />
        )}

        {/* Panels */}
        {!showEditProfile && mode === "admin" && (
          <AdminPanelSingleHall
            hall={hall}
            setHall={setHall}
            bookings={bookings}
            setBookings={setBookings}
          />
        )}

        {!showEditProfile && mode === "guest" && (
          <GuestPanel
            hall={hall}
            bookings={bookings}
            setBookings={setBookings}
          />
        )}
      </main>
    </div>
  );
}
