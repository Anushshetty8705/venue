"use client";
import React, { useState } from "react";
import { Eye, EyeOff, KeyRound, Mail, Hash } from "lucide-react"; // added User + Lock icons
import { toast } from "react-toastify"; //TOAST

const Page = ({ isFlipped, setIsFlipped }) => {
  const [forgotemail, setforgotemail] = useState(""); //FOR forgotemail
  const [forgotemailERROR, setforgotemailERROR] = useState(""); // FOR forgotemail ERROR
  const [OTPBOX, setOTPBOX] = useState(false); // TO SHOW OTP INPUT BOX
  const [ISVALID, setISVALID] = useState(false); //FOR LOGIN BUTTON
  const [otpvalid, setotpvalid] = useState(false); //FOR CEHCKING OTP VALID FOR INPUT BOX AND VERIFY
  const [otp, setotp] = useState(""); // FOR OTP
  const [validotp, setvalidotp] = useState(false); //to check email ADDRESS and send otp BUTTTON
  const [verifiedEmail, setVerifiedEmail] = useState(""); // TO STORE  THE VALUE OF VERIFIED OTP EMAIL
  const [isEmailVerified, setIsEmailVerified] = useState(false); // Email OTP verified?

  const [ShowPasword, setShowPasword] = useState(false); //SHOW AND HIDE PASSWORD
  const [showConfirmPassword, setshowConfirmPassword] = useState(false); //SHOW AND HIDE CONFIRM PASSWORD

  const [password, setLoginPassword] = useState(""); //FOR PASSWORD
  const [PASSWORDERROR, setPASSWORDERROR] = useState("");
  const [ISVALID_PASS, setISVALID_PASS] = useState(false);

  const [confirmPassword, setconfirmPassword] = useState("");
  const [confirmpasserror, setconfirmpasserror] = useState("");
  const [ISVALIDconfirmpass, setISVALIDconfirmpass] = useState(false);

  const [hover, sethover] = useState(false);

  // SETTING forgotemail AND ERROR
  const valforgotemail = (e) => {
    setforgotemail(e.target.value);
    setIsEmailVerified(false); // Reset OTP verification on email change
    if (e.target.value.length < 8) {
      setISVALID(false);
      setotpvalid(false);
      setforgotemailERROR("Email must be 8 char");
    } else if (!e.target.value.endsWith("@gmail.com")) {
      setISVALID(false);
      setotpvalid(false);
      setforgotemailERROR("Invalid email (must end with @gmail.com)");
    } else {
      setISVALID(true);
      setforgotemailERROR("");
      setotpvalid(true);
    }
  };

  // SETTING OTP VALIDOTP
  const valotp = (e) => {
    setotp(e.target.value);
    if (e.target.value.length === 6) {
      setvalidotp(true);
    } else {
      setvalidotp(false);
    }
  };

  // CONFIRM PASSWORD
  const confirmpass = (e) => {
    const value = e.target.value;
    setconfirmPassword(value);

    if (value.length < 8) {
      setISVALIDconfirmpass(false);
      setconfirmpasserror("Password must be at least 8 chars");
      setISVALID(false);
    } else if (value !== password) {
      setISVALIDconfirmpass(false);
      setconfirmpasserror("Passwords don't match");
      setISVALID(false);
    } else {
      setISVALIDconfirmpass(true);
      setconfirmpasserror("");
      if (isEmailVerified) setISVALID(true);
    }
  };

  // PASSWORD
  const PASSWORD = (e) => {
    const value = e.target.value;
    setLoginPassword(value);
    if (value.length < 8) {
      setISVALID_PASS(false);
      setISVALID(false);
      setPASSWORDERROR("Password must be at least 8 chars");
    } else if (confirmPassword && value !== confirmPassword) {
      setconfirmpasserror("Passwords don't match");
      setISVALID(false);
    } else {
      setISVALID_PASS(true);
      setPASSWORDERROR("");
      if (confirmPassword === value && isEmailVerified) {
        setISVALID(true);
        setconfirmpasserror("");
      }
    }
  };

  // SENDING OTP
  const sendOtp = async () => {
    if (forgotemail.length > 8 && forgotemail.endsWith("@gmail.com")) {
      try {
        const res = await fetch("/api/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotemail }),
        });

        if (res.ok) {
          toast.success("OTP sent successfully 📧", {});
          setOTPBOX(true);
        } else {
          toast.error("Failed to send OTP ❌", {});
        }
      } catch (err) {
        toast.error("Something went wrong ❌", {});
      }
    }
  };

  // VERIFYING OTP
  const verifyOtp = async () => {
    if (otp.length === 6) {
      try {
        const res = await fetch("/api/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotemail, otp }),
        });

        const data = await res.json();
        if (data.success) {
          setIsEmailVerified(true);
          setVerifiedEmail(forgotemail);
          setOTPBOX(false);
          toast.success("Email verified ✅");
          // enable submit if passwords match
          if (password.length >= 8 && confirmPassword === password) setISVALID(true);
        } else {
          setIsEmailVerified(false);
          toast.error("Invalid OTP ❌");
        }
      } catch {
        toast.error("Something went wrong ❌");
      }
    }
  };

  //TO CHANGE PASSWORD
  const SUBMIT = () => {
    if (forgotemail.length === 0) {
      setforgotemailERROR("* This field is required");
      setISVALID(false);
    }
    if (password.length === 0) {
      setISVALID(false);
      setPASSWORDERROR("* This field is required");
    }
    if (confirmPassword.length === 0) {
      setISVALID(false);
      setconfirmpasserror("* This field is required");
    }

    if (!isEmailVerified) {
      toast.error("Please verify your email before changing password ❌");
      return;
    }

    if (
      forgotemail.length > 8 &&
      password.length >= 8 &&
      confirmPassword.length >= 8 &&
      forgotemail.endsWith("@gmail.com") &&
      password === confirmPassword &&
      isEmailVerified
    ) {
      try {
        const toastId = toast.loading("Changing password...");
        fetch("/api/forgot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotemail, password }),
        })
          .then((res) => res.json())
          .then((result) => {
            toast.dismiss(toastId);
            if (!result.error) {
              toast.success("Password changed successfully!");
            } else {
              toast.error(result.message || "Error");
            }
          });
      } catch {
        toast.error("Something went wrong ❌");
      }
    }
  };

  return (
   
    
        <div
         
          className={`relative z-10 border-2  border-blue-500 bg-[#3a506b]/20 rounded-2xl  sm:w-[400px] flex flex-col items-center justify-center
            transition-all duration-700 ease-in-out  h-[65vh] 
           `}
        >
          <h1 className={` text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500`}>
            Reset Password
          </h1>

          <div className={`w-full mb-3 relative `}>
            <p className="text-gray-300 w-full text-start text-sm pb-1">
              Enter your {OTPBOX ? "OTP" : "Email"}
            </p>

            <div className="relative flex gap-2">
              {OTPBOX ? (
                <>
                  {/* OTP */}
                  <input
                    value={otp}
                    type="tel"
                    placeholder=" OTP"
                    onChange={valotp}
                    className={`input text-white relative w-[85%] placeholder-gray-300 rounded-xl px-8 py-1.5 `}
                  />
                  {/* VERIFY */}
                  <button
                    onClick={verifyOtp}
                    className={`px-3 py-2 rounded-xl text-white text-[12px] ${
                      validotp
                        ? "bg-gradient-to-r from-amber-400 to-rose-500 hover:opacity-90"
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Verify
                  </button>
                </>
              ) : (
                <>
                  {/* Email */}
                  <input
                    value={forgotemail}
                    type="email"
                    placeholder=" Email"
                    onChange={valforgotemail}
                    className={`py-1.5  text-white relative w-[85%] placeholder-gray-300 rounded-xl px-8 input`}
                  />
                  {/* SEND OTP */}
                  <button
                    onClick={sendOtp}
                    className={` px-3 rounded-xl text-white text-[12px] ${
                      otpvalid
                        ? "bg-gradient-to-r from-amber-400 to-rose-500 hover:opacity-90"
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Send
                  </button>
                </>
              )}
            </div>
            {/* HASH AND MAIL ICON */}
            {OTPBOX ? <Hash className="absolute left-3 top-8 text-gray-300" size={18} /> : <Mail className=" absolute left-3 top-8 text-gray-300" size={18} />}
            {/* forgotemail ERROR */}
            <div className="text-red-400 text-sm">{forgotemailERROR}</div>
          </div>

          {/* New Password */}
          <div className={`w-full mb-3  relative `}>
            <p className="text-gray-300 text-sm pb-1">Enter your new password</p>
            <input
              className={` text-white w-full py-1.5 rounded-xl px-8 placeholder-gray-300 input`}
              placeholder="New password"
              type={ShowPasword ? "text" : "password"}
              value={password}
              onChange={PASSWORD}
            />
            {/* KEY Icon */}
            <KeyRound className="absolute left-3 top-8 text-gray-300" size={18} />
            {/* Show/Hide Password */}
            <button
              type="button"
              onClick={() => setShowPasword(!ShowPasword)}
              className="absolute right-3 top-8 text-gray-300"
            >
              {!ShowPasword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {/* PASSWORD ERROR */}
            <p className="text-red-400 text-sm mt-1">{PASSWORDERROR}</p>
          </div>

          {/* Confirm Password */}
          <div className={`w-full mb-3 relative  `}>
            <p className="text-gray-300 text-sm pb-1">Confirm password</p>
            <input
              className={`input text-white w-full py-1.5 rounded-xl px-8 placeholder-gray-300  `}
              placeholder="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={confirmpass}
            />
            {/* KEY Icon */}
            <KeyRound className="absolute left-3 top-8 text-gray-300" size={18} />
            {/* Show/Hide Confirm Password */}
            <button
              type="button"
              onClick={() => setshowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-8 text-gray-300 hover:text-white"
            >
              {!showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {/* CONFRIM PASSWORD ERROR */}
            <p className="text-red-400 text-sm mt-1">{confirmpasserror}</p>
          </div>

          {/* Submit */}
          <button
            onClick={SUBMIT}
            className={` w-[50%] py-1.5 text-white rounded-2xl text-lg ${
              ISVALID
                ? "bg-gradient-to-r from-amber-400 to-rose-500 hover:opacity-90"
                : "bg-gray-600 cursor-not-allowed"
            } `}
          >
            Submit
          </button>

          {/*  redirect */}
          <div
            className={` mt-3 text-sm text-gray-300 hover:text-white `}
            onClick={() => setIsFlipped(false)}
          >
            Back to Login
          </div>
        </div>
  
   
  );
};

export default Page;
