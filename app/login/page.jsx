"use client";
import React, { useState,useEffect } from "react";
import Register from "./Register";
import Login from "./Login";






const Page = ({ Visible, setVisible }) => {
  const [active, setActive] = useState(0);
 
  
      
    

  return (
    <div className="flex items-center justify-center h-screen ">
      {/* Container with two equal halves */}
      <div className="animate-fade-in-center h-[70vh] w-[50vw] flex fixed rounded-4xl z-10 bg-white/10 overflow-hidden box">
        {!active ?<Login/>: <Register/>   } 
      
  
    
    
      

        <div
  className={`absolute top-0 h-full w-1/2 bg-gray-700 cursor-pointer transition-all duration-500
    rounded-l-[70px] left-[25vw]
  `}
  
>

            <div className={`flex flex-col items-center justify-center  h-full gap-3 animate-fade-in-center`}>
              <span className="text-white text-4xl ">{!active ? "Hello,Welcome" :"Welcome back"}</span>
              <span className="text-white ">{!active ? "Dont't have a account" :"Alerady have a acoount"}</span>
              <button
                className=" px-12 py-2 rounded-full text-white  text-xl bg-gradient-to-r from-red-400 to-pink-500 hover:opacity-90 "
                onClick={() => setActive(!active)}
              >
                {!active ? "Register" :"  Login in"}
              </button>
            </div>
          

        
        </div>
      </div>
    </div>
  );
};

export default Page;
