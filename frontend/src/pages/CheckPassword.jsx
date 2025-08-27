import { useEffect, useState } from "react";
// import { FaUserCircle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import { setToken } from "../redux/userSlice";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
export const CheckPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [data, setData] = useState({
    password: "",
  });
  console.log(location);

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, []);

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
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/password`;

    try {
      const response = await axios.post(
        URL,
        {
          userId: location?.state?._id,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("response", response);
      toast.success(response.data.message);
      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
      }

      if (response.data.message) {
        setData({
          password: "",
        });
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("error", error);

      if (error.response) {
        console.error("Server Error:", error.response.data.message);
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
        <div className="w-fit m-auto mb-2 flex justify-center items-center flex-col">
          <Avatar
            width={70}
            height={70}
            name={location.state.name}
            imageUrl={location.state.profile_pic}
            size={70}
          />
          <h2 className="font-semibold text-lg">{location?.state?.name}</h2>
        </div>
        <h3 className="ml-22 text-xl">Welcome to Chatify</h3>

        <form className="grid gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={data.password}
              placeholder="Enter your Password"
              className="bg-slate-100 px-2 py-1 focus:outline-[#00bac4]"
              onChange={handleOnChange}
            />
          </div>

          <button className="bg-[#00bac4] px-4 py-1 rounded hover:bg-[#0bcbd4] mt-2 font-bold text-white leading-relaxed tracking-wide">
            Login
          </button>
        </form>
        <p className=" my-3 mt-2 text-sm text-center">
          {" "}
          <Link
            to={"/forgor-password"}
            className="hover:text-[#00bac4] font-semibold"
          >
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
};

// export default CheckEmail;
