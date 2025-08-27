import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import moment from "moment";
import { X } from "lucide-react";

export default function MessageViewport({ allMessage, message, setMessage }) {
  //const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const currentMessage = useRef(null);
  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  return (
    <div className="overflow-y-auto p-4 space-y-2 scroll-smooth ">
      {allMessage.map((msg, i) => (
        <motion.div
          ref={currentMessage}
          key={msg._id}
          initial={{ opacity: 0, x: msg.me ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.02 }}
          className={`max-w-[75%] md:max-w-[40%] rounded-2xl shadow-sm text-lg flex ${
            msg.imageUrl || msg.videoUrl ? "flex-col" : "flex-row"
          } items-center ${
            msg.msgByUserId === user._id
              ? "ml-auto bg-[var(--accent)] text-white"
              : "bg-slate-50 dark:bg-slate-800/70"
          }`}
        >
          <div>
            {msg.imageUrl && (
              <div className="bg-white rounded-lg overflow-hidden">
                <img src={msg.imageUrl} alt="Message" className="w-full" />
              </div>
            )}
            {msg.videoUrl && (
              <div className="bg-white rounded-lg overflow-hidden">
                <video src={msg.videoUrl} controls className="w-full" />
              </div>
            )}
          </div>

          <div
            className={`flex items-center justify-center  
              `}
          >
            <div>
              {msg.text && (
                <p className="px-3 py-2 text-sm leading-relaxed">{msg.text}</p>
              )}
            </div>
            <div className="text-xs px-2 py-2">
              {moment(msg.createdAt).format("hh:mm A")}
            </div>
          </div>
        </motion.div>
      ))}

      {(message.imageUrl || message.videoUrl) && (
        <div className="relative w-full max-w-full sm:max-w-lg rounded-2xl bg-transparent dark:bg-slate-800 shadow-xl border border-slate-200  dark:border-slate-700 overflow-auto">
          {/* Close button */}
          <button
            onClick={() =>
              setMessage((prev) => ({
                ...prev,
                imageUrl: "",
                videoUrl: "",
              }))
            }
            className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/70 transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image preview */}
          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt="Preview"
              className="w-full max-h-96 object-contain rounded-lg"
            />
          )}

          {/* Video preview */}
          {message.videoUrl && (
            <video
              src={message.videoUrl}
              controls
              autoPlay
              muted
              className="w-full max-h-96 rounded-lg object-contain"
            />
          )}
        </div>
      )}
    </div>
  );
}
