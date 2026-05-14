"use client";
import Link from "next/link";
import { menu_client } from "../utills/contants";
import Header from "./Header";
import { useContext } from "react";
import { AuthContext } from "../context/authContext/AuthContext";

function Navbar() {
  const authContext = useContext(AuthContext);
  const isLoggedIn = !!authContext?.auth?.token;
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Header />
      <h1 className="font-playwrite text-3xl text-center font-black leading-tight">
        NEWSPAPER
      </h1>
      <ul className="flex justify-center gap-10 text-xl py-4">
        {menu_client.map(
          (item: { path: string; title: string }, id: number) => (
            <Link
              href={item.path}
              key={item.path}
              className="relative group cursor-pointer"
            >
              {item.title}
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          )
        )}
        {isLoggedIn && (
          <Link
            href="/my-blog"
            className="relative group cursor-pointer"
          >
            My Blog
            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
          </Link>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
