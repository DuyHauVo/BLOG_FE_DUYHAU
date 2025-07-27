import axios from "axios";
import { createContext, useEffect, useState, type ReactNode } from "react";

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
  const [loading, setLoading] = useState<boolean>(true);

  // Lấy từ localStorage khi load lại trang
  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      setAuth(JSON.parse(stored));
    }
    setLoading(false);
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
      localStorage.setItem("auth", JSON.stringify(datas));
      setAuth(datas);
    } catch (error) {
      console.log(error);
    }
  };
  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
  };

  const getAccess_Token = () => auth?.token || null;

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ auth, login, logout, getAccess_Token }}>
      {children}
    </AuthContext.Provider>
  );
};
