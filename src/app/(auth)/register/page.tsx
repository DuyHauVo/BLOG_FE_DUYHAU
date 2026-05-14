"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../context/authContext/AuthContext";
import type { interRegisterClient } from "../../../utills/interRegister";
import { useNotification } from "../../../context/layoutContext/Alerts";

function Register() {
  const innerRegister = {
    email: "",
    name: "",
    password: "",
    age: "",
  };
  const [registerData, setRegisterData] =
    useState<interRegisterClient>(innerRegister);
  const [checkpass, setCheckpass] = useState<string>("");
  const AuthType = useContext(AuthContext);
  const router = useRouter();
  const Alertsnew = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCheckpass, setShowCheckpass] = useState(false);

  // Safely destructure AuthType
  const { register, auth: contextAuth } = AuthType || {
    register: async () => {},
    auth: null,
  };

  useEffect(() => {
    if (contextAuth) {
      if (contextAuth.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [contextAuth, router]);

  if (!AuthType) {
    return null;
  }

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setRegisterData({ ...registerData, [name]: value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (registerData.password != checkpass) {
        return Alertsnew("Please confirm your password again.", "error");
      }
      setIsLoading(true);

      await register(registerData);

      setTimeout(() => {
        const roles = localStorage.getItem("auth");
        if (roles) {
          const authData = JSON.parse(roles);
          if (authData.role !== "ADMIN") {
            Alertsnew("Login successful!", "success");
            router.push("/");
          } else {
            Alertsnew("Login failed!", "error");
          }
        } else {
          Alertsnew("Authentication data not found.", "error");
        }
        setIsLoading(false);
      }, 1000);
    } catch (error: any) {
      console.error(error);
      setTimeout(() => {
        Alertsnew("Registration failed. Please try again.", "error");
        setIsLoading(false);
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#F7F5F0] z-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-gray-700">
          Registering...
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gray-100 min-h-screen flex box-border justify-center items-center">
        <div className="bg-[#dfa674] rounded-2xl flex max-w-4xl p-5 items-center">
          <div className="md:w-1/2 px-8">
            <h2 className="font-bold text-3xl text-[#002D74]">Register</h2>
            <p className="text-sm mt-4 text-[#002D74]">
              If you do not have an account, please register now
            </p>

            <form action="" className="flex flex-col gap-4">
              <input
                className="p-2 mt-8 rounded-xl border outline-none"
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleChange}
                placeholder="Useremail"
              />
              <input
                className="p-2 rounded-xl border outline-none"
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                className="p-2 rounded-xl border outline-none"
                type="text"
                name="age"
                value={registerData.age}
                onChange={handleChange}
                placeholder="age"
              />
              <div className="relative">
                <input
                  className="p-2 rounded-xl border w-full outline-none"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={registerData.password}
                  onChange={handleChange}
                  id="password"
                  placeholder="Password"
                />
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors z-20`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
              <div className="relative">
                <input
                  className="p-2 rounded-xl border w-full outline-none"
                  type={showCheckpass ? "text" : "password"}
                  name="checkpass"
                  value={checkpass}
                  onChange={(e) => setCheckpass(e.target.value)}
                  placeholder="Confirm Password"
                />
                <i
                  className={`fa-solid ${showCheckpass ? "fa-eye-slash" : "fa-eye"} absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors z-20`}
                  onClick={() => setShowCheckpass(!showCheckpass)}
                ></i>
              </div>
              <button
                className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium"
                onClick={handleSubmit}
              >
                Register
              </button>
            </form>

            <div className="mt-4 text-sm flex justify-between items-center container-mr">
              <p className="mr-3 md:mr-0 ">If you don't have an account..</p>

              <Link
                href={"/login"}
                className=" register text-white bg-[#002D74] hover:border-gray-400 rounded-xl py-2 px-5 hover:scale-125 hover:bg-green-400 font-semibold duration-300 hover:text-red-800"
              >
                Login
              </Link>
            </div>
          </div>
          <div className="md:block hidden w-1/2">
            <img
              className="rounded-2xl max-h-[1600px]"
              src="https://images.unsplash.com/photo-1552010099-5dc86fcfaa38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxmcmVzaHxlbnwwfDF8fHwxNzEyMTU4MDk0fDA&ixlib=rb-4.0.3&q=80&w=1080"
              alt="login form image"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;
