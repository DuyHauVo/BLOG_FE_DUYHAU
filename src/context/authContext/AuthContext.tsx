"use client";
import axios from "axios";
import { createContext, useEffect, useState, type ReactNode } from "react";
import type { interRegister } from "../../utills/interRegister";

// Kiểu dữ liệu login trả về từ BE
interface AuthData {
  token: string;
  userId: string;
  role: string;
}
// Kiểu context
interface AuthType {
  auth: AuthData | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: interRegister) => Promise<void>;
  logout: () => void;
  getAccess_Token: () => string | null;
}
// Tạo context
export const AuthContext = createContext<AuthType | undefined>(undefined);
// Props
interface AuthProp {
  children: ReactNode;
}
// Component Provider

export const AuthProvider = ({ children }: AuthProp) => {
  const [auth, setAuth] = useState<AuthData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    const hasToken = document.cookie.split('; ').find(row => row.startsWith('token='));
    
    if (stored && hasToken) {
      setAuth(JSON.parse(stored));
    } else {
      localStorage.removeItem("auth");
      setAuth(null);
    }
  }, []);

  // Hàm login: gọi API và lưu vào local
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post("http://localhost:7777/api/auths/login", {
        email,
        password,
      });
      const datas = {
        token: res.data.access_token,
        userId: res.data.user_ID,
        role: res.data.role,
      };
      document.cookie = `token=${res.data.access_token}; path=/; max-age=86400`;
      localStorage.setItem("auth", JSON.stringify(datas));
      setAuth(datas);
    } catch (error) {
      console.log(error);
    }
  };
  // Hàm register: gọi API và lưu vào local
  const register = async (data: interRegister) => {
    try {
      const res = await axios.post(`http://localhost:7777/api/auths/register`, {
        email: data.email,
        name: data.name,
        password: data.password,
        age: data.age,
      });
      const datas = {
        token: res.data.access_token,
        userId: res.data.user_ID,
        role: res.data.role,
      };
      document.cookie = `token=${res.data.access_token}; path=/; max-age=86400`;
      localStorage.setItem("auth", JSON.stringify(datas));
      setAuth(datas);
    } catch (error: any) {
      console.error(error);
    }
  };

  const logout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.removeItem("auth");
    setAuth(null);
    window.location.href = "/login";
  };

  const getAccess_Token = () => auth?.token || null;

  return (
    <AuthContext.Provider
      value={{ auth, login, register, logout, getAccess_Token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
