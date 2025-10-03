"use client";
import React from "react";

export default function Contact() {
  return (
    <div className="min-h-screen flex items-center justify-center  text-white p-6">
      <div className="w-full max-w-2xl bg-white/5 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <input className="w-full p-3 rounded bg-white/10" placeholder="Your name" />
          <input className="w-full p-3 rounded bg-white/10" placeholder="Your email" />
          <textarea className="w-full p-3 rounded bg-white/10" rows={5} placeholder="Message" />
          <div className="text-right">
            <button className="px-6 py-2 rounded bg-neutral-600 hover:bg-neutral-700">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}
