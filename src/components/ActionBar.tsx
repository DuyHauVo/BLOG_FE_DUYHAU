"use client";
import { useContext, useEffect, useState, type FormEvent } from "react";
import { AuthContext } from "../context/authContext/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import ModalPost, { type PostFormData } from "../helpers/ModalPost";
import axios from "axios";
import { useNotification } from "../context/layoutContext/Alerts";

function ActionBar() {
  const authContext = useContext(AuthContext);
  const isLoggedIn = !!authContext?.auth?.token;
  const token = authContext?.auth?.token;
  const pathname = usePathname();
  const router = useRouter();
  const alerts = useNotification();

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchValue(new URLSearchParams(window.location.search).get("q") || "");
  }, [pathname]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const value = searchValue.trim();

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
    window.dispatchEvent(new CustomEvent("story-search-change", { detail: value }));
  };

  const handleWriteSubmit = async (data: PostFormData) => {
    try {
      // Sử dụng FormData để gửi kèm file ảnh thật
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);

      if (data.images && data.images.length > 0) {
        data.images.forEach((img) => {
          if (img instanceof File) {
            // Nếu là File mới chọn từ máy tính -> đưa vào mảng để upload
            formData.append("images", img);
          }
        });
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/api/posts/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alerts("Post created successfully!", "success");
      setIsWriteModalOpen(false);
      window.location.reload();
    } catch (error: any) {
      alerts(
        error?.response?.data?.message || "Failed to create post",
        "error"
      );
    }
  };

  if (
    pathname === "/about" ||
    pathname === "/contact" ||
    /^\/blog\/[^/]+$/.test(pathname)
  ) {
    return null;
  }

  return (
    <div className="bg-[#F7F5F0]">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-1 hidden sm:block"></div>
        
        <form onSubmit={handleSearch} className="flex-1 flex justify-center w-full">
          <div className="flex items-center w-full max-w-lg border border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow">
            <input
              type="text"
              placeholder="Search stories..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="px-4 py-2 outline-none w-full bg-transparent font-serif"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </form>

        <div className="flex-1 flex justify-end">
          {isLoggedIn && (
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="bg-black text-white px-5 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors whitespace-nowrap shadow-md"
            >
              <i className="fa-solid fa-pen-nib mr-2"></i> Write Story
            </button>
          )}
        </div>
      </div>

      <ModalPost
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmit={handleWriteSubmit}
        initialData={null}
      />
    </div>
  );
}

export default ActionBar;
