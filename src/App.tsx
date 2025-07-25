import { Routes, Route } from "react-router-dom";

import Login from "./pages/client/login/Login";
// import Home from "./pages/admin/dashboard/Home";
import Register from "./pages/client/login/Register";
import Home from "./pages/client/home/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/*" element={<Home />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
