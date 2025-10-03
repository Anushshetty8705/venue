"use client";
import React from "react";

export default function Gallery({ images = [] }) {
  return (
    <div className="min-h-screen py-12 px-6 lg:px-24 text-white">
      <h2 className="text-3xl font-bold mb-6">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, i) => (
          <div key={i} className="overflow-hidden rounded-lg">
            <img src={src} alt={`gallery-${i}`} className="w-full h-48 object-cover hover:scale-105 transition" />
          </div>
        ))}
      </div>
    </div>
  );
}
