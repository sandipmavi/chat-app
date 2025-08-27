import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import ComposerBar from "./ComposerBar";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import ChatHeader from "./ChatHeader";
import MessageViewport from "./MessageViewPort";
import { getSocket } from "@/services/socketService";
import EmptyChatState from "./EmptyChat";

export default function AnimatedStage({ className = "" }) {
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    _id: "",
    name: "",
    profile_pic: "",
    online: false,
  });

  const [allMessage, setAllMessage] = useState([]);

  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });

  const socket = getSocket();
  useEffect(() => {
    if (socket) {
      socket.emit("message-page", params.userId);

      socket.on("message-user", (data) => {
        setDataUser(data);
      });
      console.log("Socket connected-->", socket.connected);
      socket.on("connect", () => {
        console.log("Socket connected event fired");
      });
      socket.emit("seen", params.userId);

      socket.on("message", (data) => {
        setAllMessage(data);
      });
    }

    return () => {
      if (socket) {
        socket.off("message");
        socket.off("message-user");
      }
    };
  }, [socket, params?.userId, user]);

  return (
    //   <Card
    //     className={`md:rounded-3xl shadow-md bg-white/80 dark:bg-slate-900/60 backdrop-blur border-slate-200/70 dark:border-slate-800/70 ${className}`}
    //   >
    //     {" "}
    //     {!params.userId ? (
    //       <CardContent>
    //         <EmptyChatState />
    //       </CardContent>
    //     ) : (
    //       <CardContent className="p-0 h-full min-h-0 flex flex-col">
    //         <AnimatePresence mode="wait">
    //           <motion.div
    //             key={location.pathname}
    //             initial={{ opacity: 0, y: 8 }}
    //             animate={{ opacity: 1, y: 0 }}
    //             exit={{ opacity: 0, y: -8 }}
    //             transition={{ type: "spring", stiffness: 260, damping: 22 }}
    //             className="h-full min-h-0 grid grid-rows-[auto,1fr,auto]"
    //           >
    //             <ChatHeader userData={dataUser} />

    //             <div className="min-h-0 overflow-y-auto">
    //               <MessageViewport
    //                 allMessage={allMessage}
    //                 message={message}
    //                 setMessage={setMessage}
    //               />
    //             </div>

    //             <ComposerBar
    //               setLoading={setLoading}
    //               message={message}
    //               setMessage={setMessage}
    //             />
    //           </motion.div>
    //         </AnimatePresence>
    //       </CardContent>
    //     )}
    //   </Card>
    // );
    <Card
      className={`md:rounded-3xl shadow-md bg-white/80 dark:bg-slate-900/60 backdrop-blur border-slate-200/70 dark:border-slate-800/70 ${className}`}
    >
      {!params.userId ? (
        <CardContent>
          <EmptyChatState />
        </CardContent>
      ) : (
        <CardContent className="p-0 h-full min-h-0 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="flex flex-col h-full min-h-0"
            >
              {/* fixed height */}
              <ChatHeader userData={dataUser} />

              {/* takes all remaining space */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <MessageViewport
                  allMessage={allMessage}
                  message={message}
                  setMessage={setMessage}
                />
              </div>

              {/* fixed height */}
              <ComposerBar
                setLoading={setLoading}
                message={message}
                setMessage={setMessage}
              />
            </motion.div>
          </AnimatePresence>
        </CardContent>
      )}
    </Card>
  );
}
