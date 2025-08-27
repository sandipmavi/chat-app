export default function AvatarNew({ name, imageUrl, isOnline }) {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };
  return (
    <div className="flex items-center gap-3">
      <div
        className={`relative w-8 h-8  md:text-base lg:w-10 lg:h-10 lg:text-lg rounded-2xl bg-[var(--accent)]/15 flex items-center justify-center text-sm font-semibold text-[var(--accent)]`}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="" className="rounded-2xl" />
        ) : (
          name.trim().split(" ")[0][0]
        )}
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900" />
        )}
      </div>
    </div>
  );
}
