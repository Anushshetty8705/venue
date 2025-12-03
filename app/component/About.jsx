"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import DeveloperModal from "./DeveloperModal";

export default function About({ setActiveSection }) {
  const [selectedDev, setSelectedDev] = useState(null);

  const developers = [
    {
      name: "Akash PM",
      role: "Frontend Architect",
      bio: "Expert in React, Next.js, Tailwind CSS & UI animations. Loves building clean, responsive interfaces.",
      email: "akashpmgowda@gmil.com",
      phone: "+91 9482795919",
      github: "github.com/akashpm1",
      image: "/image.png",
      color: "text-amber-400",
    },
    {
      name: "Anjini BS",
      role: "Backend & API Specialist",
      bio: "Works with Node.js, Express, MongoDB & authentication systems. Ensures speed, security & scalability.",
      email: "anjinibs9@gmail.com",
      phone: "+91 9686229818",
      github: "github.com/anjinibs",
      image: "/anjini.jpeg",
      color: "text-rose-400",
    },
    {
      name: "Amruthesh HD",
      role: "Frontend & Interaction Designer",
      bio: "Creates immersive UX through design systems, layouts, and prototypes tailwind css.",
      email: "hdamruthesh@gmail.com",
      phone: "+91 90000 11122",
      github: "github.com/amrutheshhd",
      image: "/ammukutty.jpg",
      color: "text-amber-400",
    },
    {
      name: "Anush D",
      role: "Backend DevOps Engineer ",
      bio: "Skilled in mongodb express next.js.",
      email: "anushshetty123456@gmail.com",
      phone: "+91 84949 55345",
      github: "github.com/anushd",
      image: "/anushd.jpg",
      color: "text-rose-400",
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center px-6 py-4 text-white relative overflow-auto">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-96 h-96 bg-[#1c2541]/30 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
        <div className="absolute w-80 h-80 bg-[#3a506b]/20 rounded-full blur-3xl bottom-20 right-10 animate-pulse"></div>
      </div>

      <motion.div
        className="max-w-5xl text-center space-y-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">
          Meet Our Developers
        </h1>

        <p className="text-xl text-gray-300 mt-4">
          Four passionate minds building meaningful digital experiences.
        </p>

        {/* Team Grid */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
          {developers.map((dev, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedDev(dev)}
              className="cursor-pointer backdrop-blur-lg bg-[#1c2541]/40 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
            >
              <h3 className={`text-2xl font-bold ${dev.color}`}>{dev.name} – {dev.role}</h3>
              <p className="text-gray-300 mt-2">{dev.bio}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10">
          <button
            onClick={() => setActiveSection("contact")}
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Contact Our Team
          </button>
        </div>
      </motion.div>

      {/* Modal Component */}
      <DeveloperModal developer={selectedDev} onClose={() => setSelectedDev(null)} />
    </section>
  );
}
