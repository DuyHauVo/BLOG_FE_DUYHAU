// import { useState } from "react";
import "./App.css";
import Home from "./pages/admin/dashboard/Home";

function App() {
  return (
    <>
      <Home />
      <div className="bg-red-500 text-white text-center p-5">
        Nếu thấy nền đỏ thì Tailwind đã hoạt động!
      </div>
    </>
  );
}

export default App;
