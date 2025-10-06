"use client";
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";

export default function EditProfile({ initialProfile, adminUuid, onUpdate, onClose }) {
  const [profile, setProfile] = useState({
    username: initialProfile.username || "",
    email: initialProfile.email || "",
    password: "",
    confirmPassword: "",
    image: initialProfile.image || null,
  });

  const [previewImage, setPreviewImage] = useState(profile.image);
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setProfile({ ...profile, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.username) return toast.error("Username is required");
    if (profile.password && profile.password !== profile.confirmPassword)
      return toast.error("Passwords do not match");

    setSaving(true);

    try {
      const res = await fetch(`/api/newprofle?adminUuid=${adminUuid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: profile.username,
          password: profile.password,
          image: profile.image,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Profile updated successfully!");
        if (onUpdate) onUpdate(result.data); // update parent profile state
        if (onClose) onClose(); // hide EditProfile component
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white/5 p-6 rounded-xl shadow-xl mt-6">
      <h2 className="text-2xl font-bold text-sky-200 mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/20 mb-2 flex items-center justify-center text-white text-xl font-bold">
              {profile.username?.[0] || "U"}
            </div>
          )}
          <button
            type="button"
            className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
            onClick={() => fileInputRef.current.click()}
          >
            Change Image
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Username */}
        <div>
          <label className="text-white block mb-1">Username</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-white block mb-1">Email</label>
          <input
            type="text"
            value={profile.email}
            readOnly
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-white block mb-1">New Password</label>
          <input
            type="password"
            value={profile.password}
            onChange={(e) =>
              setProfile({ ...profile, password: e.target.value })
            }
            placeholder="Leave blank to keep current password"
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-white block mb-1">Confirm Password</label>
          <input
            type="password"
            value={profile.confirmPassword}
            onChange={(e) =>
              setProfile({ ...profile, confirmPassword: e.target.value })
            }
            placeholder="Confirm new password"
            className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
