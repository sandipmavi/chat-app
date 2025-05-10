import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import { uploadFile } from "../helper/uploadFile";
import { IoClose } from "react-icons/io5";
import { Loader } from "./Loader";
import { IoMdSend } from "react-icons/io";
import moment from "moment";

export const Message = () => {
  const params = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    _id: "",
    name: "",
    profile_pic: "",
    online: false,
  });
  const [allMessage, setAllMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openImageUpload, setOpenImageUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const currentMessage = useRef(null);
  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);
  const socketConnection = useSelector((state) => state?.user.socketConnection);
  useEffect(() => {
    if (socketConnection) {
      console.log("Hello from useEffect");

      console.log(params.userId);
      socketConnection.emit("message-page", params.userId);

      // Handle user details response
      socketConnection.on("message-user", (data) => {
        console.log("Received user data:", data);
        setDataUser(data);
      });
      console.log("Socket connected?", socketConnection.connected);
      socketConnection.on("connect", () => {
        console.log("Socket connected event fired");
      });
      socketConnection.emit("seen", params.userId);

      socketConnection.on("message", (data) => {
        console.log("Message event received");
        setAllMessage(data);
        console.log("message-data", data);
      });
    }

    return () => {
      if (socketConnection) {
        socketConnection.off("message");
        socketConnection.off("message-user");
      }
    };
  }, [socketConnection, params?.userId, user]);

  // useEffect(() => {
  //   if (!socketConnection) return;
  //   console.log(params.userId);

  //   socketConnection.emit("message-page", params.userId);
  //   socketConnection.on("message-user", (userData) => {
  //     console.log("Received user data:", userData);
  //     setDataUser(userData);
  //   });
  //   socketConnection.on("message", setAllMessage);
  //   socketConnection.on("user-status-change", (data) => {
  //     if (data.userId === params.userId) {
  //       setDataUser((prev) => ({ ...prev, online: data.online }));
  //     }
  //   });

  //   return () => {
  //     socketConnection.off("message-user");
  //     socketConnection.off("message");
  //     socketConnection.off("user-status-change");
  //   };
  // }, [socketConnection, params.userId]);

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

    socketConnection.emit("new-message", {
      sender: user._id,
      reciever: params.userId,
      ...message,
      msgByUserId: user._id,
    });
    setMessage({ text: "", imageUrl: "", videoUrl: "" });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaAngleLeft className="text-gray-600" size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar
                height={50}
                width={50}
                imageUrl={dataUser.profile_pic}
                name={dataUser.name}
                shadow={false}
                userId={dataUser._id}
                size={45}
              />
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 border-2 border-white rounded-full ${
                  dataUser.online ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {dataUser.name}
              </h3>
              <p
                className={`text-sm font-medium ${
                  dataUser.online ? "text-green-600" : "text-gray-500"
                }`}
              >
                {dataUser.online ? "Active now" : "Offline"}
              </p>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <HiDotsVertical className="text-gray-600" size={24} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar">
        {loading && <Loader />}

        {/* Media Preview */}
        {(message.imageUrl || message.videoUrl) && (
          <div className="relative inline-block  mb-4 ml-70">
            <button
              onClick={() =>
                setMessage((prev) => ({ ...prev, imageUrl: "", videoUrl: "" }))
              }
              className="absolute -right-5 -top-2 bg-white rounded-full p-1 shadow-lg hover:bg-red-400"
            >
              <IoClose size={20} className="text-gray-600" />
            </button>
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="Preview"
                className="max-w-[240px] rounded-lg shadow-md"
              />
            )}
            {message.videoUrl && (
              <video
                src={message.videoUrl}
                controls
                autoPlay
                muted
                className="max-w-[240px] rounded-lg shadow-md"
              />
            )}
          </div>
        )}

        {/* Messages */}
        {allMessage.map((msg, index) => (
          <div
            ref={currentMessage}
            key={index}
            className={`flex mb-4 ${
              user._id === msg.msgByUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                user._id === msg.msgByUserId
                  ? "bg-blue-500 text-white"
                  : "bg-white shadow-md"
              } ${
                msg.imageUrl || msg.videoUrl
                  ? "p-1 rounded-lg max-w-[240px]"
                  : "p-3 rounded-lg max-w-[70%]"
              }`}
            >
              {msg.text && <p className="break-words px-2">{msg.text}</p>}
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
              <p
                className={`text-xs mt-1 px-2 ${
                  user._id === msg.msgByUserId
                    ? "text-blue-100"
                    : "text-gray-500"
                }`}
              >
                {moment(msg.createdAt).format("hh:mm A")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenImageUpload(!openImageUpload)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <FaPlus className="text-gray-600" size={20} />
            </button>

            {openImageUpload && (
              <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200">
                <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition">
                  <FaImage className="text-blue-500" />
                  <span>Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "imageUrl")}
                    className="hidden"
                  />
                </label>
                <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition">
                  <FaVideo className="text-purple-500" />
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
          </div>

          <input
            type="text"
            value={message.text}
            onChange={(e) =>
              setMessage((prev) => ({ ...prev, text: e.target.value }))
            }
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 transition"
          />

          <button
            type="submit"
            className="p-2 text-blue-500 hover:text-blue-600 transition"
            disabled={!message.text && !message.imageUrl && !message.videoUrl}
          >
            <IoMdSend size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import Avatar from "./Avatar";
// import { HiDotsVertical } from "react-icons/hi";
// import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6";
// import { uploadFile } from "../helper/uploadFile";
// import { IoClose } from "react-icons/io5";
// import { Loader } from "./Loader";
// import { IoMdSend } from "react-icons/io";
// import moment from "moment";

// export const Message = () => {
//   const params = useParams();
//   const navigate = useNavigate();
//   const user = useSelector((state) => state?.user);
//   const [dataUser, setDataUser] = useState({
//     _id: "",
//     name: "",
//     profile_pic: "",
//     online: false,
//   });
//   const [allMessage, setAllMessage] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [openImageUpload, setOpenImageUpload] = useState(false);
//   const [message, setMessage] = useState({
//     text: "",
//     imageUrl: "",
//     videoUrl: "",
//   });
//   const socketConnection = useSelector((state) => state?.user.socketConnection);

//   useEffect(() => {
//     if (!socketConnection) return;

//     socketConnection.emit("message-page", params.userId);
//     socketConnection.on("message-user", setDataUser);
//     socketConnection.on("message", setAllMessage);

//     return () => {
//       socketConnection.off("message-user");
//       socketConnection.off("message");
//     };
//   }, [socketConnection, params.userId]);

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

//     socketConnection.emit("new-message", {
//       sender: user._id,
//       reciever: params.userId,
//       ...message,
//       msgByUserId: user._id,
//     });
//     setMessage({ text: "", imageUrl: "", videoUrl: "" });
//   };

//   return (
//     <div className="flex flex-col h-full bg-gray-50">
//       {/* Chat Header */}
//       <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate("/")}
//             className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition"
//           >
//             <FaAngleLeft className="text-gray-600" size={20} />
//           </button>
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <Avatar
//                 imageUrl={dataUser.profile_pic}
//                 name={dataUser.name}
//                 size={48}
//               />
//               <div
//                 className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${
//                   dataUser.online ? "bg-green-500" : "bg-gray-400"
//                 }`}
//               />
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {dataUser.name}
//               </h3>
//               <p
//                 className={`text-sm font-medium ${
//                   dataUser.online ? "text-green-600" : "text-gray-500"
//                 }`}
//               >
//                 {dataUser.online ? "Active now" : "Offline"}
//               </p>
//             </div>
//           </div>
//         </div>
//         <button className="p-2 hover:bg-gray-100 rounded-full transition">
//           <HiDotsVertical className="text-gray-600" size={24} />
//         </button>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {loading && <Loader />}

//         {/* Media Preview */}
//         {(message.imageUrl || message.videoUrl) && (
//           <div className="relative inline-block mb-4">
//             <button
//               onClick={() =>
//                 setMessage((prev) => ({ ...prev, imageUrl: "", videoUrl: "" }))
//               }
//               className="absolute -right-2 -top-2 bg-white rounded-full p-1 shadow-lg"
//             >
//               <IoClose size={20} className="text-gray-600" />
//             </button>
//             {message.imageUrl && (
//               <img
//                 src={message.imageUrl}
//                 alt="Preview"
//                 className="max-w-[240px] rounded-lg shadow-md"
//               />
//             )}
//             {message.videoUrl && (
//               <video
//                 src={message.videoUrl}
//                 controls
//                 className="max-w-[240px] rounded-lg shadow-md"
//               />
//             )}
//           </div>
//         )}

//         {/* Messages */}
//         {allMessage.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex mb-4 ${
//               user._id === msg.msgByUserId ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`${
//                 user._id === msg.msgByUserId
//                   ? "bg-blue-500 text-white"
//                   : "bg-white shadow-md"
//               } ${
//                 msg.imageUrl || msg.videoUrl
//                   ? "p-1 rounded-lg max-w-[240px]"
//                   : "p-3 rounded-lg max-w-[70%]"
//               }`}
//             >
//               {msg.text && <p className="break-words px-2">{msg.text}</p>}
//               {msg.imageUrl && (
//                 <div className="bg-white rounded-lg overflow-hidden">
//                   <img src={msg.imageUrl} alt="Message" className="w-full" />
//                 </div>
//               )}
//               {msg.videoUrl && (
//                 <div className="bg-white rounded-lg overflow-hidden">
//                   <video src={msg.videoUrl} controls className="w-full" />
//                 </div>
//               )}
//               <p
//                 className={`text-xs mt-1 px-2 ${
//                   user._id === msg.msgByUserId
//                     ? "text-blue-100"
//                     : "text-gray-500"
//                 }`}
//               >
//                 {moment(msg.createdAt).format("hh:mm A")}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Message Input */}
//       <div className="p-4 bg-white border-t border-gray-200">
//         <form onSubmit={handleSendMessage} className="flex items-center gap-3">
//           <div className="relative">
//             <button
//               type="button"
//               onClick={() => setOpenImageUpload(!openImageUpload)}
//               className="p-2 hover:bg-gray-100 rounded-full transition"
//             >
//               <FaPlus className="text-gray-600" size={20} />
//             </button>

//             {openImageUpload && (
//               <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200">
//                 <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition">
//                   <FaImage className="text-blue-500" />
//                   <span>Image</span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleFileUpload(e, "imageUrl")}
//                     className="hidden"
//                   />
//                 </label>
//                 <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition">
//                   <FaVideo className="text-purple-500" />
//                   <span>Video</span>
//                   <input
//                     type="file"
//                     accept="video/*"
//                     onChange={(e) => handleFileUpload(e, "videoUrl")}
//                     className="hidden"
//                   />
//                 </label>
//               </div>
//             )}
//           </div>

//           <input
//             type="text"
//             value={message.text}
//             onChange={(e) =>
//               setMessage((prev) => ({ ...prev, text: e.target.value }))
//             }
//             placeholder="Type a message..."
//             className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 transition"
//           />

//           <button
//             type="submit"
//             className="p-2 text-blue-500 hover:text-blue-600 transition"
//             disabled={!message.text && !message.imageUrl && !message.videoUrl}
//           >
//             <IoMdSend size={24} />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
