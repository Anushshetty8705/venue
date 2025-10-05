"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Scrol from "./scroll/Scrol";
import Scrol2 from "./scroll/Scrol2";
import Gallery from "./component/Gallery";
import Contact from "./component/Contact";
import About from "./component/About";
export default function Home() {
  const images = [
    "https://picsum.photos/id/1015/1200/800",
    "https://picsum.photos/id/1016/1200/800",
    "https://picsum.photos/id/1018/1200/800",
    "/bh.jpeg",
    "https://picsum.photos/id/1024/1200/800",
    "https://picsum.photos/id/1027/1200/800",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);
// for login register visibility
const [Visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const navRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!activeSection) return;
      const panel = panelRef.current;
      const nav = navRef.current;
      if (panel && !panel.contains(e.target) && nav && !nav.contains(e.target)) {
        setActiveSection(null);
      }
    }

    function handleEsc(e) {
      if (e.key === "Escape") setActiveSection(null);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [activeSection]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const totalImages = images.length;

    if (!track) return; // element not mounted (or unmounted) — avoid accessing .style on null

    if (currentIndex >= totalImages) {
      // temporarily disable transition, jump to clone reset position, then re-enable transition
      track.style.transition = "none";
      setCurrentIndex(1);
      track.style.transform = "translateX(-100%)";
      // force reflow if still in DOM
      // eslint-disable-next-line no-unused-expressions
      track.offsetHeight;
      track.style.transition = "transform 0.5s ease-in-out";
    }
  }, [currentIndex, images.length]);

  const carouselImages = [...images, images[0]];
  function renderMainContent() {
    // Default home content: carousel + hero
    if (!activeSection || activeSection === "home") {
      return (
        <>
          <div className="w-full h-[95vh] overflow-hidden relative">
            <div
              ref={trackRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {carouselImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`img${index}`}
                  className={
                    Visible
                      ? "w-full h-screen object-cover flex-shrink-0 blur-[50px]"
                      : "w-full h-screen object-cover flex-shrink-0 "
                  }
                />
              ))}
            </div>

            <div className="absolute top-0 left-0 w-full h-full bg-black/30 " />

            <div
              className={
                Visible
                  ? "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 flex flex-col items-start gap-4 text-white z-10 pointer-events-none blur-[3px]"
                  : "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 flex flex-col items-start gap-4 text-white z-10"
              }
            >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight">
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-rose-400 to-pink-400">GRAND</span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">PEARL.</span>
                </h1>

                <p className="mt-2 text-lg md:text-xl text-white/85 max-w-2xl">Experience luxury stays and curated services — book your stay with us.</p>

                <div className="mt-6 flex items-center gap-4">
                  <Link href={"/login"} aria-label="Book now" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xl font-semibold shadow-2xl transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300/40">
                    BOOK NOW
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>

                  <a href="#" className="text-sm md:text-base text-white/80 hover:text-white/100">View Rooms</a>
                </div>
            </div>
          </div>

          <div>
            <Scrol />
          </div>
          <div>
            <Scrol2 />
          </div>
        </>
      );
    }

    // Gallery content
    if (activeSection === "gallery") {
      return <Gallery images={images} />;
    }

    // Contact content
    if (activeSection === "contact") {
      return <Contact />;
    }

    // About content
    if (activeSection === "about") {
      return <About />;
    }

    return null;
  }

  return (
    <>
      {/* Navigation Bar: blurred background and in-page toggles (unchanged) */}
      <nav
        ref={navRef}
        className={`absolute top-5 left-1/2 transform -translate-x-1/2 w-5/6 z-30 flex items-center justify-between text-white transition-all ${Visible ? "pointer-events-none blur-[1px]" : "pointer-events-auto"}`}
      >
     

        <div className="mx-auto w-full max-w-3xl">
          <div className={`backdrop-blur-md bg-slate-900/60 border border-white/10 rounded-2xl px-4 py-2 shadow-xl ring-1 ring-white/6`}> 
            <ul className="flex justify-center gap-6 text-lg items-center">
              {[['home','HOME'], ['gallery','GALLERY'], ['contact','CONTACT US'], ['about','ABOUT US']].map(([key,label]) => {
                const isActive = activeSection === key || (!activeSection && key === 'home');
                return (
                  <li key={key}>
                    <button
                      aria-pressed={isActive}
                      onClick={() => setActiveSection((prev) => (prev === key ? null : key))}
                      className={`relative px-3 py-2 rounded-md focus:outline-none transform transition-all duration-200 flex items-center justify-center ${isActive ? 'scale-105 text-white' : 'hover:-translate-y-0.5 hover:scale-105 hover:bg-white/6 text-white/90'}`}
                    >
                      <span className={`inline-flex items-center gap-2 text-sm md:text-base ${isActive ? 'font-semibold' : ''}`}>{label}</span>
                      {/* animated underline */}
                      <span className={`absolute left-1/2 -translate-x-1/2 bottom-1 h-0.5 bg-white transition-all duration-300 ${isActive ? 'w-8 md:w-12 opacity-100' : 'w-0 opacity-0'}`} />
                      {/* active pulsing dot */}
                      <span className={`absolute -right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white ${isActive ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
                    </button>
                  </li>
                );
              })}
              <li>
                <Link href="/login" className="ml-2 px-3 py-2 rounded-md hover:bg-white/6 text-white/90">Dashboard</Link>
              </li>
            </ul>i
          </div>
        </div>

        <div className="flex items-center gap-4">

        </div>
      </nav>

      {/* in-page toggle panel (only for 'home' — other toggles replace full page) */}
      {activeSection === "home" && (
        <div
          ref={panelRef}
          className={`absolute top-20 left-1/2 -translate-x-1/2 w-11/12 max-w-4xl z-30 transition-all transform ${activeSection ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
        >
          <div className="backdrop-blur-md bg-white/10 dark:bg-black/50 rounded-lg p-6 shadow-lg text-white">
            <div>
              <h3 className="text-xl font-semibold">Welcome Home</h3>
              <p className="mt-2 text-sm text-white/80">Quick info and actions shown in-page instead of navigating away.</p>
            </div>
          </div>
        </div>
      )}

      {/* Render swapped main content based on activeSection */}
      {renderMainContent()}
    </>
  );
}
