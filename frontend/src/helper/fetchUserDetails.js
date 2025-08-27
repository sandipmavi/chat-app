import axios from "axios";
import { setUser } from "../redux/userSlice"; // adjust path to your slice

export const fetchUserData = async (userId) => {
  const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`;
  try {
    const res = await axios.post(
      URL,
      { userId },
      {
        withCredentials: true,
      }
    );

    if (res.data.success) {
      return res.data.data;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
