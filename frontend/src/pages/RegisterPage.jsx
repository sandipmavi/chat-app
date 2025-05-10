// import React from "react";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { uploadFile } from "../helper/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState("");
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    console.log("UploadPhoto:", uploadPhoto);

    setUploadPhoto(file);
    setData((prev) => {
      return {
        ...prev,
        profile_pic: uploadPhoto?.url,
      };
    });
  };
  const handleClearUplaod = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);
      console.log("response", response);
      toast.success(response.data.message);

      if (response.data.message) {
        setUploadPhoto(null);
        setData({
          name: "",

          email: "",
          password: "",
          profile_pic: "",
        });
        navigate("/email");
      }
    } catch (error) {
      toast.error(error?.message);
      console.log("error", error);

      if (error.response) {
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        console.error("Network Error:", error.request);
      } else {
        console.error("Error Setting Up Request:", error.message);
      }
    }
    console.log("Data", data);
  };

  return (
    <div className="mt-5 ">
      <div className="bg-white w-full max-w-sm mx-2 rounded overflow-hidden p-4 mx-auto  ">
        <h3 className="ml-22 text-xl">Welcome to Chatify</h3>

        <form className="grid gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={data.name}
              placeholder="Enter your name"
              className="bg-slate-100 px-2 py-1 focus:outline-[#00bac4]"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-[#00bac4]"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={data.password}
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-[#00bac4]"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col gap-1 ">
            <label htmlFor="profile_pic">
              Photo:
              <div className="h-14 bg-slate-200 flex justify-center items-center cursor-pointer border hover:border-[#00bac4]">
                <p className="text-sm max-w-[300px] text-ecllipse line-clamp-1 ">
                  {uploadPhoto?.name
                    ? uploadPhoto.name
                    : "Upload Profile Photo"}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className="text-lg ml-2 hover:text-red-600"
                    onClick={handleClearUplaod}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-100 px-2 py-1 focus:outline-[#00bac4] hidden"
              onChange={handleUploadPhoto}
            />
          </div>
          <button className="bg-[#00bac4] px-4 py-1 rounded hover:bg-[#0bcbd4] mt-2 font-bold text-white leading-relaxed tracking-wide">
            Register
          </button>
        </form>
        <p className=" my-3 mt-2 text-sm text-center">
          Already have an account ?{" "}
          <Link to={"/email"} className="hover:text-[#00bac4] font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

//export default RegisterPage;
