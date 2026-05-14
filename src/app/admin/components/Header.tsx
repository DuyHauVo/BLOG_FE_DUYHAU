"use client";
import { useContext, useState } from "react";
import { menu_admin } from "../../../utills/contants";
import Link from "next/link";
import { AuthContext } from "../../../context/authContext/AuthContext";
import ConfirmModal from "../../../components/ConfirmModal";
const avatar: string =
  "https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/481662629_2103594593422935_2205736425749827801_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFEFMpekm4veVDh7AiClMCRLMmhcyMX4U4syaFzIxfhTpIdkFYO2EPhuxAX_ciA5wT_xGxdP0Yq4wXWLbDmx5Go&_nc_ohc=xEmsI62IZhEQ7kNvwHUlZpD&_nc_oc=AdlgrWP2SQaAukU1wi_Ys2wOQ0A3W-sJDOSieiNYuzaeTgYG5_9tuiRpoGVI44d6RcQ&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=agR_DjpxDYR6sOqzDmYVxA&oh=00_AfTntYk8zwd5P15pxGJYHkBDkIIdkTegtAXV1keu11EvKQ&oe=6888050B";

function Header() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [Open, setOpen] = useState<boolean>(false);

  const AuthType = useContext(AuthContext);
  if (!AuthType) {
    return null;
  }
  const { logout } = AuthType;
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  return (
    <div
      className="px-8 py-6 flex items-center justify-between flex-wrap relative z-10"
      style={{
        backgroundImage: "linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)",
      }}
    >
      {/* Logo */}
      <h1 className="text-5xl font-extrabold relative">
        MANAGER
        <p className="absolute -bottom-1/2 -right-1/2 -translate-x-3/4 -translate-y-1/3 text-base font-medium text-red-500">
          SIMPLE BLOG
        </p>
      </h1>

      {/* Search box - ẩn ở tablet trở xuống */}
      <div className="w-1/3 hidden lg:flex items-center">
        <input
          className="py-4 pl-5 rounded-s-md outline-none w-full pr-0"
          type="text"
          placeholder="Search"
        />
        <i className="fa-solid fa-magnifying-glass py-5 px-5 bg-slate-600 text-white rounded-e-md"></i>
      </div>

      {/* Desktop nav + avatar */}
      <div className="hidden lg:flex items-center space-x-3">
        <ul className="flex gap-6 bg-gray-100 p-4 rounded-md shadow-md items-center">
          {menu_admin?.map(
            (item: { path: string; title: string }, idx: number) => (
              <Link
                href={item.path}
                key={item.path}
                className="block text-gray-700 px-4 py-2 rounded hover:bg-red-500 cursor-pointer transition-all"
              >
                {item.title}
              </Link>
            )
          )}
        </ul>
        <div className="relative inline-block text-left">
          <img
            className="aspect-square h-[64px] w-[64px] object-cover rounded-md shadow-md cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_10px_8px_rgba(239,68,68,0.4)]"
            src={avatar}
            alt="Avatar"
            onClick={() => setOpen((prep) => !prep)}
          />

          {Open && (
            <div className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => alert("Go to settings")}
                >
                  Settings
                </button>
                <button
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => setIsLogoutModalOpen(true)}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hamburger icon - chỉ hiện ở mobile/tablet */}
      <div className="lg:hidden ml-auto z-20">
        <button onClick={() => setMenuOpen(true)}>
          <i className="fa-solid fa-bars text-2xl"></i>
        </button>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar menu mobile/tablet */}
      <div
        className={`fixed top-0 left-0 h-full bg-white z-20 shadow-lg transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } w-3/4 sm:w-[250px]`}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={() => setMenuOpen(false)}>
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
          </div>
          <ul className="flex flex-col gap-3">
            {menu_admin.map((item: { title: string; path: string }) => (
              <Link
                href={item.path}
                key={item.path}
                className="text-gray-700 px-4 py-2 rounded hover:bg-red-500 cursor-pointer transition-all"
              >
                {item.title}
              </Link>
            ))}
          </ul>
          <div className="pt-4 border-t">
            <img
              className="aspect-square  object-cover rounded-md shadow-md transition-shadow duration-300 hover:shadow-[0_0_10px_8px_rgba(239,68,68,0.4)] mx-auto"
              src={avatar}
              alt="Avatar"
            />
          </div>
        </div>
      </div>
      
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

