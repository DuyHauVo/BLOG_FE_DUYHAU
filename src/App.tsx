import { Routes, Route } from "react-router-dom";

import Login from "./pages/client/login/Login";
import Register from "./pages/client/login/Register";
import Home_client from "./pages/client/home/Home_Client";
import NavigatoCheck from "./helpers/NavigatoCheck";
import Home_Admin from "./pages/admin/dashboard/Home_Admin";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin/*"
        element={<NavigatoCheck ROLE={"ADMIN"} element={<Home_Admin />} />}
      />

      <Route
        path="/client/*"
        element={<NavigatoCheck ROLE={"USERS"} element={<Home_client />} />}
      />
    </Routes>
  );
}

export default App;
