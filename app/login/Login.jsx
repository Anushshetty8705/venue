"use client";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  Mail, KeyRound, EyeOff ,Eye} from "lucide-react";
import { FaFacebookF, FaGoogle, FaGithub } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";

export default function App({ setIsFlipped }) {
  const { data: session, status } = useSession();
    const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting},
  } = useForm();


  
  const router = useRouter();

  const onSubmit = async (data) => {
     try {
        const toastId = toast.loading("Logging in...");
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });
        const result = await res.json();
        toast.dismiss(toastId);

        if (result.error === false ) {
          toast.success("Login successful!", { theme: "dark" });
            router.push(`/${result.usr.adminUuid}`);
        } else {
          toast.error(result.message || "Login failed");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong ❌");
      }
  };

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

          if (res.ok && data.error === false) {
            console.log("Social user saved:", data);
            toast.success("Login successful", { theme: "dark" });
             router.push(`/${data.adminUuid}`);
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col  max-w-md w-80 mx-auto relative px-5 items-center justify-center gap-2"
    >
      <div className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500 text-2xl fo mb-2 font-extrabold">LOGIN</div>
     
      <div className="relative w-full">
         <p className="text-gray-300 text-sm pb-1 w-full text-start">
        Enter your Email
      </p>
        <input
          type="email"
          autoFocus
          placeholder="Enter email"
          {...register("email", {
            required: "Email is required",
            minLength: { value: 8, message: "Email 8 characters" },
            validate: (value) =>
              value.endsWith("@gmail.com") || "Email must be a Gmail address",
          })}
          className="p-2 input  focus:outline-none relative  text-white w-[100%] py-1.5  px-8 placeholder-gray-300 rounded-xl "
        />
        <Mail className=" left-3 bottom-2.5 absolute text-gray-300" size={18} />
      </div>
      {errors.email && (
        <span className="text-red-500 w-full text-start">
          {errors.email.message}
        </span>
      )}

     
      <div className="relative w-full">
         <p className="text-gray-300 text-sm pb-1 w-full text-start">
        Enter your Password
      </p>
        <input
              type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          className="p-2  relative input text-white w-full py-1.5 rounded-xl px-8 placeholder-gray-300 "
        />
        <KeyRound
          className=" left-3 bottom-3 absolute text-gray-300"
          size={18}
        />
       <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 bottom-2.5 text-gray-300 hover:text-white"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      </div>
      {errors.password && (
        <span className="text-red-500 w-full text-start ">
          {errors.password.message}
        </span>
      )}

      <div
        className="text-gray-300 hover:text-white cursor-pointer"
        onClick={() => setIsFlipped(true)}
      >
        Forgot Password?
      </div>

      <button
        type="submit"
         disabled={isSubmitting}
         className={`w-[40%] py-1.5 text-white rounded-2xl text-lg ${
        errors ? "bg-gradient-to-r from-amber-400 to-rose-500 hover:opacity-90"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
      <div className="text-white/80 ">or continue with</div>
      <div className="flex items-center justify-center gap-5 mt-1.5">
        {!session && (
          <>
            <button onClick={() => signIn("github")}>
              <FaGithub
                className="hi bg-white/10 p-2 rounded-full text-white/80 hover:bg-[#1c2541]/70"
                size={35}
              />
            </button>
            <button onClick={() => signIn("google")}>
              <FaGoogle
                className="hi bg-white/10 p-2 rounded-full text-white/80 hover:bg-[#1c2541]/70"
                size={35}
              />
            </button>
            <button onClick={() => signIn("facebook")}>
              <FaFacebookF
                className="hi bg-white/10 p-2 rounded-full text-white/80 hover:bg-[#1c2541]/70"
                size={35}
              />
            </button>
          </>
        )}
      </div>
    </form>
  );
}
