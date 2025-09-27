"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, KeyRound, Mail, Hash } from "lucide-react"; // added User + Lock icons
import { toast, Flip } from "react-toastify"; //TOAST

const Page = () => {
  const [forgotemail, setforgotemail] = useState(""); //FOR forgotemail
  const [forgotemailERROR, setforgotemailERROR] = useState(""); // FOR forgotemail ERROR
  const [OTPBOX, setOTPBOX] = useState(false); // TO SHOW OTP INPUT BOX
  const [ISVALID, setISVALID] = useState(false); //FOR LOGIN BUTTON
  const [otpvalid, setotpvalid] = useState(false); //FOR CEHCKING OTP VALID FOR INPUT BOX AND VERIFY
  const [otp, setotp] = useState(""); // FOR OTP
  const [validotp, setvalidotp] = useState(false); //to check email ADDRESS and send otp BUTTTON
  const [verifiedEmail, setVerifiedEmail] = useState(""); // TO STORE  THE VALUE OF OTP forgotemail

  const [ShowPasword, setShowPasword] = useState(false); //SHOW AND HIDE PASSWORD
  const [showConfirmPassword, setshowConfirmPassword] = useState(false); //SHOW AND HIDE CONFIRM PASSWORD

  const [password, setLoginPassword] = useState(""); //FOR PASSWORD
  const [PASSWORDERROR, setPASSWORDERROR] = useState("");
  const [ISVALID_PASS, setISVALID_PASS] = useState(false);

  const [confirmPassword, setconfirmPassword] = useState("");
  const [confirmpasserror, setconfirmpasserror] = useState("");
  const [ISVALIDconfirmpass, setISVALIDconfirmpass] = useState(false);

  // SETTING forgotemail AND ERROR
  const valforgotemail = (e) => {
    setforgotemail(e.target.value);
    if (e.target.value.length < 8) {
      setISVALID(false);
      setotpvalid(false);
      setforgotemailERROR("email must be 8 char");
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
    setconfirmPassword(e.target.value);
    if (e.target.value.length < 8) {
      setISVALIDconfirmpass(false);
      setconfirmpasserror("Password must be at least 8 chars");
      setISVALID(false);
    }
     else if(e.target.value!==password){
        setconfirmpasserror("Password don't match");
     }
    else {
      setISVALIDconfirmpass(true);
      setconfirmpasserror("");
      // setvalidcred(true)
      setISVALID(true);
    }
  };

  // PASSWORD
  const PASSWORD = (e) => {
    setLoginPassword(e.target.value);
    if (e.target.value.length < 8) {
      setISVALID_PASS(false);
      setISVALID(false);
      setPASSWORDERROR("Password must be at least 8 chars");
      // setvalidcred(false)
    } else {
      setISVALID_PASS(true);
      setPASSWORDERROR("");
      // setvalidcred(true)
      setISVALID(true);
    }
  };

  // SENDING OTP
  const sendOtp = async () => {
    if (forgotemail.length > 8 && forgotemail.endsWith("@gmail.com")) {
      try {
        setVerifiedEmail(forgotemail); // only this email is marked verified

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
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // 👈 fix
        body: JSON.stringify({ email: forgotemail, otp }),
      });

      const data = await res.json();
      {
        setOTPBOX(false);
      }

      toast.success("Email verfied");
    }

    // will show "OTP verified ✅" or "Invalid OTP ❌"
  };

  //TO CHANGE PASSWORD
  const SUBMIT = () => {
    if (forgotemail.length === 0) {
      setforgotemailERROR("* This field is required");
      setISVALID(false);
    }

    if (confirmPassword.length == 0) {
      setISVALID(false);
      setconfirmpasserror("* This field is required");
    }
    if (password.length == 0) {
      setISVALID(false);
      setPASSWORDERROR("* This field is required");
    }
    //     if (forgotemail !== verifiedEmail) {
    //   toast.error("Please verify your current email before registering ❌");
    //   return; // stop registration
    // }

    // verifiedEmail === forgotemail
    if (
      forgotemail.length > 8 &&
      password.length > 8 &&
      confirmPassword.length > 8 &&
      forgotemail.endsWith("@gmail.com")
    ) {
      // verifiedEmail === forgotemail
      try {
        const toastId = toast.loading("Changing password...");
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
          email: forgotemail,
          password: confirmPassword,
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch("/api/forgot", requestOptions) // update endpoint here
          .then((response) => response.json())
          .then((result) => {
            console.log("Login API Response:", result);
            toast.dismiss(toastId);

            if (result.error === false) {
              toast.success("Changed  successful!");
            } else {
              toast.error(result.message || "Error");
            }
          });
      } catch {
        toast.error("something went Wrong");
      }
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
<div className="  bg-black  border-4  border-gray-900  rounded-[50] w-[35%] relative flex items-center justify-center h-[75%] ">
        <div className="box relative z-20 border-4 border-gray-900   bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-[40%] sm:w-[400px] flex flex-col items-center">
       
          <h1 className="text-white text-2xl font-semibold mb-3 animate-fade-in-down">
            Reset Password
          </h1>

          <div className="w-full mb-3 relative">
            <p className="text-white mr-40 text-sm pb-1">
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
                    onChange={(e) => valotp(e)}
                    className={`bg-white/20 text-white relative w-[85%]  placeholder-gray-300 rounded-xl px-8 py-1.5 focus:outline-none focus:ring-2 ${
                      !validotp
                        ? " focus:ring-red-400"
                        : " focus:ring-green-400"
                    }`}
                  />
                  {/* VERIFY */}
                  <button
                    onClick={verifyOtp}
                    className={`px-3 py-2 rounded-xl text-white text-[12px] ${
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
                  {/* Email */}
                  <input
                    value={forgotemail}
                    type="email"
                    placeholder=" Email"
                    onChange={(e) => valforgotemail(e)}
                    className={` animate-fade-in-down py-1.5  bg-white/20  text-white relative w-[85%]  placeholder-gray-300 rounded-xl px-8 focus:outline-none focus:ring-2  ${
                      !otpvalid ? "focus:ring-red-400" : "focus:ring-green-400"
                    }   `}
                  />
                  {/* SEND OTP */}
                  <button
                    onClick={sendOtp}
                    className={`animate-fade-in-down px-3 rounded-xl text-white text-[12px] ${
                      otpvalid
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
            {OTPBOX ? (
              <Hash className="absolute left-3 top-8 text-gray-300" size={18} />
            ) : (
              <Mail
                className="animate-fade-in-down absolute left-3 top-8 text-gray-300"
                size={18}
              />
            )}
            {/* forgotemail ERROR */}
            <div className="text-red-400 text-sm">{forgotemailERROR}</div>
          </div>

          {/* New Password */}
          <div className="w-full mb-3 relative animate-fade-in-up">
            <p className="text-white text-sm pb-1">Enter your new password</p>
            <input
              className={`bg-white/20  text-white w-full py-1.5 rounded-xl px-8 placeholder-gray-300 focus:outline-none focus:ring-2 ${
                ISVALID_PASS ? "focus:ring-green-400 " : "focus:ring-red-400 "
              } `}
              placeholder="New password"
              type={ShowPasword ? "text" : "password"}
              value={password}
              onChange={PASSWORD}
            />
            {/* KEY Icon */}
            <KeyRound
              className="absolute left-3 top-8 text-gray-300"
              size={18}
            />
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
          <div className="w-full mb-3 relative animate-fade-in-down">
            <p className="text-white text-sm pb-1">Confirm password</p>
            <input
              className={`bg-white/20  text-white w-full py-1.5 rounded-xl px-8 placeholder-gray-300 focus:outline-none focus:ring-2 ${
                ISVALIDconfirmpass
                  ? "focus:ring-green-400 "
                  : "focus:ring-red-400 "
              } `}
              placeholder="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => confirmpass(e)}
            />
            {/* KEY Icon */}
            <KeyRound
              className="absolute left-3 top-8 text-gray-300"
              size={18}
            />
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
            onClick={() => SUBMIT()}
            className={`animate-fade-in-down w-[50%] py-1.5 text-white rounded-2xl text-lg ${
              ISVALID
                ? "bg-gradient-to-r from-red-400 to-pink-500 hover:opacity-90"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Submit
          </button>

          {/*  redirect */}
          <Link
            href="/login"
            className="animate-fade-in-up mt-3 text-sm text-gray-300 hover:text-white"
          >
            Back to Login
          </Link>
      

      </div>
        </div>
    </div>
  );
};

export default Page;
