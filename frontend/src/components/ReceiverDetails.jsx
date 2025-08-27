import { useEffect, useState } from "react";
import Avatar from "./Avatar";

import Divider from "./Divider";

import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import { fetchUserData } from "@/helper/fetchUserDetails";

const ReceiverDetails = ({ onClose, isOpen }) => {
  const params = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      if (params.userId) {
        const res = await fetchUserData(params.userId);
        setData(res);
      }
    };
    loadUser();
  }, [isOpen, params.userId]);
  console.log(data);

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

        <div className="grid gap-5 mt-5">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Profile Picture
            </p>
            <div className="flex items-center justify-center gap-6">
              <Avatar
                size={80}
                width={90}
                height={90}
                shadow={true}
                name={data?.name}
                imageUrl={data?.profile_pic}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Name
            </label>
            <div className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition">
              {data?.name}
            </div>
          </div>

          <Divider />
        </div>
      </div>
    </div>
  );
};

export default ReceiverDetails;
