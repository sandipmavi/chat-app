// src/layout/index.jsx
import { Outlet } from "react-router-dom";
import logo from "../assets/logo.png";

export const AuthLayouts = () => {
  return (
    <>
      <header className="flex justify-center items-center py-3 h-20 shadow-md bg-white">
        <img src={logo} alt="logo" width={180} height={60} />
      </header>

      <main className="flex justify-center items-center min-h-[calc(100vh-5rem)] bg-gray-50">
        <Outlet />
      </main>
    </>
  );
};
