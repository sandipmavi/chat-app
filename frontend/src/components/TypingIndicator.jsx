import { motion } from "framer-motion";
function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center text-slate-400 px-3">
      <motion.span
        className="h-2 w-2 rounded-full bg-current"
        animate={{ y: [0, -3, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "easeInOut",
          delay: 0,
        }}
      />
      <motion.span
        className="h-2 w-2 rounded-full bg-current"
        animate={{ y: [0, -3, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "easeInOut",
          delay: 0.15,
        }}
      />
      <motion.span
        className="h-2 w-2 rounded-full bg-current"
        animate={{ y: [0, -3, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />
      <span className="text-xs ml-2">Someone is typing…</span>
    </div>
  );
}
export default TypingIndicator;
