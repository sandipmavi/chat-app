import { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ThemeContext } from "@/context/ThemeContext";

import { Moon, Sun, Settings, MessageSquare } from "lucide-react";
import AccentPicker from "./AccentPicker";
import AvatarNew from "./AvatarNew";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "@/redux/userSlice";
import { LogOut, X } from "lucide-react";
import EditUserDetailsNew from "./EditUserDetailsNew";
import UserProfile from "./UserProfile";
import { fetchUserData } from "@/helper/fetchUserDetails";
import { toast } from "react-toastify";

function HeaderBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const handleLogout = () => {
    if (window.confirm("do you want to logout?")) {
      dispatch(logout());
      navigate("/");
      toast.success("Logout Successful");
      localStorage.clear();
    }
  };
  const user = useSelector((state) => state.user);

  return (
    <div className="sticky md:rounded-3xl top-0 z-40 backdrop-blur bg-white/60 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 shadow-sm">
            <MessageSquare className="h-5 w-5" />
          </span>
          <div className="text-2xl text-[var(--accent)] font-semibold tracking-tight">
            ChatS
          </div>
          <span className="ml-2 mt-2 text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30">
            connect
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-2xl">
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl hover:scale-105 duration-150"
            onClick={() => setOpenModal((prev) => !prev)}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <div onClick={() => setEditUserOpen((prev) => !prev)}>
            <UserProfile user={user} />
          </div>
        </div>
      </div>
      {openModal && !editUserOpen && (
        <div
          className="fixed top-14 right-5  z-50 w-[300px] flex items-center justify-end bg-black/20 backdrop-blur-sm rounded-2xl "
          onClick={() => setOpenModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-[250px]  rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col"
          >
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-[var(--accent)] mb-2">
              Accent Picker
            </h2>
            <div className="w-full h-px bg-slate-200 dark:bg-slate-700 mb-4" />

            <div className=" p-1 flex-1 overflow-auto">
              <AccentPicker />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleLogout()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-600/10 dark:text-red-400 dark:hover:bg-red-600/20 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {editUserOpen && !openModal && (
        <EditUserDetailsNew
          isOpen={editUserOpen}
          onClose={() => setEditUserOpen(false)}
        />
      )}
    </div>
  );
}
export default HeaderBar;
