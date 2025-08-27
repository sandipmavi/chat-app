import { MessageSquare } from "lucide-react"; // icon
import { motion } from "framer-motion";

export default function EmptyChatState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center w-full h-full text-center p-6 mt-4"
    >
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 text-accent shadow-md text-[var(--accent)]">
        <MessageSquare size={40} />
      </div>

      <h2 className="text-3xl font-semibold mt-6">No Chat Selected</h2>
      <p className="text-muted-foreground text-lg mt-2 max-w-md">
        Select a user from the sidebar to start a conversation.
      </p>
      <p className="text-muted-foreground text-md mt-2 max-w-md">
        Your messages will appear here once you begin chatting.
      </p>
    </motion.div>
  );
}
