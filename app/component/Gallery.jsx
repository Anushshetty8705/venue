"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Gallery() {
   const images = [{
    src:"https://tse2.mm.bing.net/th/id/OIP.nxDj_JyPUEfc8YjBgO0RnAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  name:"sarji",
location:"shimoga"},
{
    src:"https://www.royalorchidhotels.com/Images/slider/14_21_2019_01_21_3421.jpg",
  name:"saji",
location:"benagalutru"}
,
{
    src:"https://www.royalorchidhotels.com/Images/slider/14_21_2019_01_21_3421.jpg",
  name:"saji",
location:"benagalutru"}
,
{
    src:"https://www.royalorchidhotels.com/Images/slider/14_21_2019_01_21_3421.jpg",
  name:"saji",
location:"benagalutru"}
  ];
  return (

    <section className="relative min-h-[85vh] py-20  lg:px-24 text-white overflow-hidden bg-[#0b132b]">
      {/* 🔮 Glowing Background Orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[500px] h-[500px] bg-[#1c2541]/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-[#3a506b]/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
      </div>

      {/* 🏷️ Title */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500 text-center mb-12"
      >
        Gallery
      </motion.h2>

      {/* 📸 Image Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        {images.map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-[#1c2541]/40 border border-white/10 shadow-xl hover:shadow-2xl group"
          >
            <img
              src={src.src}
              alt={`gallery-${i}`}
              className="w-full h-56 object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-[#0b132b]/90 via-transparent to-transparent transition-opacity duration-500 flex flex-col justify-end p-4">
            <div className="text-white font-semibold">{src.name}</div>
             <div className="text-white font-semibold">{src.location}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ✨ Footer Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-16 text-gray-400"
      >
        <p className="text-sm">
          Curated spaces to inspire your next event —{" "}
          <span className="text-amber-400 font-semibold">VenueVista</span>
        </p>
      </motion.div>
    </section>
  );
}
