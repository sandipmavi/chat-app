import timeAgo from "@/helper/timeCalc";
import { motion } from "framer-motion";
import { Image, Sparkles, Users, SquarePlay } from "lucide-react";

import { NavLink } from "react-router-dom";

function SidebarList({ allUser, setOpenSearchUser }) {
  const MotionNavLink = motion.create(NavLink);
  allUser.map((c, i) => console.log(c.lastMsg));
  return (
    <div className="flex-1 overflow-hidden">
      {allUser.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <div className="h-16 w-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-[var(--accent)]" />
          </div>
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            No Conversations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Start a new chat to see it appear here.
          </p>
          <button
            className="mt-4 px-4 py-2 rounded-xl bg-[var(--accent)] text-white hover:opacity-90 transition"
            onClick={() => setOpenSearchUser((prev) => !prev)}
          >
            Start New Chat
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200/60 dark:divide-slate-800/60 overflow-y-auto">
          {allUser.map((c, i) => (
            <MotionNavLink
              to={c?.userDetails._id}
              key={`${c._id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.03,
                type: "spring",
                stiffness: 260,
                damping: 22,
              }}
              className=" block p-4 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50   border border-slate-100 "
            >
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full bg-[var(--accent)]/15 flex items-center justify-center text-sm font-semibold text-[var(--accent)]">
                  {c?.group ? (
                    <Users className="h-4 w-4" />
                  ) : c?.bot ? (
                    <Sparkles className="h-4 w-4" />
                  ) : (
                    c?.userDetails.name.trim().split(" ")[0][0]
                  )}
                  {c?.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="truncate font-medium">
                      {c?.userDetails.name}
                    </p>
                    <span
                      className={`text-xs ${
                        c.unSeenMsg !== 0
                          ? "bg-[var(--accent)] rounded-3xl text-white p-2 "
                          : "text-slate-400"
                      } `}
                    >
                      {c.unSeenMsg !== 0
                        ? c.unSeenMsg
                        : timeAgo(c.lastMsg.createdAt)}
                    </span>
                  </div>
                  <div className="truncate text-sm text-slate-500 dark:text-slate-400 flex">
                    {c?.lastMsg.videoUrl && (
                      <p className="flex items-center gap-1">
                        <span>
                          <SquarePlay size={15} />
                        </span>
                        {!c.lastMsg?.text && <span>Video</span>}
                      </p>
                    )}
                    {c?.lastMsg.imageUrl && (
                      <p className="flex items-center gap-1 ">
                        <span>
                          <Image size={15} />
                        </span>
                        {!c.lastMsg?.text && <span>Image</span>}
                      </p>
                    )}
                    {c?.lastMsg.text && (
                      <p className="flex items-center gap-1">
                        <span>{c?.lastMsg.text}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </MotionNavLink>
          ))}
        </ul>
      )}
    </div>
  );
}
export default SidebarList;
