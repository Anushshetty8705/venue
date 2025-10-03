"use client";

import { useEffect, useRef, useState } from "react";

export default function Scrol() {
  // Image set (kept same source set but could be passed as props)
  const images = [
    "https://picsum.photos/id/1015/1200/800",
    "https://picsum.photos/id/1016/1200/800",
    "https://picsum.photos/id/1018/1200/800",
    "https://picsum.photos/id/1020/1200/800",
    "https://picsum.photos/id/1024/1200/800",
    "https://picsum.photos/id/1025/1200/800",
    "https://picsum.photos/id/1031/1200/800",
    "https://picsum.photos/id/1035/1200/800",
    "https://picsum.photos/id/1037/1200/800",
    "https://picsum.photos/id/1041/1200/800",
    "https://picsum.photos/id/1043/1200/800",
    "https://picsum.photos/id/1050/1200/800",
  ];

  const containerRef = useRef(null);
  const listRef = useRef(null);
  const itemWidthRef = useRef(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    function update() {
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
      // determine active index using first child width as basis
      const first = el.children[0];
      if (first) {
        const itemWidth = first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || 0) || first.offsetWidth;
        itemWidthRef.current = itemWidth;
        const idx = Math.round(el.scrollLeft / itemWidth);
        setActiveIndex(Math.min(Math.max(idx, 0), images.length - 1));
      }
    }

    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [images.length]);

  function scrollByAmount(amount) {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }


  // keyboard navigation for accessibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onKey(e) {
      if (e.key === "ArrowRight") {
        scrollByAmount(el.clientWidth * 0.6);
      } else if (e.key === "ArrowLeft") {
        scrollByAmount(-el.clientWidth * 0.6);
      }
    }
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  function scrollToIndex(i) {
    const el = listRef.current;
    if (!el) return;
    const child = el.children[i];
    if (child) {
      el.scrollTo({ left: child.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || 0), behavior: "smooth" });
    }
  }

  return (
    <section
      ref={containerRef}
      className="w-full"
      aria-label="Rooms gallery"
    >
      <div className="flex items-center justify-center my-3">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
      
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-400 dark:from-indigo-300 dark:via-pink-300 dark:to-yellow-300 dark:text-white">Rooms</span>
        </h2>
        {/* count removed as requested */}
      </div>

      <div className="relative group">
        {/* left gradient */}
  <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white/95 to-transparent dark:from-black/60 transition-opacity opacity-100 group-hover:opacity-100" />

        <button
          onClick={() => scrollByAmount(-window.innerWidth * 0.6)}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full shadow-lg bg-white/90 text-black hover:bg-white dark:bg-black/50 dark:text-white dark:hover:bg-black/70 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div
          ref={listRef}
          tabIndex={0}
          className="flex gap-3 overflow-x-auto overflow-y-hidden scrollbar-hide py-3 px-4 scroll-smooth snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[72vw] sm:w-[40vw] md:w-[28vw] lg:w-[20vw] h-[36vh] sm:h-[32vh] md:h-[34vh] rounded-lg overflow-hidden shadow-lg dark:shadow-black/40 relative snap-start "
            >
              <img
                src={src}
                alt={`Room image ${i + 1}`}
                className="w-full h-full opacity-80 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                loading="lazy"
                draggable={false}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                <div className="p-3 text-white">
                  <div className="font-semibold">Room {i + 1}</div>
                  <div className="text-xs text-white/80">Cozy and well-lit</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollByAmount(window.innerWidth * 0.6)}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full shadow-lg bg-white/90 text-black hover:bg-white dark:bg-black/50 dark:text-white dark:hover:bg-black/70 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* right gradient */}
  <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white/95 to-transparent dark:from-black/60 transition-opacity opacity-100 group-hover:opacity-100" />

        {/* pagination dots */}
       

      </div>

      <style jsx>{`
        /* hide scrollbar across browsers (both horizontal and vertical) */
        .scrollbar-hide::-webkit-scrollbar { display: none; height: 0; width: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        /* fallback: ensure no vertical overflow shows */
        .scrollbar-hide { overflow-y: hidden; }

        /* ensure the gradients don't cover content in dark/light contexts */
        @media (prefers-color-scheme: dark) {
          .group > div[style] { /* fallback */ }
        }
      `}</style>
    </section>
  );
}

