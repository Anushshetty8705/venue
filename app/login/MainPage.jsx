"use client";
import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const MainPage = ({ isFlipped, setIsFlipped }) => {
  const [active, setActive] = useState(0); // 0 = Login, 1 = Register
  const [hover, sethover] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      {/* Outer container */}
      <div className={`animate-fade-in-center bg-black rounded-[50px] w-[55%] relative flex items-center justify-center border-8 border-black transition-all duration-700 ease-in-out ${!hover ? "  h-[18vh]":"h-[80%]  " }`}>
        {/* Inner content container */}
        <div onMouseEnter={() => sethover(true)}
           className={`box border-4 border-gray-800 h-[10vh] w-[50vw] flex fixed transition-all duration-700 ease-in-out rounded-4xl z-10 bg-white/10 overflow-hidden  ${!hover ? "  h-[10vh]":"h-[70%] " }`}
            >
          {/* Login / Register component */}
          {!active ? (
            <Login isFlipped={isFlipped} setIsFlipped={setIsFlipped} hover={hover} />
          ) : (
            <Register hover={hover} />
          )}

          {/* Hover panel */}
           <div
            className={`   w-1/2 bg-gray-700 cursor-pointer transition-all duration-500 rounded-l-[70px] `}
          >
            <div
              className={`flex flex-col items-center justify-center h-full gap-3 transition-opacity duration-300 `}
            >
              <span className={`text-white text-2xl transition-all ease-in-out duration-300 ${
                hover ? "animate-fade-in-center opacity-100" : "opacity-0"
              }`}>
                {!active ? "Hello, Welcome" : "Welcome back"}
              </span>
              <span className={`text-white text-[12px] text-center transition-all ease-in-out duration-300 ${
                hover ? "animate-fade-in-center opacity-100" : "opacity-0"
              }`}>
                {!active
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>
              <button
                className={`px-10 py-2 rounded-full text-white text-[14px] bg-gradient-to-r from-red-400 to-pink-500 hover:opacity-90 ${hover ? "mb-0 animate-fade-in-center ": "mb-18"}`}
                onClick={() => setActive(!active)}
              >
                {!active ? "Register" : "Login"}
              </button>
            </div>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default MainPage;
