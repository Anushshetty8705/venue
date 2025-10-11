"use client";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-4 text-white  relative overflow-auto">
      {/* Soft glowing circles in background for depth */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-96 h-0 bg-[#1c2541]/30 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
        <div className="absolute w-80 h-80 bg-[#3a506b]/20 rounded-full blur-3xl bottom-20 right-10 animate-pulse"></div>
      </div>

      <motion.div
        className="max-w-4xl text-center space-y-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Company Name */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">
          About VenueVista
        </h1>

        {/* Tagline */}
        <p className="text-xl text-gray-300 mt-4">
          Redefining how you find and book perfect venues — for every celebration, effortlessly.
        </p>

        {/* Divider */}
        <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-rose-500 mx-auto rounded-full mt-6"></div>

        {/* Main Description */}
        <p className="mt-8 text-lg text-gray-300 leading-relaxed">
          At <span className="text-amber-400 font-semibold">VenueVista</span>, we believe every event deserves
          the perfect space. From weddings to conferences, our platform connects people with premium
          banquet halls and event venues across cities.
        </p>

        <p className="mt-4 text-gray-300 leading-relaxed">
          We empower venue owners with smart booking tools and analytics while offering guests
          an intuitive experience to explore, compare, and reserve the best venues in just a few clicks.
        </p>

        {/* Mission & Vision Cards */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
          {/* Mission */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="backdrop-blur-lg bg-[#1c2541]/40 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <h3 className="text-2xl font-bold mb-3 text-amber-400">Our Mission</h3>
            <p className="text-gray-300">
              To make venue booking simple, transparent, and enjoyable through technology and thoughtful design.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="backdrop-blur-lg bg-[#1c2541]/40 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <h3 className="text-2xl font-bold mb-3 text-rose-400">Our Vision</h3>
            <p className="text-gray-300">
              To become the most trusted destination for discovering and managing event spaces — anywhere, anytime.
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <a
            href="/contact"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Get in Touch
          </a>
        </motion.div>
      </motion.div>

      {/* Fixed Footer */}
     
    </section>
    
  );
}
