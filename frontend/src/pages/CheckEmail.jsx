import { useContext, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { AppContext } from "@/context/AppContext";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/userSlice";

export const CheckEmail = () => {
  const { setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  const location = useLocation();
  const dispatch = useDispatch();
  const [data, setData] = useState({ email: "", password: "" });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data, {
        withCredentials: true,
      });

      if (response.data.success) {
        setShowLogin(null);
        if (response.data.success) {
          console.log(response?.data.message);
          toast.success(response.data.message);
          dispatch(setToken(response?.data?.token));
          localStorage.setItem("token", response?.data?.token);
          localStorage.setItem("user", JSON.stringify(response.data.data));
        }
        navigate("/home");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit");
      console.error(error);
    }
  };

  return (
    <div className="w-full  flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative">
        <div className="flex justify-center mb-4">
          <FaUserCircle size={70} className="text-gray-400" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Welcome to ChatS
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your Creds to continue{" "}
          <span className="text-[var(--accent)] font-semibold">Chatify</span>
        </p>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              placeholder="you@example.com"
              className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--accent)] outline-none"
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={data.password}
              placeholder="*********"
              className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--accent)] outline-none"
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="w-full bg-[var(--accent)] hover:opacity-80 text-white font-semibold py-2 rounded-lg transition">
            Let&apos;s Go
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          New User?{" "}
          <Button
            onClick={() => setShowLogin("register")}
            to="/auth/register"
            className="cursor-pointer text-[var(--accent)] font-semibold hover:opacity-80"
          >
            Register
          </Button>
        </p>
      </div>
    </div>
  );
};
