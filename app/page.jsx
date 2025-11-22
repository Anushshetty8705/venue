"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Gallery from "./component/Gallery";
import Contact from "./component/Contact";
import About from "./component/About";

export default function Home() {
  const images = ["https://tse2.mm.bing.net/th/id/OIP.nxDj_JyPUEfc8YjBgO0RnAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
    ,"https://www.royalorchidhotels.com/Images/slider/14_21_2019_01_21_3421.jpg"
      ,"https://www.royalorchidhotels.com/Images/slider/14_21_2019_01_21_3421.jpg"
        ,"https://www.royalorchidhotels.com/Images/slider/14_21_2019_01_21_3421.jpg"
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % images.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setNavSolid(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const router=useRouter();

  function renderSection() {
    switch (activeSection) {
      case "gallery":
        return <Gallery  />;
      case "contact":
        return <Contact />;
      case "about":
        return <About setActiveSection={setActiveSection} />;

      default:
        return (
          <section className="relative w-full h-[75vh] overflow-hidden bg-[#0b132b] flex items-center justify-center">
            {/* Background slideshow */}
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Slide ${i}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${
                  currentIndex === i ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Glowing background orbs */}
            <div className="absolute w-[400px] h-[400px] bg-[#1c2541]/50 rounded-full blur-3xl  left-10 animate-pulse"></div>
            <div className="absolute w-[350px] h-[350px] bg-[#3a506b]/20 rounded-full blur-3xl  right-10 animate-pulse"></div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#0b132b]/30 to-[#0b132b]" />
 
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative z-10 text-center "
            >
              <h1 className="text-6xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">
                VenueVista
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-10">
                Discover exquisite venues that make your events unforgettable — book with confidence.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <button
                    onClick={() => router.push('/login')}
                  className="px-8 py-3 rounded-full text-white bg-gradient-to-r from-amber-500 to-rose-500 font-semibold shadow-lg hover:scale-105 transition-transform"
                >
                  Explore Venues
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="px-8 py-3 rounded-full border border-white/10 backdrop-blur-lg bg-[#1c2541]/60 text-gray-200 hover:bg-[#3a506b]/60 shadow-lg hover:scale-105 transition-transform"
                >
                  Learn More
                </button>
              </div>
            </motion.div>
          </section>
        );
    }
  }

  return (
    <>
      {/* Navbar */}
      <nav
        className={`sticky top-0 left-0 w-full z-30 transition-all duration-500 ${
          navSolid
            ? "bg-[#0b132b]/95 backdrop-blur-md border-b border-white/10 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
         <div className="flex items-center gap-3">
  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-black font-bold shadow-md">
    VV
  </div>
  <div>
    <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-white to-rose-400">
      Venue Vista
    </div>
    <div className="text-sm text-amber-200">Banquet hall & bookings</div>
  </div>
</div>

          <ul className="flex items-center gap-8 text-sm md:text-base font-medium">
            {[
              ["home", "Home"],
              ["gallery", "Gallery"],
              ["about", "About"],
              ["contact", "Contact"],
            ].map(([key, label]) => (
              <li key={key}>
                <button
                  onClick={() => setActiveSection(key)}
                  className={`transition-all ${
                    activeSection === key
                      ? "z underline underline-offset-4"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md hover:scale-105 transition-transform"
              >
            login
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main */}
      <main className="min-h-[85vh] bg-[#0b132b] text-white">{renderSection()}</main>

      {/* Footer */}
    
    </>
  );
}
