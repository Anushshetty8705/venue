"use client";

import React, { useState } from "react";
import MainPage from "./MainPage";
import Forgotpage from "./Forgotpage";

const FlipCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-screen h-screen [perspective:100px] ">
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side (Login) */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] z-20">
          <MainPage setIsFlipped={setIsFlipped} />
        </div>

        {/* Back Side (Forgot Password) */}
        <div className="inset-0 w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] z-10 flex items-center justify-center">
          <Forgotpage setIsFlipped={setIsFlipped} />
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
