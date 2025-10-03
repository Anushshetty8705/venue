"use client";
import React, { useState, useRef } from "react";

export default function EditProfile({ initialProfile, onSave }) {
  const [profile, setProfile] = useState({
    username: initialProfile.username || "",
    email: initialProfile.email || "",
    password: "",
    confirmPassword: "",
    image: initialProfile.image || "",
  });

  const [previewImage, setPreviewImage] = useState(profile.image);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    setProfile({ ...profile, image: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    if (!profile.username || !profile.email) {
      return alert("⚠️ Username and Email are required.");
    }

    if (profile.password && profile.password !== profile.confirmPassword) {
      return alert("⚠️ Passwords do not match.");
    }

    // Create FormData if you plan to upload image
    const formData = new FormData();
    formData.append("username", profile.username);
    formData.append("email", profile.email);
    if (profile.password) formData.append("password", profile.password);
    if (profile.image && profile.image instanceof File) formData.append("image", profile.image);

    // Call onSave callback or API
    if (onSave) onSave(formData);

    alert("✅ Profile updated successfully!");
  };

  return (
    <div className="max-w-md mx-auto bg-white/5 p-6 rounded-xl shadow-xl mt-6">
      <h2 className="text-2xl font-bold text-sky-200 mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          {previewImage ? (
            <img src={previewImage} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-2" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/10 mb-2 flex items-center justify-center text-white">No Image</div>
          )}
          <button
            type="button"
            className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
            onClick={() => fileInputRef.current.click()}
          >
            Change Image
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
        </div>

        {/* Username */}
        <div>
          <label className="text-white block mb-1">Username</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-white block mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-white block mb-1">New Password</label>
          <input
            type="password"
            value={profile.password}
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20"
            placeholder="Leave blank to keep current password"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-white block mb-1">Confirm Password</label>
          <input
            type="password"
            value={profile.confirmPassword}
            onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20"
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
