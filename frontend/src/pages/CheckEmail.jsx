import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";
export const CheckEmail = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);

      toast.success(response.data.message);

      if (response.data.message) {
        setData({
          email: "",
        });
        navigate("/password", {
          state: response.data.data,
        });
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
  };

  return (
    <div className="mt-5 ">
      <div className="bg-white w-full max-w-sm mx-2 rounded overflow-hidden p-4 mx-auto  ">
        <div className="w-fit m-auto mb-2">
          <FaUserCircle size={70} />
        </div>
        <h3 className="ml-22 text-xl">Welcome to Chatify</h3>

        <form className="grid gap-3" onSubmit={handleSubmit}>
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

          <button className="bg-[#00bac4] px-4 py-1 rounded hover:bg-[#0bcbd4] mt-2 font-bold text-white leading-relaxed tracking-wide">
            Let&apos;s Go
          </button>
        </form>
        <p className=" my-3 mt-2 text-sm text-center">
          New User ?{" "}
          <Link to={"/register"} className="hover:text-[#00bac4] font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

// export default CheckEmail;
