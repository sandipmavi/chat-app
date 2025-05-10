import { useRef, useState } from "react";
import Avatar from "./Avatar";
import { uploadFile } from "../helper/uploadFile";
import Divider from "./Divider";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user.name,
    profile_pic: user.profile_pic, // Reference user.profile_pic
  });
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };

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
    console.log("UploadPhoto:", uploadPhoto);

    setData((prev) => {
      return {
        ...prev,
        profile_pic: uploadPhoto?.url,
      };
    });
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
    <div className="fixed top-0 right-0 left-0 bg-gray-700 opacity-80 flex justify-center items-center w-full h-full z-10">
      <div className="bg-white p-4 m-1 rounded w-full max-w-sm">
        <h2 className="font-bold">Profile Details</h2>
        <p className="text-sm">Edit user details</p>

        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={data?.name || ""}
              name="name"
              onChange={handleOnChange}
              className="w-full py-1 px-2 focus:outline-[#00bac4] border-0.5"
            />
          </div>
          <div>
            <p>Profile Picture </p>

            <div className="my-1 flex items-center justify-around">
              <Avatar
                size={80}
                width={90}
                height={90}
                shadow={false}
                name={data.name}
                imageUrl={data.profile_pic}
              />
              <label htmlFor="profile_pic">
                <button
                  className="text-bold rounded-lg bg-slate-200 py-2 px-3 hover:bg-slate-300 "
                  onClick={handleOpenUploadPhoto}
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>

          <Divider />
          <div className=" flex gap-2 w-fit ml-auto">
            <button
              className="border-[#00bac4] text-[#00bac4] border px-4 py-1 rounded-lg hover:bg-[#00bac4] hover:text-white"
              onClick={() => onClose()}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="border-[#00bac4] bg-[#00bac4] text-white border px-4 py-1 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetails;
