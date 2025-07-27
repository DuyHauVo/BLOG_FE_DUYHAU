// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
// đường dẫn tuỳ cấu trúc bạn

type Props = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: Props) => {
  const context = useContext(AuthContext);

  // Nếu context chưa khởi tạo (có thể do chưa bọc Provider), fallback về /login
  if (!context) return <Navigate to="/login" replace />;

  const { auth } = context;

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
