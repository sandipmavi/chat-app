// import { getSocket } from "@/services/socketService";
// import AIHintButton from "./AIHintButton";
// import { Button } from "./ui/button";
// import { Image, Paperclip, Send, SquarePlay, X } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { useState } from "react";
// import { uploadFile } from "@/helper/uploadFile";

// function ComposerBar({ setLoading, message, setMessage }) {
//   const socket = getSocket();
//   const user = useSelector((state) => state.user);
//   const params = useParams();
//   const [openImageUpload, setOpenImageUpload] = useState(false);

//   const handleFileUpload = async (e, type) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setLoading(true);
//     const upload = await uploadFile(file);
//     setMessage((prev) => ({ ...prev, [type]: upload.url }));
//     setLoading(false);
//     setOpenImageUpload(false);
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!message.text && !message.imageUrl && !message.videoUrl) return;

//     socket.emit("new-message", {
//       sender: user._id,
//       reciever: params.userId,
//       ...message,
//       msgByUserId: user._id,
//     });
//     setMessage({ text: "", imageUrl: "", videoUrl: "" });
//   };
//   return (
//     <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60">
//       <div className="relative flex items-center gap-2">
//         <AIHintButton />
//         <div onClick={() => setOpenImageUpload((prev) => !prev)}>
//           <Paperclip />
//         </div>

//         {openImageUpload && (
//           <div className="absolute bottom-full mb-2 left-35 bg-white rounded-lg shadow-lg border border-gray-200">
//             <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition">
//               <Image className="text-[var(--accent)]" />
//               <span>Image</span>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleFileUpload(e, "imageUrl")}
//                 className="hidden"
//               />
//             </label>
//             <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition">
//               <SquarePlay className="text-[var(--accent)]" />
//               <span>Video</span>
//               <input
//                 type="file"
//                 accept="video/*"
//                 onChange={(e) => handleFileUpload(e, "videoUrl")}
//                 className="hidden"
//               />
//             </label>
//           </div>
//         )}
//         {(message.imageUrl || message.videoUrl) && (
//           <div className="relative  max-w-lg rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 overflow-auto">
//             {/* Close button */}
//             <button
//               onClick={() =>
//                 setMessage((prev) => ({
//                   ...prev,
//                   imageUrl: "",
//                   videoUrl: "",
//                 }))
//               }
//               className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/70 transition"
//             >
//               <X className="w-4 h-4" />
//             </button>

//             {/* Image preview */}
//             {message.imageUrl && (
//               <img
//                 src={message.imageUrl}
//                 alt="Preview"
//                 className="w-full max-h-96 object-contain rounded-lg"
//               />
//             )}

//             {/* Video preview */}
//             {message.videoUrl && (
//               <video
//                 src={message.videoUrl}
//                 controls
//                 autoPlay
//                 muted
//                 className="w-full max-h-96 rounded-lg object-contain"
//               />
//             )}
//           </div>
//         )}

//         <input
//           type="text"
//           placeholder="Write a message…"
//           className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 px-4 py-2  outline-none focus:ring-2 focus:ring-[var(--accent)]"
//           value={message.text}
//           onChange={(e) =>
//             setMessage((prev) => ({ ...prev, text: e.target.value }))
//           }
//         />
//         <Button
//           onClick={handleSendMessage}
//           className="rounded-2xl bg-[var(--accent)] hover:opacity-90"
//           disabled={!message.text && !message.imageUrl && !message.videoUrl}
//         >
//           <Send />
//         </Button>
//       </div>
//     </div>
//   );
// }
// export default ComposerBar;
import { getSocket } from "@/services/socketService";
import AIHintButton from "./AIHintButton";
import { Button } from "./ui/button";
import { Image, Paperclip, Send, SquarePlay, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { uploadFile } from "@/helper/uploadFile";

function ComposerBar({ setLoading, message, setMessage }) {
  const socket = getSocket();
  const user = useSelector((state) => state.user);
  const params = useParams();
  const [openImageUpload, setOpenImageUpload] = useState(false);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const upload = await uploadFile(file);
    setMessage((prev) => ({ ...prev, [type]: upload.url }));
    setLoading(false);
    setOpenImageUpload(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.text && !message.imageUrl && !message.videoUrl) return;

    socket.emit("new-message", {
      sender: user._id,
      reciever: params.userId,
      ...message,
      msgByUserId: user._id,
    });
    setMessage({ text: "", imageUrl: "", videoUrl: "" });
  };

  return (
    <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60">
      {/* Added flex-wrap on mobile so items can wrap instead of forcing overflow */}
      <div className="relative flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <AIHintButton />
        <div onClick={() => setOpenImageUpload((prev) => !prev)}>
          <Paperclip />
        </div>

        {openImageUpload && (
          
          <div className="absolute bottom-full mb-2 left-0 sm:left-[35px] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition">
              <Image className="text-[var(--accent)]" />
              <span>Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "imageUrl")}
                className="hidden"
              />
            </label>
            <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition">
              <SquarePlay className="text-[var(--accent)]" />
              <span>Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, "videoUrl")}
                className="hidden"
              />
            </label>
          </div>
        )}

       
        <input
          type="text"
          placeholder="Write a message…"
          /* IMPORTANT: min-w-0 allows the flex child to shrink properly on small screens */
          className="flex-1 min-w-0 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]"
          value={message.text}
          onChange={(e) =>
            setMessage((prev) => ({ ...prev, text: e.target.value }))
          }
        />
        <Button
          onClick={handleSendMessage}
          className="rounded-2xl bg-[var(--accent)] hover:opacity-90"
          disabled={!message.text && !message.imageUrl && !message.videoUrl}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
export default ComposerBar;
