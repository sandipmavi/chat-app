import axios from "axios";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setUser,
  setOnlineUser,
  setSocketConnection,
} from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo.png";
import io from "socket.io-client";
import LandingPage from "./LandingPage";

export const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`;
      const response = await axios({ url: URL, withCredentials: true });
      dispatch(setUser(response.data.data));
      if (response.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
  const isChatSelected = location.pathname !== "/";

  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConnection.on("connect", () => {
      console.log("Socket connected: ", socketConnection.id);
    });
    socketConnection.on("onlineUser", (data) => {
      console.log("Data: ", data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return user ? (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Always visible on desktop, conditional on mobile */}
      <div
        className={`w-full lg:w-[280px] bg-white border-r border-gray-200 overflow-y-auto ${
          isChatSelected ? "hidden lg:block" : "block"
        }`}
      >
        <Sidebar />
      </div>

      <div className="flex-1 flex">
        {isChatSelected ? (
          // Show chat messages when a user is selected
          <div className="w-full">
            <Outlet />
          </div>
        ) : (
          // Show logo and message in desktop view only
          <div className="hidden lg:flex w-full items-center justify-center flex-col gap-4">
            <img src={logo} alt="logo" className="w-[250px] h-auto" />
            <p className="text-slate-500">Select a user to send a message</p>
          </div>
        )}
      </div>
    </div>
  ) : (
    <LandingPage />
  );
};
