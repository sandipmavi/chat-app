import { BsChatLeftTextFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from "./SearchUser";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import EditUserDetails from "./EditUserDetails";

import { FaImage, FaVideo } from "react-icons/fa6";
import { logout } from "../redux/userSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);
      socketConnection.on("conversation", (data) => {
        const conversationUserData = data.map((convUser, index) => {
          if (convUser.sender?._id === convUser.reciever?._id) {
            return {
              ...convUser,
              userDetails: convUser.sender,
            };
          } else if (convUser.reciever?._id !== user?._id) {
            return {
              ...convUser,
              userDetails: convUser.reciever,
            };
          } else {
            return {
              ...convUser,
              userDetails: convUser.sender,
            };
          }
        });
        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/email");
    localStorage.clear();
  };

  return (
    <div className="w-full h-full flex bg-white">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg flex flex-col justify-between">
        <div>
          <NavLink
            className={(isActive) =>
              ` w-12 h-12 flex rounded-tr-lg justify-center items-center hover:bg-slate-200 cursor-pointer mb-2 ${
                isActive && "bg-slate-300"
              }`
            }
            title="chat"
          >
            {" "}
            <BsChatLeftTextFill size={25} />
          </NavLink>
          <div
            className=" w-12 h-12 rounded flex justify-center items-center hover:bg-slate-200 cursor-pointer"
            title="Add friend"
            onClick={() => setOpenSearchUser(true)}
          >
            {" "}
            <FaUserPlus size={25} />
          </div>
        </div>

        <div className="mb-2 flex flex-col items-center">
          <button
            onClick={() => setEditUserOpen(true)}
            className="mx-1 mb-2"
            title={user.name}
          >
            <Avatar
              size={37}
              width={40}
              height={40}
              shadow={false}
              name={user.name}
              imageUrl={user.profile_pic}
              userId={user?._id}
            />
          </button>
          <button
            className="w-12 h-12 rounded flex justify-center items-center hover:bg-slate-200 cursor-pointer mb-2 text-red-500"
            title="Logout"
            onClick={handleLogout}
          >
            <MdLogout size={28} />
          </button>
        </div>
      </div>
      <div className="h-full w-full">
        <div className="h-16 flex items-center">
          <h2 className="p-4 font-bold text-xl text-slate-700 h-16 ">
            Message
          </h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>
        <div className=" h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length === 0 && (
            <div className="mt-20">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <GoArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-500 ">
                Explore users to start the conversation
              </p>
            </div>
          )}

          {allUser.map((conv, index) => {
            return (
              <NavLink
                to={"/" + conv.userDetails._id}
                key={conv?._id}
                className="flex items-center gap-3 px-2 py-3  hover:bg-slate-100 cursor-pointer border border-slate-100 "
              >
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails.profile_pic}
                    name={conv.userDetails.name}
                    userId={conv.userDetails._id}
                    size={35}
                    height={40}
                    width={40}
                    shadow={false}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base ">
                    {conv?.userDetails.name}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1 ">
                    <div className="flex items-center gap-1">
                      {conv?.lastMsg.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaImage size={15} />
                          </span>
                          {!conv.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaVideo size={15} />
                          </span>
                          {!conv.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {conv.unSeenMsg !== 0 && (
                  <p className="text-xs ml-auto p-1 mr-1 text-white font-semibold rounded-full bg-green-400 w-6 h-6 flex items-center justify-center">
                    {conv?.unSeenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
