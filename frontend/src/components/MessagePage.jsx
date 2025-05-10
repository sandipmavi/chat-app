import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import { uploadFile } from "../helper/uploadFile";
import { Loader } from "./Loader";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import backgroundImage from "../assets/wallapaper.jpeg";
import moment from "moment";

export const MessagePage = () => {
  const params = useParams();
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    _id: "",
    name: "",
    email: "",
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
  const socketConnection = useSelector((state) => state?.user.socketConnection);

  // useEffect(() => {
  //   if (socketConnection) {
  //     console.log("Hello from useEffect");
  //     socketConnection.emit("message-page", params.userId);
  //     socketConnection.on("message-user", (data) => {
  //       setDataUser(data);
  //     });
  //     socketConnection.on("message", (data) => {
  //       console.log("Hello");
  //       console.log("message-data", data);
  //     });
  //   }
  // }, [socketConnection, params.userId, user]);
  useEffect(() => {
    if (socketConnection) {
      console.log("Hello from useEffect");

      // Emit to get user details
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
      socketConnection.on("Mavi", (data) => {
        console.log("Mavi event listened");
        console.log(data);
      });

      // Listen for new messages
      socketConnection.on("message", (data) => {
        console.log("Message event received");
        setAllMessage(data);
        console.log("message-data", data);
      });
    }

    // Cleanup on unmount to avoid memory leaks
    return () => {
      if (socketConnection) {
        socketConnection.off("message");
        socketConnection.off("message-user");
      }
    };
  }, [socketConnection, params?.userId, user]);

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageUpload(false);

    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: uploadPhoto.url,
      };
    });
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log("message-send");

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new-message", {
          sender: user?._id,
          reciever: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleClearImage = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
  };
  const handleClearVideo = () => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      };
    });
  };
  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageUpload(false);

    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uploadPhoto.url,
      };
    });
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="absolute inset-0 bg-cover bg-center"
    >
      {/* <div className="absolute inset-0 bg-black/20" /> */}
      <header className="px-4 sticky top-0 h-16 bg-white flex justify-between items-center ">
        <div className="  flex items-center gap-4">
          <div className="text-slate-600">
            <Link to={"/"} className="lg:hidden">
              <FaAngleLeft size={23} />
            </Link>
          </div>
          <div>
            <Avatar
              height={50}
              width={50}
              imageUrl={dataUser.profile_pic}
              name={dataUser.name}
              shadow={false}
              userId={dataUser._id}
              size={45}
            />
          </div>{" "}
          <div>
            {" "}
            <h3 className="text-black font-semibold text-lg my-0 text-ecllipse line-clamp-1">
              {dataUser?.name}{" "}
            </h3>{" "}
            <p className="text-sm my-0 -mt-2 ">
              {" "}
              {dataUser.online ? (
                <span className="text-green-700">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
        <div className="text-slate-600">
          <button className="cursor-pointer ">
            <HiDotsVertical size={25} />
          </button>
        </div>
      </header>
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-100 opacity-35   ">
        {" "}
        {message.imageUrl && (
          <div className="w-full h-full bg-slate-700/5 flex justify-center items-center overflow-hidden">
            <div
              onClick={handleClearImage}
              className="w-fit p-2 top-0 right-0 absolute cursor-pointer hover:text-red-600"
            >
              <IoClose size={25} />
            </div>
            <div className="bg-white p-3 ">
              <img
                src={message.imageUrl}
                alt="message-photo"
                className="object-cover aspect-square w-full h-full max-w-sm m-2 obkect-scale-down "
              />
            </div>
          </div>
        )}
        {message.videoUrl && (
          <div className="w-full h-full bg-slate-700/5 flex justify-center items-center overflow-hidden">
            <div
              onClick={handleClearVideo}
              className="w-fit p-2 top-0 right-0 absolute cursor-pointer hover:text-red-600"
            >
              <IoClose size={25} />
            </div>
            <div className="bg-white p-3 ">
              <video
                src={message.videoUrl}
                alt="message-video"
                className=" aspect-square  w-full h-full max-w-sm m-2 object-scale-down "
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}
        {loading && (
          <div className="flex justify-center items-center w-full h-full ">
            <Loader />
          </div>
        )}
        {/* All Messages */}
        <section className="flex-1 overflow-y-auto p-4 space-y-2">
          {allMessage.map((msg, index) => (
            <div
              key={index}
              className={` p-2 rounded-lg w-fit shadow-md backdrop-blur-md ${
                user._id === msg.msgByUserId
                  ? "ml-auto bg-white/90 "
                  : "bg-tear-100"
              }`}
            >
              <p className="px-2">{msg.text}</p>
              <p className="text-xs text-right text-gray-500">
                {moment(msg.createdAt).format("hh:mm")}
              </p>
            </div>
          ))}
        </section>
      </section>

      <section className=" px-4 h-16 bg-white flex items-center">
        <div className=" relative  ">
          <button
            onClick={() => setOpenImageUpload((prev) => !prev)}
            className="flex justify-center items-center w-11 h-11 text-slate-500 rounded-full hover:bg-[#00bac4] hover:text-white "
          >
            <FaPlus size={20} />
          </button>
          {openImageUpload && (
            <div className="bg-white rounded shadow absolute bottom-14 w-36 p-2 ">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 px-3 gap-2 cursor-pointer hover:bg-slate-200"
                >
                  <div className=" text-blue-500">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 px-3 gap-2 cursor-pointer hover:bg-slate-200"
                >
                  <div className=" text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>
        {/*send message */}
        <form
          className="w-full h-full flex gap-2 "
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            name="text"
            placeholder="Type message here...."
            className="py-1 px-4 outline-none h-full w-full"
            value={message.text}
            onChange={handleOnChange}
          />
          <button className="text-[#00bac4] hover:text-blue-400" type="submit">
            <IoMdSend size={25} />
          </button>
        </form>
      </section>
    </div>
  );
};
