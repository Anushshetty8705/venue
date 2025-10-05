"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Eye, EyeOff, Mail, KeyRound } from "lucide-react";
import { FaFacebookF, FaGoogle, FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Login = ({ isFlipped, setIsFlipped, hover }) => {
  const { data: session, status } = useSession();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [logemailerror, setlogemailerror] = useState("");
  const [logpasserror, setlogpasserror] = useState("");
  const [ShowPassword, setShowPassword] = useState(false);
  const [isvaldemail, setisvaldemail] = useState(false);
  const [isvalidpass, setisvalidpass] = useState(false);
  const [validcred, setvalidcred] = useState(false);

  const router = useRouter();

  // Handle email input validation
  const valloginEmail = (e) => {
    setLoginEmail(e.target.value);
    if (e.target.value.length < 8) {
      setlogemailerror("Email must be at least 8 chars");
      setisvaldemail(false);
      setvalidcred(false);
    } else if (!e.target.value.endsWith("@gmail.com")) {
      setisvaldemail(false);
      setlogemailerror("Invalid email (must end with @gmail.com)");
      setvalidcred(false);
    } else {
      setisvaldemail(true);
      setvalidcred(true);
      setlogemailerror("");
    }
  };

  // Handle password input validation
  const valloginPassword = (e) => {
    setLoginPassword(e.target.value);
    if (e.target.value.length < 8) {
      setisvalidpass(false);
      setlogpasserror("Password must be at least 8 chars");
      setvalidcred(false);
    } else {
      setisvalidpass(true);
      setlogpasserror("");
      setvalidcred(true);
    }
  };

  // Social login: save user and redirect to dynamic admin dashboard
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const saveSocialUser = async () => {
        try {
          const toastId = toast.loading("Logging in...");
          const res = await fetch("/api/sociallogin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
              username: session.user.name || "SocialUser",
              Authprovider: "google facebook github",
            }),
          });
          const data = await res.json();
          toast.dismiss(toastId);

          if (res.ok && data.error === false && data.adminUuid) {
            toast.success("Login successful", { theme: "dark" });
            // Redirect to dynamic route
            router.push(`/${data.adminUuid}`);
          } else {
            toast.error(data.message || "Failed to save user ❌", { theme: "dark" });
          }
        } catch (err) {
          console.error("Error saving user:", err);
          toast.error("Server error ❌", { theme: "dark" });
        }
      };

      saveSocialUser();
    }
  }, [status, session, router]);

  // Email/password login
  const login = async () => {
    if (loginPassword.length === 0) setlogpasserror("* This field is required");
    if (loginEmail.length === 0) setlogemailerror("* This field is required");

    if (
      loginPassword.length >= 8 &&
      loginEmail.length >= 8 &&
      loginEmail.endsWith("@gmail.com")
    ) {
      setvalidcred(true);
      try {
        const toastId = toast.loading("Logging in...");
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });
        const result = await res.json();
        toast.dismiss(toastId);

        if (result.error === false && result.adminUuid) {
          toast.success("Login successful!", { theme: "dark" });
          router.push(`/${result.adminUuid}`); // dynamic route
        } else {
          toast.error(result.message || "Login failed");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong ❌");
      }
    }
  };

  return (
    <div className="w-1/2 flex flex-col items-center justify-center">
      <div
        className={`text-white text-2xl font-semibold ${
          hover ? "mb-3 animate-fade-in-center" : "mb-0"
        }`}
      >
        LOGIN
      </div>

      {/* Email */}
      <div
        className={`w-[80%] mb-3 relative ${
          !hover ? "hidden" : "animate-fade-in-center inline"
        }`}
      >
        <p className="text-white text-sm pb-1">Enter your Email</p>
        <input
          value={loginEmail}
          onChange={valloginEmail}
          type="email"
          placeholder="Email"
          className={`bg-white/20 text-white w-full py-1.5 rounded-xl px-8 placeholder-gray-300 focus:outline-none focus:ring-2 ${
            isvaldemail ? "focus:ring-green-400" : "focus:ring-red-400"
          }`}
        />
        <Mail className="absolute left-3 top-8 text-gray-300" size={18} />
        <div className="text-red-400 text-sm">{logemailerror}</div>
      </div>

      {/* Password */}
      <div
        className={`w-[80%] mb-3 relative ${
          !hover ? "hidden" : "inline animate-fade-in-center"
        }`}
      >
        <p className="text-white text-sm pb-1">Enter your Password</p>
        <input
          value={loginPassword}
          onChange={valloginPassword}
          type={ShowPassword ? "text" : "password"}
          placeholder="Password"
          className={`bg-white/20 w-full py-1.5 text-white rounded-xl px-8 placeholder-gray-300 focus:outline-none focus:ring-2 ${
            isvalidpass ? "focus:ring-green-400" : "focus:ring-red-400"
          }`}
        />
        <KeyRound className="absolute left-3 top-8 text-gray-300" size={18} />
        <button
          type="button"
          onClick={() => setShowPassword(!ShowPassword)}
          className="absolute right-3 top-8 text-gray-300"
        >
          {!ShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <p className="text-red-400 mt-1 text-sm">{logpasserror}</p>
      </div>

      {/* Forgot Password */}
      <div
        className={`text-gray-300 hover:text-white mb-2 ${
          !hover ? "hidden" : "animate-fade-in-center inline"
        }`}
        onClick={() => setIsFlipped(true)}
      >
        Forgot Password?
      </div>

      {/* Login Button */}
      <button
        className={`w-[50%] py-1.5 text-white rounded-2xl text-lg ${
          !hover ? "hidden" : "animate-fade-in-center inline"
        } ${
          validcred
            ? "bg-gradient-to-r from-red-400 to-pink-500 hover:opacity-90"
            : "bg-gray-600 cursor-not-allowed"
        }`}
        onClick={login}
      >
        Login
      </button>

      {/* Social Login */}
      <div className={`text-white/80 my-2 ${!hover ? "hidden" : "animate-fade-in-center inline"}`}>
        or continue with
      </div>
      <div className={`${!hover ? "hidden" : "animate-fade-in-center inline"}`}>
        {!session ? (
          <div className="flex items-center justify-center gap-5">
            <button onClick={() => signIn("github")}>
              <FaGithub className="bg-gray-200/10 p-2 rounded-full text-white/80 hover:bg-gray-800" size={35} />
            </button>
            <button onClick={() => signIn("google")}>
              <FaGoogle className="bg-gray-200/10 p-2 rounded-full text-white/80 hover:bg-gray-800" size={35} />
            </button>
            <button onClick={() => signIn("facebook")}>
              <FaFacebookF className="bg-gray-200/10 p-2 rounded-full text-white/80 hover:bg-gray-800" size={35} />
            </button>
          </div>
        ) : (
          <>
            <p className="text-white">{session.user.email}</p>
            <button onClick={() => signOut()} className="text-white">
              Sign out
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
