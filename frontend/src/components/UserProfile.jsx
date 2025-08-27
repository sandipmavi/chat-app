import { useSelector } from "react-redux";

export default function UserProfile({ user }) {
    
    
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 rounded-full bg-[var(--accent)]/15 flex items-center justify-center text-sm font-semibold text-[var(--accent)]">
        {user.profile_pic ? (
          <img src={user.profile_pic} alt="" className="rounded-xl" />
        ) : (
          user.name.trim().split(" ")[0]
        )}

        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900" />
      </div>
    </div>
  );
}
