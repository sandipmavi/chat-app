// import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initSocket, disconnectSocket } from "../services/socketService";
import { setUser, setOnlineUser, setToken } from "../redux/userSlice";
// import Sidebar from "../components/Sidebar";
// import logo from "../assets/logo.png";
//import io from "socket.io-client";

import AppRedesignShell from "@/components/AppRedesignShell";

export const Home = () => {
  const dispatch = useDispatch();

  const location = useLocation();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    dispatch(setUser(storedUser));
  }
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    dispatch(setToken(storedToken));
  }

  //const user = useSelector((state) => state.user);

  // const fetchUserDetails = async () => {
  //   try {
  //     const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`;
  //     const response = await axios({ url: URL, withCredentials: true });
  //     dispatch(setUser(response.data.data));
  //     if (response.data.logout) {
  //       dispatch(logout());
  //       navigate("/email");
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserDetails();
  // }, []);
  const isChatSelected = location.pathname !== "/home";

  // useEffect(() => {
  //   const socketConnection = io(import.meta.env.VITE_BACKEND_URL, {
  //     auth: {
  //       token: localStorage.getItem("token"),
  //     },
  //   });

  //   socketConnection.on("connect", () => {
  //     console.log("Socket connected: ", socketConnection.id);
  //   });
  //   socketConnection.on("onlineUser", (data) => {
  //     console.log("Data: ", data);
  //     dispatch(setOnlineUser(data));
  //   });

  //   dispatch(setSocketConnection(socketConnection));

  //   return () => {
  //     socketConnection.disconnect();
  //   };
  // }, []);
  //const token = localStorage.getItem("token");

  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    if (token) {
      const socket = initSocket(token);

      socket.on("connect", () => {
        console.log("✅ Connected with socket ID:", socket.id);
      });

      socket.on("onlineUser", (data) => {
        dispatch(setOnlineUser(data));
      });
    }

    return () => {
      disconnectSocket();
    };
  }, [token]);

  return (
    <div>
      <AppRedesignShell isChatSelected={isChatSelected} />
    </div>

    // <div className="flex h-screen bg-gray-50">
    //   <div
    //     className={`w-full lg:w-[280px] bg-white border-r border-gray-200 overflow-y-auto ${
    //       isChatSelected ? "hidden lg:block" : "block"
    //     }`}
    //   >
    //     <Sidebar />
    //   </div>

    //   <div className="flex-1 flex">
    //     {isChatSelected ? (
    //       <div className="w-full">
    //         <Outlet />
    //       </div>
    //     ) : (
    //       <div className="hidden lg:flex w-full items-center justify-center flex-col gap-4">
    //         <img src={logo} alt="logo" className="w-[250px] h-auto" />
    //         <p className="text-slate-500">Select a user to send a message</p>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
};
