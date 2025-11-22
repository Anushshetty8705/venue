"use client";
import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const MainPage = ({ isFlipped, setIsFlipped }) => {
  const [active, setActive] = useState(0); // 0 = Login, 1 = Register


  return (
    <div className="flex items-center justify-center h-[100%]">
      {/* Outer container */}
   
        {/* Inner content container */}
        <div 
         
           className={` border-2  border-blue-500   w-[50vw] flex fixed transition-all duration-700 ease-in-out rounded-4xl z-10  bg-[#3a506b]/20 overflow-hidden   h-[70vh]`}
            >
          {/* Login / Register component */}
          {!active ? (
            <Login isFlipped={isFlipped} setIsFlipped={setIsFlipped}  />
          ) : (
            <Register />
          )}

          {/* Hover panel */}
           <div
            className={`   w-1/2 bg-[#3a506b]/30 cursor-pointer transition-all duration-500 rounded-l-[70px] `}
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
                className={`px-10 py-2 rounded-full text-white text-[14px]  bg-gradient-to-r from-amber-500 to-rose-500 `}
                onClick={() => setActive(!active)}
              >
                {!active ? "Register" : "Login"}
              </button>
            </div>
          </div>
        </div>
       
      </div>
    
  );
};

export default MainPage;
