import React, { useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Avatar = ({
  userId = "",
  name = "",
  imageUrl = "",
  width = 48,
  height = 48,
  size = 40,
  shadow = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const onlineUser = useSelector((state) => state.user?.onlineUser || []);
  const isOnline = onlineUser.includes(userId);

  // Generate initials
  const getInitials = () => {
    const splitName = name.trim().split(" ");
    if (splitName.length === 0) return "";
    if (splitName.length === 1) return splitName[0][0]?.toUpperCase();
    return (splitName[0][0] + splitName[1][0]).toUpperCase();
  };

  // Stable color based on name hash
  const bgColor = () => {
    const colors = [
      "bg-slate-200",
      "bg-red-200",
      "bg-green-200",
      "bg-blue-200",
      "bg-yellow-200",
      "bg-orange-200",
      "bg-cyan-300",
      "bg-sky-300",
    ];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-full overflow-hidden ${
        shadow ? "shadow-lg" : ""
      } border border-[#00bac4]`}
      style={{ width, height }}
    >
      {imageUrl && !imgError ? (
        <img
          src={imageUrl}
          alt={name}
          width={width}
          height={height}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : name ? (
        <div
          className={`w-full h-full flex items-center justify-center text-slate-800 text-lg font-bold ${bgColor()}`}
        >
          {getInitials()}
        </div>
      ) : (
        <FaCircleUser size={size} className="text-gray-400" />
      )}

      {isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      )}
    </div>
  );
};

export default Avatar;
