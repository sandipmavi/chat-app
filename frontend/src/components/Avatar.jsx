import React from "react";
import { FaCircleUser } from "react-icons/fa6";
import { useSelector } from "react-redux";
const Avatar = ({
  userId,
  name,
  imageUrl,
  width,
  height,
  size,
  shadow = true,
}) => {
  const onlineUser = useSelector((state) => state.user?.onlineUser);

  let avatarName = "";
  if (name) {
    const splitName = name.split(" ");
    if (splitName.length > 1) {
      avatarName = (splitName[0][0] + splitName[1][0]).toUpperCase();
    } else {
      avatarName = splitName[0][0].toUpperCase();
    }
  }
  const bgColor = [
    "bg-slate-200",
    "bg-red-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-orange-200",
    "bg-cyan-300",
    "bg-sky-300",
  ];
  const randomNum = Math.floor(Math.random() * 8);
  const isOnline = onlineUser.includes(userId);

  return (
    <div
      className={`text-slate-800  rounded-full relative  ${
        shadow && "shadow-lg"
      } border-[#00bac4] text-lg font-bold `}
      style={{
        width: width + "px",
        height: height + "px",
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          className=" rounded-full bg-cover bg-no-repeat bg-center"
        />
      ) : name ? (
        <div
          style={{
            width: width + "px",
            height: height + "px",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className={` rounded-full flex justify-center items-center ${bgColor[randomNum]}`}
        >
          {avatarName}
        </div>
      ) : (
        <FaCircleUser size={size} />
      )}
      {isOnline && (
        <div className="bg-green-500   p-1 absolute bottom-1 right-[0] rounded-full  border-2 border-white" />
      )}
    </div>
  );
};
export default Avatar;
