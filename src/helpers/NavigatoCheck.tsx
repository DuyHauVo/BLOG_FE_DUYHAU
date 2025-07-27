import { useContext } from "react";
import { AuthContext } from "../context/authContext/AuthContext";
import { Navigate } from "react-router-dom";

interface Prop {
  element: JSX.Element;
  ROLE: string;
}
function NavigatoCheck({ element, ROLE }: Prop) {
  const context = useContext(AuthContext);
  if (!context) return <Navigate to="/login" />;

  const { auth } = context;

  if (!auth) return <Navigate to="/login" />;

  if (ROLE.includes(auth.role)) {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
}

export default NavigatoCheck;
