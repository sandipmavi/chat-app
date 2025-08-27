import { useContext, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { uploadFile } from "../helper/uploadFile";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "@/context/AppContext";
import { setToken } from "@/redux/userSlice";
import { useDispatch } from "react-redux";

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const { setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState(null);

  // ✅ Manage text inputs
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle image upload
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploaded = await uploadFile(file);
      setUploadPhoto(URL.createObjectURL(file)); // preview
      setData((prev) => ({ ...prev, profile_pic: uploaded?.url }));
    } catch (err) {
      toast.error("Upload failed. Try again!");
    }
  };

  const handleClearUpload = (e) => {
    e.preventDefault();
    setUploadPhoto(null);
    setData((prev) => ({ ...prev, profile_pic: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);
      console.log(response);
      if (response.data.success) {
        setShowLogin(null);
        dispatch(setToken(response.data.token));
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));

        setData({ name: "", email: "", password: "", profile_pic: "" });
        setUploadPhoto(null);
        navigate("/home");
        toast.success(response.data.message || "Registered successfully!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Create an Account
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Join <span className="text-[var(--accent)] font-semibold">ChatS</span>{" "}
        and start connecting 🚀
      </p>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={data.name}
            placeholder="Enter your name"
            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--accent)] outline-none"
            onChange={handleOnChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
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
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={data.password}
            placeholder="••••••••"
            className="px-3 py-2  rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--accent)] outline-none"
            onChange={handleOnChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Profile Photo
          </label>
          <div className="flex items-center gap-3">
            <label
              htmlFor="profile_pic"
              className="cursor-pointer text-[var(--accent)] flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:border-[var(--accent)] transition"
            >
              Upload
            </label>
            {uploadPhoto && (
              <div className="relative">
                <img
                  src={uploadPhoto}
                  alt="preview"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <button
                  onClick={handleClearUpload}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <IoClose size={14} />
                </button>
              </div>
            )}
          </div>
          <input
            type="file"
            id="profile_pic"
            accept="image/*"
            className="hidden"
            onChange={handleUploadPhoto}
          />
        </div>

        <button className="w-full bg-[var(--accent)] hover:opacity-80 text-white font-semibold py-2 rounded-lg transition">
          Register
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <span
          onClick={() => setShowLogin("login")}
          className="cursor-pointer text-[var(--accent)] font-semibold"
        >
          Login
        </span>
      </p>
    </div>
  );
};
