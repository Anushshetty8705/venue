"use client";
import { motion } from "framer-motion";

export default function About({setActiveSection}) {
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
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">
          Meet Our Developers
        </h1>

        <p className="text-xl text-gray-300 mt-4">
          Four passionate minds building meaningful digital experiences with precision, creativity, and integrity.
        </p>

        <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-rose-500 mx-auto rounded-full mt-6" />

        {/* Description */}
        <p className="mt-6 text-lg text-gray-300 leading-relaxed">
          We are a team of four dedicated web developers committed to crafting scalable, elegant, 
          and user-first digital products. Together, we bring creativity, engineering, and performance to life.
        </p>

        {/* Team Grid */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">

          {/* Developer 1 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="backdrop-blur-lg bg-[#1c2541]/40 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <h3 className="text-2xl font-bold text-amber-400">Akash PM – Frontend Architect</h3>
            <p className="text-gray-300 mt-2">
              Expert in React, Next.js, Tailwind CSS & UI animations. Loves building clean, responsive interfaces.
            </p>

            <div className="mt-4 text-gray-300 text-sm space-y-1">
              <p><span className="text-amber-400">Email:</span> arjun.dev@example.com</p>
              <p><span className="text-amber-400">Phone:</span> +91 98765 43210</p>
              <p><span className="text-amber-400">GitHub:</span> github.com/arjun-dev</p>
            </div>
          </motion.div>

          {/* Developer 2 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="backdrop-blur-lg bg-[#1c2541]/40 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <h3 className="text-2xl font-bold text-rose-400">Anjini BS – Backend & API Specialist</h3>
            <p className="text-gray-300 mt-2">
              Works with Node.js, Express, MongoDB & authentication systems. Ensures speed, security & scalability.
            </p>

            <div className="mt-4 text-gray-300 text-sm space-y-1">
              <p><span className="text-rose-400">Email:</span> neha.backend@example.com</p>
              <p><span className="text-rose-400">Phone:</span> +91 91234 56789</p>
              <p><span className="text-rose-400">GitHub:</span> github.com/neha-codes</p>
            </div>
          </motion.div>

          {/* Developer 3 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="backdrop-blur-lg bg-[#1c2541]/40 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <h3 className="text-2xl font-bold text-amber-400">Amruthesh HD – UI/UX & Interaction Designer</h3>
            <p className="text-gray-300 mt-2">
              Creates immersive user experiences through design systems, layouts, and prototypes.
            </p>

            <div className="mt-4 text-gray-300 text-sm space-y-1">
              <p><span className="text-amber-400">Email:</span> riya.ui@example.com</p>
              <p><span className="text-amber-400">Phone:</span> +91 90000 11122</p>
              <p><span className="text-amber-400">Portfolio:</span> dribbble.com/riya-designs</p>
            </div>
          </motion.div>

          {/* Developer 4 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="backdrop-blur-lg bg-[#1c2541]/40 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <h3 className="text-2xl font-bold text-rose-400">Anush D – DevOps & Cloud Engineer</h3>
            <p className="text-gray-300 mt-2">
              Skilled in AWS, Docker, CI/CD pipelines & automation workflows. Keeps systems reliable & fast.
            </p>

            <div className="mt-4 text-gray-300 text-sm space-y-1">
              <p><span className="text-rose-400">Email:</span> anushshetty123456@gmail.com</p>
              <p><span className="text-rose-400">Phone:</span> +91 84949 55345</p>
              <p><span className="text-rose-400">Github:</span> linkedin.com/in/karan-devops</p>
            </div>
          </motion.div>
        </div>

        {/* Motto */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-lg text-gray-300 italic"
        >
          “Great products are built by great teams — and we build with passion.”
        </motion.p>

        {/* CTA */}
        <div className="mt-10">
         <button onClick={() => setActiveSection("contact")} className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-lg font-semibold shadow-lg hover:scale-105 transition-transform">
            Contact Our Team
          </button>
        </div>
      </motion.div>
    </section>
  );
}
