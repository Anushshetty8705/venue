"use client";
import { motion } from "framer-motion";

export default function DeveloperModal({ developer, onClose }) {
  if (!developer) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
      onClick={onClose} // close when clicking outside
    >
      <motion.div
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside card
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1c2541]/80 border border-white/10 rounded-2xl p-8 shadow-2xl w-[90%] max-w-lg text-white space-y-4"
      >
        <img
          src={developer.image}
          alt={developer.name}
          className="w-28 h-28 rounded-full border mx-auto object-cover"
        />

        <h2 className={`text-3xl font-bold text-center ${developer.color}`}>
          {developer.name}
        </h2>

        <p className="text-center text-gray-300">{developer.role}</p>

        <p className="text-gray-300 text-center leading-relaxed">
          {developer.bio}
        </p>

        <div className="text-gray-300 text-sm space-y-1 text-center">
          <p><span className={developer.color}>Email:</span> {developer.email}</p>
          <p><span className={developer.color}>Phone:</span> {developer.phone}</p>
          <p><span className={developer.color}>GitHub:</span> {developer.github}</p>
        </div>

        <button
          className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-red-500 to-amber-500 font-semibold hover:scale-105 transition"
          onClick={onClose}
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}
