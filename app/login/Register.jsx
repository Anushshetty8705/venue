import { useForm } from "react-hook-form";
import { Eye, EyeOff, Hash, KeyRound, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaFacebookF, FaGoogle, FaGithub } from "react-icons/fa";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const router = useRouter();
  const [showOtpInput, setShowOtpInput] = useState(true);
  const [ShowPassword, setShowPassword] = useState(false)
  const [sendsubmt, setsendsubmt] = useState(false)
  const [verfedemal, setverfedemal] = useState("")
  const [sverfed, setsverfed] = useState(false)

  
  const { data: session, status } = useSession();

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

  //   send object emal  so used as data
  const sendOtp = async (data) => {
setsendsubmt(true)
    if (data.email.length === 0) {
      toast.error("Please enter your email ❌");
      setsendsubmt(false)
      return;
    }
    if (data.email.length <= 8 ) {
      toast.error("Please enter Valid Email ❌");
     setsendsubmt(false)
      return;
    }
     if(!data.email.endsWith("@gmail.com") ) {
      toast.error("Please enter Valid Emai ❌");
      setsendsubmt(false)
      return;
    }

    try {
      setverfedemal(data.email);
      toast.info("Sending OTP...");
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await res.json();

      if (res.ok && !result.error) {
        toast.dismiss();
        toast.success("OTP sent successfully 📧", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        setShowOtpInput(false);
       
      } else {
        toast.dismiss();
        toast.error(result.message || "Failed to send OTP ❌", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
       
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Something went wrong ❌", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      
    }
   setsendsubmt(false)
  };

  const verifyOtp = async (datas) => {
    if (datas.otp.length === 0) {
      toast.error("Please enter your OTP ❌");
      return;
    }
    if(datas.otp.length <6 ){
      toast.error("OTP must be 6 digits ❌");
      return;
    }
    if(datas.otp.length ===6){
      toast.info("Verifying OTP...");
       try {
      setsverfed(true)
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verfedemal, otp: datas.otp }),
      });
      console.log("Verifying OTP ");
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("OTP verified ✅", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        setShowOtpInput(true);
      } else {
        setShowOtpInput(true);
        toast.error(data.message || "Invalid OTP ❌", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      }
    } catch (err) {
      toast.error("Server error ❌", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
    }
   
  };
  

  const onSubmit = (data) =>{
 
    if(data.email!==verfedemal && sverfed===false){
          toast.error("Verfy emal frst");
          return;
    }

    const toastId = toast.loading("Signing.....");
      fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.email,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          toast.dismiss(toastId);
           console.log(result.usr.adminUuid)
          if (result.error === "false") {
           
            toast.success("Signed up successfully!");
            router.push(`/${result.usr.adminUuid}`);
          } else {
            toast.error(result.message || "Signup failed");
          }
        })
        .catch((err) => console.error(err));
  } 

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="h-full w-1/2 flex flex-col items-center justify-center gap-1.5 relative px-5 rounded-2xl shadow-lg text-white "
    >
      <div className=" text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">REGISTER</div>
      {/* username */}
      <div className="relative w-full">
        <p className="text-gray-300 pb-1 w-full text-start text-sm ">
          Enter your Name
        </p>
        <input
          type="text"
          placeholder="Enter your Username"
          className={`input w-full py-1.5 text-white placeholder-gray-400 rounded-xl px-8 `}
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 5,
              message: "Username must be at least 5 characters",
            },
          })}
        />
        {errors.username && (
          <span className="text-red-500 w-full text-start  text-sm">
            {" "}
            {errors.username.message}{" "}
          </span>
        )}
        <User className="absolute left-3 top-8 text-gray-400" size={18} />
      </div>

      {/* otp emal */}
      <div className="relative w-full">
        <p className="text-gray-300 pb-1 w-full text-start text-sm ">
          {showOtpInput ? "Enter your Email" : "Enter your OTP"}
        </p>
        {showOtpInput ? (
          <>
            <div className="flex w-full gap-2">
              <input
                type="email"
                className={` text-white w-full placeholder-gray-400 rounded-xl px-8 py-1.5 input `}
                placeholder="Enter email"
                {...register("email", {
                  required: "Email is required",
                  minLength: { value: 8, message: "Email 8 characters" },
                  validate: (value) =>
                    value.endsWith("@gmail.com") ||
                    "Email must be a Gmail address",
                })}
              />
              <button
               disabled={sendsubmt? true:false}
                onClick={() => {
                  sendOtp({ email: watch("email") });
                }}
                className={`px-3 rounded-xl text-white text-[12px] ${
                  !errors.email
                    ? "bg-gradient-to-r from-amber-400 to-rose-500 hover:opacity-90"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
          
              >
                Send
              </button>
            </div>
            {errors.email && (
              <span className="text-red-500 w-full text-start text-sm">
                {errors.email.message}
              </span>
            )}
          </>
        ) : (
          <>
            <div className="flex w-full gap-2">
              <input
                type="number"
                placeholder="Enter your OTP"
                className={`input w-full py-1.5 text-white placeholder-gray-400 rounded-xl px-8 `}
                {...register("otp", {
                  required: "OTP is required",
                  validate: (value) => {
                    return (
                      value.length === 6 || "OTP must be exactly 6 characters"
                    );
                  },
                })}
              />{" "}
              <button
                onClick={() =>
                  verifyOtp({ otp: watch("otp") })
                }
                className={`px-3 rounded-xl text-white text-[12px] ${
                  !errors.otp
                    ? "bg-gradient-to-r from-amber-400 to-rose-500 hover:opacity-90"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                Verify
              </button>
            </div>
            {errors.otp && (
              <span className="text-red-500 w-full text-start text-sm">
                {errors.otp.message}
              </span>
            )}
          </>
        )}
        {showOtpInput ? (
          <Mail className="absolute left-3 top-8 text-gray-400" size={18} />
        ) : (
          <Hash className="absolute left-3 top-8 text-gray-400" size={18} />
        )}
      </div>
      {/* password */}
      <div className="relative w-full">
        <p className="text-gray-300 pb-1 w-full text-start text-sm ">
          Enter your password
        </p>
        <input
            type={ShowPassword ? "text" : "password"}
          placeholder="Enter your password"
          className={`input w-full py-1.5 text-white placeholder-gray-400 rounded-xl px-8 `}
          {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "password must be atleast 8 characters",
          },
        })}
      />
      <KeyRound className="absolute left-3 top-8 text-gray-400" size={18} />
      {errors.password && (
        <span className="text-red-500 w-full text-start text-sm">
          {errors.password.message}
        </span>
      )}
       <button
          type="button"
         
          onClick={() => setShowPassword(!ShowPassword)}
          className="absolute right-3 top-8 text-gray-400"
        >
          {!ShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
       </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-[40%] py-1.5 text-white rounded-2xl text-md bg-gradient-to-r from-amber-400 to-rose-500 hover:opacity-90 ${
          !errors && 
             "bg-gray-600 cursor-not-allowed"
        }`}
      >
       {isSubmitting ? "Registering..." : "Register"}
      </button>
      <div className="text-white/80">or continue with</div>
      <div className="flex items-center justify-center gap-5 ">
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
