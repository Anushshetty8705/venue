"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-white px-6 overflow-hidden bg-[#0b132b]">
      {/* 🔮 Glowing Background Orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[500px] h-[500px] bg-[#1c2541]/30 rounded-full blur-3xl top-8 left-10 animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-[#3a506b]/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
      </div>

      {/* 📬 Contact Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/10"
      >
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500 mb-4 text-center">
          Contact Us
        </h2>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6"
        >
          <div>
            <input
              className="w-full p-4 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-300 text-white"
              placeholder="Your name"
            />
          </div>
          <div>
            <input
              className="w-full p-4 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-300 text-white"
              placeholder="Your email"
            />
          </div>
          <div>
            <textarea
              className="w-full p-4 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-300 text-white"
              rows={5}
              placeholder="Your message"
            />
          </div>
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-400 to-rose-500 text-black font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Send Message
            </motion.button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
