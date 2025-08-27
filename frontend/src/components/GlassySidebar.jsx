import { Plus, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import SidebarList from "./SideBarList";
import { useSelector } from "react-redux";

import { useEffect, useState } from "react";
import { getSocket } from "@/services/socketService";
import SearchUser from "./SearchUserNew";

export default function GlassySidebar({ className = "flex flex-col h-full" }) {
  const user = useSelector((state) => state?.user);

  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);

  const socket = getSocket();
  useEffect(() => {
    if (socket) {
      socket.emit("sidebar", user._id);
      socket.on("conversation", (data) => {
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
  }, [socket, user]);
  return (
    <Card
      className={`md:rounded-3xl shadow-md bg-white/70 dark:bg-slate-900/60 backdrop-blur border-slate-200/70 dark:border-slate-800/70 ${className}`}
    >
      <CardContent className="p-0 flex flex-col h-full min-h-0">
        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 flex justify-between items-center flex-shrink-0">
          <div className="font-semibold">Chats</div>
          <Button
            onClick={() => setOpenSearchUser((prev) => !prev)}
            size="sm"
            className="rounded-2xl bg-[var(--accent)] hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-1" /> New
          </Button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <SidebarList
            allUser={allUser}
            setOpenSearchUser={setOpenSearchUser}
          />
        </div>

        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 flex-shrink-0">
          <Button
            variant="secondary"
            className="w-full rounded-2xl flex items-center gap-2 bg-gray-200"
          >
            <Users className="h-4 w-4" /> Create Group
          </Button>
        </div>
      </CardContent>
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser((prev) => !prev)} />
      )}
    </Card>
  );
}
