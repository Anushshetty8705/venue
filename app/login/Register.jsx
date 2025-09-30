"use client";
import { Eye, EyeOff, Hash, KeyRound, Mail, User } from "lucide-react"; // added User + Lock icons

import React, { useState,useEffect } from "react";


import { toast, Flip } from "react-toastify"; //TOAST

const Register = () => {
 
  const [registerusername, setregisterusername] = useState(""); // FOR USER
  const [registeremail, setregisteremail] = useState(""); //FOR EMAIL
  const [registerpassword, setregisterpassword] = useState(""); //FOR PASSWORD
  const [regusererror, setregusererror] = useState(""); //FOR USER ERROR
  const [regemailerror, setregemailerror] = useState(""); //FOR EMAIL ERROR
  const [regpasserror, setregpasserror] = useState(""); //FOR PASSWORD ERROR
  const [otp, setotp] = useState(""); //FOR OTP
  const [visotp, setvisotp] = useState(false); //TO SHOW THE OTP INPUT BOX
  const [isvalid, setisvalid] = useState(false); // TO  ALTER REGISTER BUTTON ACC TO CONDITON
  const [EMAILVALID, setEMAILVALID] = useState(false); // TO CHECK FOR SEND AND EMAIL INPUT BOX
  const [ShowPasword, setShowPasword] = useState(false); //showing password
  const [isuservalid, setisuservalid] = useState(false); // valid user
  const [ispassvalid, setispassvalid] = useState(false); // valid password
  const [validotp, setvalidotp] = useState(false); //check for valiD TO INPUT AND BUTTON
  const [verifiedEmail, setVerifiedEmail] = useState(""); // stores verified email

  // SETTING VALUE OF USER AND ERROR
  const valregisterusername = (e) => {
    setregisterusername(e.target.value);
    if (e.target.value.length < 5) {
      setregusererror("username must be 5 char");
      setisvalid(false);
      setisuservalid(false);
    } else {
      setisuservalid(true);
      setisvalid(true);

      setregusererror("");
    }
  };

  // SETTING VALUE AND ERROR CHECK FOR EMAIL
  const valregisteremail = (e) => {
    setregisteremail(e.target.value);
    if (e.target.value.length < 8) {
      setisvalid(false);
      setEMAILVALID(false);
      setregemailerror("email must be 8 char");
    } else if (!e.target.value.endsWith("@gmail.com")) {
      setisvalid(false);
      setEMAILVALID(false);

      setregemailerror("Invalid email (must end with @gmail.com)");
    } else {
      setisvalid(true);
      setregemailerror("");
      setEMAILVALID(true);
    }
  };

  // SETTING VALUE AND ERROR CHECK FOR PASSWORD
  const valregisterpassword = (e) => {
    setregisterpassword(e.target.value);
    if (e.target.value.length < 8) {
      setregpasserror("password must be 8 char");
      setisvalid(false);
      setispassvalid(false);
    } else {
      setregpasserror("");
      setisvalid(true);
      setispassvalid(true);
    }
  };

  // SETTING VALUE AND ERROR CHECK FOR OTP
  const valotp = (e) => {
    setotp(e.target.value);
    if (e.target.value.length === 6) {
      setvalidotp(true);
    } else {
      setvalidotp(false);
    }
  };

  //  otpsending
 // send otp (✅ no verifiedEmail here)
const sendOtp = async () => {
  if (registeremail.length > 8 && registeremail.endsWith("@gmail.com")) {
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeremail }),
      });

      if (res.ok) {
        toast.success("OTP sent successfully 📧", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
          transition: Flip,
        });
        setvisotp(true);
      } else {
        toast.error("Failed to send OTP ❌", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
          transition: Flip,
        });
      }
    } catch (err) {
      toast.error("Something went wrong ❌", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        transition: Flip,
      });
    }
  }
};

