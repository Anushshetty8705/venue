"use client";
import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const MainPage = ({ isFlipped, setIsFlipped }) => {
  const [active, setActive] = useState(0); // 0 = Login, 1 = Register


  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      {/* Outer container */}
      <div className={`animate-fade-in-center bg-black rounded-[50px] w-[55%] relative flex items-center justify-center border-8 border-black transition-all duration-700 ease-in-out h-[80vh]`}>
        {/* Inner content container */}
        <div 
         
           className={`box border-4 border-gray-800 w-[50vw] flex fixed transition-all duration-700 ease-in-out rounded-4xl z-10 bg-white/10 overflow-hidden   h-[70vh]`}
            >
          {/* Login / Register component */}
          {!active ? (
            <Login isFlipped={isFlipped} setIsFlipped={setIsFlipped}  />
          ) : (
            <Register />
          )}

          {/* Hover panel */}
           <div
            className={`   w-1/2 bg-gray-700 cursor-pointer transition-all duration-500 rounded-l-[70px] `}
          >
            <div
              className={`flex flex-col items-center justify-center h-full gap-3 transition-opacity duration-300 `}
            >
              <span className={`text-white text-2xl transition-all ease-in-out duration-300 
              }`}>
                {!active ? "Hello, Welcome" : "Welcome back"}
              </span>
              <span className={`text-white text-[12px] text-center transition-all ease-in-out duration-300 `}>
                {!active
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>
              <button
                className={`px-10 py-2 rounded-full text-white text-[14px] bg-gradient-to-r from-red-400 to-pink-500 hover:opacity-90 `}
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
