"use client";
import { useContext, useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import { AuthContext } from "../context/authContext/AuthContext";
import Link from "next/link";
import axios from "axios";

function Header() {
  const AuthType = useContext(AuthContext);
  if (!AuthType) {
    return null;
  }

  const { logout, auth } = AuthType;
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [avatar, setAvatar] = useState(
    "https://cdn3.iconfinder.com/data/icons/web-design-and-development-2-6/512/87-1024.png"
  );

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!auth?.userId) return;

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/users/show/${auth.userId}`);
        if (res.data?.image) {
          setAvatar(res.data.image);
        }
      } catch {
        setAvatar("https://cdn3.iconfinder.com/data/icons/web-design-and-development-2-6/512/87-1024.png");
      }
    };

    fetchAvatar();
  }, [auth?.userId]);

  return (
    <div className="flex justify-between px-5 items-center py-3">
      <div className="flex gap-4 text-lg">
        <i className="fa-brands fa-instagram text-xl text-black transition-all duration-300 hover:text-gray-500 cursor-pointer"></i>
        <i className="fa-brands fa-square-twitter text-xl text-black transition-all duration-300 hover:text-gray-500 cursor-pointer"></i>
        <i className="fa-brands fa-square-facebook text-xl text-black transition-all duration-300 hover:text-gray-500 cursor-pointer"></i>
        <i className="fa-brands fa-youtube text-xl text-black transition-all duration-300 hover:text-gray-500 cursor-pointer"></i>
      </div>
      
      {auth?.token && (
        <div className="flex items-center gap-4 relative">
          <div 
            className="cursor-pointer border-2 border-transparent hover:border-gray-300 rounded-full transition-all"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img 
              src={avatar} 
              alt="User Avatar" 
              className="w-9 h-9 rounded-full bg-white object-cover"
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute top-14 right-0 bg-white shadow-lg rounded-md w-48 py-2 z-50 border border-gray-100">
              <Link
                href="/about"
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-medium flex items-center gap-3"
                onClick={() => setIsDropdownOpen(false)}
              >
                <i className="fa-solid fa-circle-info w-4 text-gray-500"></i> About
              </Link>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-medium flex items-center gap-3">
                <i className="fa-solid fa-gear w-4 text-gray-500"></i> Settings
              </button>
              <hr className="my-1 border-gray-200" />
              <button 
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm font-medium flex items-center gap-3"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsLogoutModalOpen(true);
                }}
              >
                <i className="fa-solid fa-right-from-bracket w-4"></i> Logout
              </button>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?"
        confirmText="Đăng xuất"
        confirmColor="red"
      />
    </div>
  );
}

export default Header;
