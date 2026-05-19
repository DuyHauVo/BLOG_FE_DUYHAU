"use client";

import { useEffect, useContext, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "../../../context/authContext/AuthContext";
import { useNotification } from "../../../context/layoutContext/Alerts";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const AuthType = useContext(AuthContext);
  const Alertsnew = useNotification();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    const user_ID = searchParams.get("user_ID");

    if (token && role && user_ID) {
      // Lưu thông tin đăng nhập vào localStorage
      const authData = {
        token: token,
        userId: user_ID,
        role: role,
      };
      localStorage.setItem("auth", JSON.stringify(authData));

      // Lưu token vào cookie để middleware.ts không chặn redirect
      document.cookie = `token=${token}; path=/; max-age=86400`;

      // Cập nhật AuthContext nếu có hàm setAuth
      if (AuthType && (AuthType as any).setAuth) {
        (AuthType as any).setAuth(authData);
      }

      Alertsnew("Đăng nhập bằng Google thành công!", "success");

      // Chuyển hướng người dùng dựa trên role
      if (role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } else {
      Alertsnew("Lỗi đăng nhập qua Google. Thiếu dữ liệu xác thực.", "error");
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#F7F5F0] z-50">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-gray-700">
        Đang xử lý đăng nhập Google...
      </p>
    </div>
  );
}

export default function GoogleCallback() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#F7F5F0] z-50">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-gray-700">
            Loading...
          </p>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
