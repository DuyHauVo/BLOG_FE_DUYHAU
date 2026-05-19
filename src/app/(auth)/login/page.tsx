"use client";
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../context/authContext/AuthContext";
import { useNotification } from "../../../context/layoutContext/Alerts";

function Login() {
  interface AuthInput {
    email: string;
    password: string;
  }

  const router = useRouter();
  const [auth, setAuth] = useState<AuthInput>({
    email: "",
    password: "",
  });

  const Alertsnew = useNotification();
  const AuthType = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Safely destructure AuthType
  const { login, auth: contextAuth } = AuthType || {
    login: async () => {},
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
    setAuth({
      ...auth,
      [name]: value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(auth.email, auth.password);

      setTimeout(() => {
        const roles = localStorage.getItem("auth");
        if (roles) {
          const authData = JSON.parse(roles);

          if (authData.role == "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/");
          }
          Alertsnew("Login successful!", "success");
        } else {
          Alertsnew("Authentication data not found.", "error");
        }
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        Alertsnew(
          "Login failed. Please check your email or password.",
          "error",
        );
        setIsLoading(false);
      }, 1000);
    }
  };



  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#F7F5F0] z-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-gray-700">
          Logging in...
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gray-100 min-h-screen flex box-border justify-center items-center">
        <div className="bg-[#dfa674] rounded-2xl flex max-w-4xl p-5 items-center">
          <div className="md:w-1/2 px-8">
            <h2 className="font-bold text-3xl text-[#002D74]">Login</h2>
            <p className="text-sm mt-4 text-[#002D74]">
              If you already a member, easily log in now.
            </p>

            <form action="" className="flex flex-col gap-4">
              <input
                className="p-2 mt-8 rounded-xl border outline-none"
                type="email"
                name="email"
                value={auth.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <div className="relative">
                <input
                  className="p-2 rounded-xl border w-full outline-none"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={auth.password}
                  onChange={handleChange}
                  id="password"
                  placeholder="Password"
                />
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors z-20`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
              <button
                onClick={handleSubmit}
                className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium"
                type="submit"
              >
                Login
              </button>
            </form>

            <div className="mt-4 grid grid-cols-3 items-center text-gray-500">
              <hr className="border-gray-500" />
              <p className="text-center text-sm">HOẶC</p>
              <hr className="border-gray-500" />
            </div>

            <button
              type="button"
              className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 font-medium text-gray-600"
              onClick={() => {
                window.location.href = "http://localhost:7777/api/auths/google";
              }}
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Đăng nhập bằng Google
            </button>

            <div className="mt-10 text-sm border-b border-gray-500 py-5 playfair tooltip">
              <button className="hover:text-gray-100 hover:scale-105 duration-300">
                Forget password?
              </button>
            </div>

            <div className="mt-4 text-sm flex justify-between items-center container-mr">
              <p className="mr-3 md:mr-0 ">If you don't have an account..</p>
              <Link
                href={"/register"}
                className=" register text-white bg-[#002D74] hover:border-gray-400 rounded-xl py-2 px-5 hover:scale-150 hover:bg-green-400 font-semibold duration-300 hover:text-red-800"
              >
                Register
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

export default Login;
