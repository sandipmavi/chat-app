import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { uploadFile } from "../helper/uploadFile";
import Divider from "./Divider";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import { X, Camera } from "lucide-react";

const EditUserDetailsNew = ({ onClose, isOpen }) => {
  const user = useSelector((state) => state.user);
  console.log("EditUser---->", user);
  const [data, setData] = useState({
    name: user.name,
    profile_pic: user.profile_pic,
  });
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };

  useEffect(() => {
    setData({
      name: user?.name || "",
      profile_pic: user?.profile_pic || "",
    });
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);

    setData((prev) => ({
      ...prev,
      profile_pic: uploadPhoto?.url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/update`;

    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: data,
        withCredentials: true,
      });
      toast.success(response.data.message);

      dispatch(setUser(response.data.data));
      onClose();
    } catch (error) {
      toast.error(error.response?.data.message);
      console.log("error", error);
    }
  };

  return (
    <div
      className="fixed top-14 right-5 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full  max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-[var(--accent)]">
          Profile Details
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Edit user details
        </p>

        <form className="grid gap-5 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={data?.name || ""}
              name="name"
              onChange={handleOnChange}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Profile Picture
            </p>
            <div className="flex items-center gap-6">
              <Avatar
                size={80}
                width={90}
                height={90}
                shadow={true}
                name={data.name}
                imageUrl={data.profile_pic}
                userId={data._id}
              />
              <button
                className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                onClick={handleOpenUploadPhoto}
              >
                <Camera className="w-4 h-4" />
                Change Photo
              </button>
              <input
                type="file"
                id="profile_pic"
                className="hidden"
                onChange={handleUploadPhoto}
                ref={uploadPhotoRef}
              />
            </div>
          </div>

          <Divider />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetailsNew;