// verify otp (✅ only set verifiedEmail if correct)
const verifyOtp = async () => {
  setotp(""); 
  if (otp.length === 6) {
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeremail, otp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("OTP verified ✅", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
          transition: Flip,
        });
        setvisotp(false);
        setVerifiedEmail(registeremail); // ✅ now only after correct OTP
      } else {
         setvisotp(false);
        toast.error(data.message || "Invalid OTP ❌", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
          transition: Flip,
        });
      }
    } catch (err) {
      toast.error("Server error ❌", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        transition: Flip,
      });
    }
  }
};

  // CONTINUE WITH SOCIAL PLATFORM


   
  

  // SETTING FOR REGISTRION
  const registerconfirm = () => {
    if (registeremail.length === 0) {
      setregemailerror("* This field is required");
      setisvalid(false);
    }

    if (registerusername.length == 0) {
      setisvalid(false);
      setregusererror("* This field is required");
    }
    if (registerpassword.length == 0) {
      setisvalid(false);
      setregpasserror("* This field is required");
    }
    if (registeremail !== verifiedEmail) {
      toast.warning("Please verify your current email before registering ❌");
      return; // stop registration
    }

    if (
      registeremail.length > 8 &&
      registerusername.length > 8 &&
      registerpassword.length > 8 &&
      registeremail.endsWith("@gmail.com") 
         && verifiedEmail === registeremail
    ) 
 
    {
      const toastId = toast.loading('Signing.....');
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "username": registerusername,
      "password": registerpassword,
      "email": registeremail
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("/api/register", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        toast.dismiss(toastId);

        if (result.error === "false") {
          toast.success('Signing successfully!');
       
        } else {
          toast.error(result.message || "Signup failed");
        }
      })
      .catch((error) => console.error(error));
    }
  };

  return (
    <>
      <div className="h-full w-1/2 flex flex-col items-center justify-center relative  gap-2  ">
        <div className="text-white text-2xl font-semibold mb-4 animate-fade-in-down ">REGISTER</div>
        {/* USERNAME */}
        <div className="w-[80%] mb-3 relative animate-fade-in-up">
          <p className="text-white mr-40 text-sm pb-1">Enter your Name</p>
          <input
            type="text"
            placeholder=" Name"
            value={registerusername}
            onChange={(e) => valregisterusername(e)}
            className={`bg-white/20 w-[100%] py-1.5 relative text-white placeholder-gray-300  rounded-xl px-8 focus:outline-none focus:ring-2 ${
              !isuservalid ? "focus:ring-red-400" : "focus:ring-green-400"
            } `}
          />
          {/* USER ICON */}
          <User className="absolute left-3 top-8 text-gray-300" size={18} />
          {/* USER ERROR */}
          <div className="text-red-400 text-sm">{regusererror}</div>
        </div>
        <div className="w-[80%] mb-3 relative animate-fade-in-down">
          <p className="text-white mr-40 text-sm pb-1">
            Enter your {visotp ? "OTP" : "Email"}
          </p>

          <div className="relative flex gap-2">
            {visotp ? ( //CHECKING WHEATHER THE TO SHOW EMAIL OR OTP
              <>
                {/* OTP */}
                <input
                  value={otp}
                  type="tel"
                  placeholder=" OTP"
                  onChange={(e) => valotp(e)}
                  className={`animate-fade-in-center bg-white/20 text-white relative w-[80%]  placeholder-gray-300 rounded-xl px-8 py-1.5 focus:outline-none focus:ring-2 ${
                    !validotp ? " focus:ring-red-400" : " focus:ring-green-400"
                  }`}
                />
                {/* VERIFY */}
                <button
                  onClick={verifyOtp}
                  className={`animate-fade-in-center px-3 rounded-xl text-white text-[12px] ${
                    validotp
                      ? "bg-gradient-to-r from-red-400 to-pink-500 hover:opacity-90"
                      : "bg-gray-600 cursor-not-allowed"
                  } `}
                >
                  Verify
                </button>
              </>
            ) : (
              <>
                {/* EMAIL */}
                <input
                  value={registeremail}
                  type="email"
                  placeholder=" Email"
                  onChange={(e) => valregisteremail(e)}
                  className={`animate-fade-in-up bg-white/20 py-1.5  text-white relative w-[80%]  placeholder-gray-300 rounded-xl px-8 focus:outline-none focus:ring-2  ${
                    !EMAILVALID ? "focus:ring-red-400" : "focus:ring-green-400"
                  }   `}
                />
                {/* SEND OTP */}
                <button
                  onClick={sendOtp}
                  className={`animate-fade-in-up px-3  rounded-xl text-white text-[12px] ${
                    EMAILVALID
                      ? "bg-gradient-to-r from-red-400 to-pink-500 hover:opacity-90"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  Send
                </button>
              </>
            )}
          </div>
          {/* HASH AND MAIL ICON */}
          {visotp ? (
            <Hash className="animate-fade-in-down  absolute left-3 top-8 text-gray-300" size={18} />
          ) : (
            <Mail className=" animate-fade-in-center absolute left-3 top-8 text-gray-300" size={18} />
          )}
          {/* EMAIL ERROR */}
          <div className="text-red-400 text-sm ">{regemailerror}</div>
        </div>
        <div className="w-[80%] mb-3 relative animate-fade-in-down">
          <p className="text-white text-sm pb-1">Enter your password</p>
          {/* PASSWORD */}
          <input
            value={registerpassword}
            type={ShowPasword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => valregisterpassword(e)}
            className={`bg-white/20 w-[100%] py-1.5 relative text-white placeholder-gray-300  rounded-xl px-8 focus:outline-none focus:ring-2 ${
              !ispassvalid ? "focus:ring-red-400" : "focus:ring-green-400"
            } `}
          />
          {/* SHOW AND HIDE PASSWORD */}
          <button
            type="button"
            onClick={() => setShowPasword(!ShowPasword)}
            className="absolute right-3 top-8 text-gray-300"
          >
            {/* EYE ICON */}
            {!ShowPasword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {/* PASSSWORD ICON */}
          <KeyRound className="absolute left-3 top-8 text-gray-300" size={18} />
          {/* PASSWORD ERROR */}
          <div className="text-red-400  text-sm">{regpasserror}</div>
        </div>
        {/* REGISTRATION */}
        <button
          onClick={() => registerconfirm()}
          className={`animate-fade-in-up w-[40%] py-2 text-white rounded-2xl text-lg  ${
            isvalid
              ? "bg-gradient-to-r from-red-400 to-pink-500 hover:opacity-90"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Register
        </button>
       
      </div>
    </>
  );
};

export default Register;
