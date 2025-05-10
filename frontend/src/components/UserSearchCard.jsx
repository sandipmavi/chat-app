import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const UserSearchCard = ({ user, onClose }) => {
  return (
    <Link
      to={"/" + user?._id}
      onClick={onClose}
      className="flex gap-3 items-center mt-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border-[#00bac4] rounded"
    >
      <div>
        <Avatar
          width={40}
          height={40}
          size={37}
          name={user.name}
          shadow={false}
          imageUrl={user?.profile_pic}
          userId={user?._id}
        />
      </div>
      <div>
        <div className="font-bold text-ellipsis line-clamp-1">{user?.name}</div>
        <p className="text-sm text-ellipsis line-clamp-1 ">{user?.email}</p>
      </div>
    </Link>
  );
};

export default UserSearchCard;
