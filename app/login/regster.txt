"use client";
import { Eye, EyeOff, Hash, KeyRound, Mail, User } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Flip } from "react-toastify";

const Register = () => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [regUserError, setRegUserError] = useState("");
  const [regEmailError, setRegEmailError] = useState("");
  const [regPassError, setRegPassError] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isUserValid, setIsUserValid] = useState(false);
  const [isPassValid, setIsPassValid] = useState(false);
  const [validOtp, setValidOtp] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const router = useRouter();

  const validateUsername = (e) => {
    setRegisterUsername(e.target.value);
    if (e.target.value.length < 5) {
      setRegUserError("Username must be at least 5 characters");
      setIsValid(false);
      setIsUserValid(false);
    } else {
      setIsUserValid(true);
      setIsValid(true);
      setRegUserError("");
    }
  };

  const validateEmail = (e) => {
    setRegisterEmail(e.target.value);
    if (e.target.value.length < 8) {
      setIsValid(false);
      setIsEmailValid(false);
      setRegEmailError("Email must be at least 8 characters");
    } else if (!e.target.value.endsWith("@gmail.com")) {
      setIsValid(false);
      setIsEmailValid(false);
      setRegEmailError("Invalid email (must end with @gmail.com)");
    } else {
      setIsValid(true);
      setRegEmailError("");
      setIsEmailValid(true);
    }
  };

  const validatePassword = (e) => {
    setRegisterPassword(e.target.value);
    if (e.target.value.length < 8) {
      setRegPassError("Password must be at least 8 characters");
      setIsValid(false);
      setIsPassValid(false);
    } else {
      setRegPassError("");
      setIsValid(true);
      setIsPassValid(true);
    }
  };

  const validateOtp = (e) => {
    setOtp(e.target.value);
    setValidOtp(e.target.value.length === 6);
  };

  const sendOtp = async () => {
    if (registerEmail.length > 8 && registerEmail.endsWith("@gmail.com")) {
      try {
        const res = await fetch("/api/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: registerEmail }),
        });
        if (res.ok) {
          toast.success("OTP sent successfully 📧", { position: "top-right", autoClose: 3000, theme: "dark", transition: Flip });
          setShowOtpInput(true);
        } else {
          toast.error("Failed to send OTP ❌", { position: "top-right", autoClose: 3000, theme: "dark", transition: Flip });
        }
      } catch (err) {
        toast.error("Something went wrong ❌", { position: "top-right", autoClose: 3000, theme: "dark", transition: Flip });
      }
    }
  };

  const verifyOtp = async () => {
    if (otp.length === 6) {
      try {
        const res = await fetch("/api/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: registerEmail, otp }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success("OTP verified ✅", { position: "top-right", autoClose: 3000, theme: "dark", transition: Flip });
          setShowOtpInput(false);
          setVerifiedEmail(registerEmail);
        } else {
          setShowOtpInput(false);
          toast.error(data.message || "Invalid OTP ❌", { position: "top-right", autoClose: 3000, theme: "dark", transition: Flip });
        }
      } catch (err) {
        toast.error("Server error ❌", { position: "top-right", autoClose: 3000, theme: "dark", transition: Flip });
      }
    }
  };

  const registerConfirm = () => {
      console.log("good")
    if (registerEmail.length === 0) setRegEmailError("* This field is required");
    if (registerUsername.length === 0) setRegUserError("* This field is required");
    if (registerPassword.length === 0) setRegPassError("* This field is required");
    if (registerEmail !== verifiedEmail) {
      toast.warning("Please verify your current email before registering ❌");
      return;
    }

    if (
      registerEmail.length > 8 &&
      registerUsername.length > 5 &&
      registerPassword.length > 8 &&
      registerEmail.endsWith("@gmail.com") &&
      verifiedEmail === registerEmail
    ) {
      console.log("good")
      const toastId = toast.loading("Signing.....");
      fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerUsername,
          password: registerPassword,
          email: registerEmail,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          toast.dismiss(toastId);
          if (result.error === "false") {
            toast.success("Signed up successfully!");
            router.push("/dashboard");
          } else {
            toast.error(result.message || "Signup failed");
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="h-full w-1/2 flex flex-col items-center justify-center relative gap-2 bg-[#0f172a] p-5 rounded-2xl shadow-lg">
      <div className="text-white text-2xl font-bold mb-4 animate-fade-in-down">REGISTER</div>

      {/* Username */}
      <div className="w-[80%] mb-3 relative animate-fade-in-up">
        <p className="text-gray-300 mr-40 text-sm pb-1">Enter your Name</p>
        <input
          type="text"
          placeholder="Name"
          value={registerUsername}
          onChange={validateUsername}
          className={`bg-[#1e293b] w-full py-1.5 text-white placeholder-gray-400 rounded-xl px-8 focus:outline-none focus:ring-2 ${
            !isUserValid ? "focus:ring-red-500" : "focus:ring-purple-500"
          }`}
        />
        <User className="absolute left-3 top-8 text-gray-400" size={18} />
        <div className="text-red-500 text-sm">{regUserError}</div>
      </div>

      {/* Email / OTP */}
      <div className="w-[80%] mb-3 relative animate-fade-in-down">
        <p className="text-gray-300 mr-40 text-sm pb-1">{showOtpInput ? "OTP" : "Email"}</p>
        <div className="relative flex gap-2">
          {showOtpInput ? (
            <>
              <input
                value={otp}
                type="tel"
                placeholder="OTP"
                onChange={validateOtp}
                className={`bg-[#1e293b] text-white w-[80%] placeholder-gray-400 rounded-xl px-8 py-1.5 focus:outline-none focus:ring-2 ${
                  !validOtp ? "focus:ring-red-500" : "focus:ring-purple-500"
                }`}
              />
              <button
                onClick={verifyOtp}
                className={`px-3 rounded-xl text-white text-[12px] ${
                  validOtp ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90" : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                Verify
              </button>
            </>
          ) : (
            <>
              <input
                value={registerEmail}
                type="email"
                placeholder="Email"
                onChange={validateEmail}
                className={`bg-[#1e293b] w-[80%] py-1.5 text-white placeholder-gray-400 rounded-xl px-8 focus:outline-none focus:ring-2 ${
                  !isEmailValid ? "focus:ring-red-500" : "focus:ring-purple-500"
                }`}
              />
              <button
                onClick={sendOtp}
                className={`px-3 rounded-xl text-white text-[12px] ${
                  isEmailValid ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90" : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                Send
              </button>
            </>
          )}
        </div>
        {showOtpInput ? (
          <Hash className="absolute left-3 top-8 text-gray-400" size={18} />
        ) : (
          <Mail className="absolute left-3 top-8 text-gray-400" size={18} />
        )}
        <div className="text-red-500 text-sm">{regEmailError}</div>
      </div>

      {/* Password */}
      <div className="w-[80%] mb-3 relative animate-fade-in-down">
        <p className="text-gray-300 text-sm pb-1">Enter your Password</p>
        <input
          value={registerPassword}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={validatePassword}
          className={`bg-[#1e293b] w-full py-1.5 text-white placeholder-gray-400 rounded-xl px-8 focus:outline-none focus:ring-2 ${
            !isPassValid ? "focus:ring-red-500" : "focus:ring-purple-500"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-8 text-gray-400"
        >
          {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <KeyRound className="absolute left-3 top-8 text-gray-400" size={18} />
        <div className="text-red-500 text-sm">{regPassError}</div>
      </div>

      {/* Register Button */}
      <button
        onClick={registerConfirm}
        className={`w-[40%] py-2 text-white rounded-2xl text-lg ${
          isValid ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90" : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        Register
      </button>
    </div>
  );
};

export default Register;
