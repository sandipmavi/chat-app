import { ArrowLeft, Sparkle, Users } from "lucide-react";
import { Button } from "./ui/button";
// import Avatar from "./Avatar2";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ReceiverDetails from "./ReceiverDetails";
import { useSelector } from "react-redux";

function ChatHeader({ userData }) {
  const navigate = useNavigate();
  const [openDetails, setOpenDetails] = useState(false);
  const onlineUser = useSelector((state) => state.user?.onlineUser || []);
  const isOnline = onlineUser.includes(userData?._id);

  return (
    <div className="px-4  border-b  border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
      <div className="flex items-center justify-center gap-3">
        <div className=" md:hidden " onClick={() => navigate("/home")}>
          <ArrowLeft />
        </div>
        <div className="rounded-full bg-[var(--accent)]/15 flex items-center justify-center text-[var(--accent)] mb-4">
          {userData?.group && <Users className="h-4 w-4" />}
          {userData?.bot && <Sparkle className="h-4 w-4" />}

          {
            <Avatar
              name={userData?.name}
              imageUrl={userData?.profile_pic}
              userId={userData._id}
            />
          }
        </div>
        <div className="mb-3">
          <div className="text-xl font-semibold">{userData?.name}</div>
          <div
            className={`text-xs  ${
              isOnline ? "text-[var(--accent)]" : "text-slate-500"
            } `}
          >
            {userData?.group
              ? "4 members"
              : isOnline
              ? "Active now"
              : "Offline"}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="rounded-2xl"
          onClick={() => setOpenDetails((prev) => !prev)}
        >
          Details
        </Button>
      </div>
      {openDetails && (
        <ReceiverDetails
          isOpen={openDetails}
          onClose={() => setOpenDetails(false)}
        />
      )}
    </div>
  );
}
export default ChatHeader;
