"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react"; //SIGIN SIGOUT LOGIN
import { Eye, EyeOff, Mail, KeyRound } from "lucide-react"; // added User + Lock icons
import { FaFacebookF, FaGoogle, FaGithub } from "react-icons/fa"; // SOCIAL PLATFORM FOR login
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Flip } from "react-toastify"; //TOAST

const Login = () => {
  const { data: session, status } = useSession(); //DATA FROM SOCIAL PLATFORM
  const [loginEmail, setLoginEmail] = useState(""); //FOR EMAIL
  const [loginPassword, setLoginPassword] = useState(""); //FOR PASSWORD
  const [logemailerror, setlogemailerror] = useState(""); //EMAIL ERROR
  const [logpasserror, setlogpasserror] = useState(""); //PASSWORD ERROR
  const [ShowPasword, setShowPasword] = useState(false); // SHOW AND HIDE PASSWORD
  const [isvaldemail, setisvaldemail] = useState(false); //CHECK VALID EMAIL FOR INPUT
  const [isvalidpass, setisvalidpass] = useState(false); //CHECK VALID PASSWORD FOR INPUT COLOUR
  const [validcred, setvalidcred] = useState(false); //CHECKING CREDTIONAL FOR LOGIN

  // SETTING EMAIL AND ERROR
  const valloginEmail = (e) => {
    setLoginEmail(e.target.value);
    if (e.target.value.length < 8) {
      setlogemailerror("Email must be at least 8 chars");
      setisvaldemail(false);
      setvalidcred(false); //CHECKING CREDTIONAL
    } else if (!e.target.value.endsWith("@gmail.com")) {
      setisvaldemail(false);
      setlogemailerror("Invalid email (must end with @gmail.com)");
      setvalidcred(false); //CHECKING CREDTIONAL
    } else {
      setisvaldemail(true);
      setvalidcred(true); //CHECKING CREDTIONAL
      setlogemailerror("");
    }
  };

  //  SETTING PASSWORD AND ERROR
  const valloginPassword = (e) => {
    setLoginPassword(e.target.value);
    if (e.target.value.length < 8) {
      setisvalidpass(false);
      setlogpasserror("Password must be at least 8 chars");
      setvalidcred(false); //CHECKING CREDTIONAL
    } else {
      setisvalidpass(true);
      setlogpasserror("");
      setvalidcred(true); //CHECKING CREDTIONAL
    }
  };

  const router = useRouter();
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
              Authprovider: "google facebook github"
            }),
          });
 toast.dismiss(toastId);
          const data = await res.json();
         
          if (res.ok && data.error === false) {
            toast.success(" Login sucess", { theme: "dark" });
            router.push('/dashboard');
          } else {
            toast.error(data.message || "Failed to save user ❌", {
              theme: "dark",
            });
          }
        } catch (err) {
          console.error("Error saving user:", err);
          toast.error("Server error ❌", { theme: "dark" });
        }
      };

      saveSocialUser();
    }
  }, [status, session, router]);
  // CHECKING FOR LOGIN
  const login = () => {
    if (loginPassword.length === 0) {
      setlogpasserror("* This field is required");
      setvalidcred(false);
    }

    if (loginEmail.length === 0) {
      setlogemailerror("* This field is required");
      setvalidcred(false);
    }
    if (
      loginPassword.length > 8 &&
      loginEmail.length > 8 &&
      loginEmail.endsWith("@gmail.com")
    ) {
      setvalidcred(true);
      try {
        const toastId = toast.loading("Logging in...");
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch("/api/login", requestOptions) // update endpoint here
          .then((response) => response.json())
          .then((result) => {
            console.log("Login API Response:", result);
            toast.dismiss(toastId);

            if (result.error === false) {
              toast.success("Login successful!");
              router.push('/dashboard');
            } else {
              toast.error(result.message || "Login failed");
            }
          });
      } catch {
        toast.error("something went Wrong");
      }
    }
  };

  return (
    <div className="h-full w-1/2 flex flex-col items-center justify-center ">
      <div className="text-white text-3xl font-semibold mb-4 animate-fade-in-down">
        LOGIN
      </div>

      {/* Email */}
      <div className="w-[80%] mb-4 relative animate-fade-in-down">
        <p className="text-white mr-40 text-sm pb-1">Enter your Email</p>
        <input
          value={loginEmail}
          onChange={valloginEmail}
          type="email"
          placeholder="Email"
          className={`bg-white/20  text-white w-full py-3 rounded-xl px-10 placeholder-gray-300 focus:outline-none focus:ring-2 ${
            isvaldemail ? "focus:ring-green-400 " : "focus:ring-red-400 "
          } `}
        />
        {/* MAIL ICON */}
        <Mail className="absolute left-3 top-9 text-gray-300" size={13} />
        {/* EMAIL ERROR */}
        <div className="text-red-400">{logemailerror}</div>
      </div>

      {/* Password */}
      <div className="w-[80%] mb-4 relative animate-fade-in-up">
        <p className="text-white mr-40 text-sm pb-1">Enter your Password</p>
        <input
          value={loginPassword}
          onChange={valloginPassword}
          type={ShowPasword ? "text" : "password"}
          placeholder="Password"
          className={`bg-white/20 w-full py-3 text-white rounded-xl px-11 placeholder-gray-300 focus:outline-none focus:ring-2 ${
            isvalidpass ? "focus:ring-green-400 " : "focus:ring-red-400 "
          }`}
        />
        {/* KEY ICON */}
        <KeyRound className="absolute left-3 top-8 text-gray-300" size={13} />
        {/* HIDE AND SHOW PASSWORD */}
        <button
          type="button"
          onClick={() => setShowPasword(!ShowPasword)}
          className="absolute right-3 top-8 text-gray-300"
        >
          {/* EYE ICON */}
          {!ShowPasword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
        <div>
          {/* PASSWORD ERROR */}
          <p className="text-red-400 mt-1">{logpasserror}</p>
        </div>
      </div>
      {/* ROUTTING TO FORGOT PASSWORD PAGE */}
      <Link
        href="/Forgot"
        className="text-gray-300 hover:text-white mb-4 animate-fade-in-up"
      >
        Forgot Password?
      </Link>
      {/* LOGIN */}
      <button
        className={`w-[60%] py-2.5 text-white animate-fade-in-up rounded-2xl text-xl ${
          validcred
            ? "bg-gradient-to-r from-red-400 to-pink-500 hover:opacity-90"
            : "bg-gray-600 cursor-not-allowed"
        }`}
        onClick={() => login()}
      >
        Login
      </button>

      <div className="text-white/80 my-4 animate-fade-in-down">
        or continue with
      </div>
      {/* SOCIAL PALTFORM */}
      <div>
        {!session && (
          <>
            <div className=" flex items-center justify-center gap-5 animate-fade-in-up">
              <button onClick={() => signIn("github")}>
                {" "}
                <FaGithub
                  className="hi bg-gray-200/10 p-2 rounded-full text-white/80 hover:bg-gray-800"
                  size={24}
                />
              </button>
              <button onClick={() => signIn("google")}>
                {" "}
                <FaGoogle
                  className="hi bg-gray-200/10 p-2 rounded-full text-white/80 hover:bg-gray-800"
                  size={24}
                />
              </button>
              <button onClick={() => signIn("facebook")}>
                {" "}
                <FaFacebookF
                  className="hi bg-gray-200/10 p-2 rounded-full text-white/80 hover:bg-gray-800"
                  size={24}
                />
              </button>
            </div>
          </>
        )}
        {session && <>
       <p className="text-white">{session.user.email}</p>
       <button onClick={() => signOut()} className="text-white">sign out</button>
        </>

        }
        
      </div>
    </div>
  );
};

export default Login;
