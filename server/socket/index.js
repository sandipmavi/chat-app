const express = require("express");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const http = require("http");
const {
  ConversationModel,
  MessageModel,
} = require("../models/conversationModel.js");
const UserModel = require("../models/userModel.js");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken.js");

const app = express();
const server = http.createServer(app);
const getConversation = require("../helpers/getConversation.js");

const io = new Server(server, {
  cors: {
    origin: "process.env.FRONTEND_URL", // Update with your frontend URL
    credentials: true,
  },
});

const onlineUser = new Set();

// Socket connection handler
io.on("connection", async (socket) => {
  console.log(`User connected: ${socket.id}`);

  try {
    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    if (!user) {
      throw new Error("Invalid token or user not found");
    }

    socket.join(user._id.toString());
    console.log(`User ${user._id} joined room ${user._id}`);

    // Add user to online list and notify clients
    onlineUser.add(user._id.toString());
    io.emit("onlineUser", Array.from(onlineUser));

    // Handle fetching messages when opening chat
    socket.on("message-page", async (userId) => {
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        console.error("Invalid userId:", userId);
        return;
      }

      const userDetails = await UserModel.findById(userId).select("-password");
      if (!userDetails) {
        console.error("User not found:", userId);
        return;
      }

      const payload = {
        _id: userDetails._id,
        name: userDetails.name,
        email: userDetails.email,
        profile_pic: userDetails.profile_pic,
        online: onlineUser.has(userId),
      };

      socket.emit("message-user", payload); // Send user details

      const updatedConversation = await ConversationModel.findOne({
        $or: [
          { sender: user._id, reciever: userId },
          { sender: userId, reciever: user._id },
        ],
      })
        .populate("messages")

        .sort({ updatedAt: -1 });

      socket.emit("message", updatedConversation?.messages || []);
    });

    // Handle new messages
    socket.on("new-message", async (data) => {
      try {
        if (
          !data?.sender ||
          !data?.reciever ||
          !mongoose.Types.ObjectId.isValid(data.sender) ||
          !mongoose.Types.ObjectId.isValid(data.reciever)
        ) {
          console.error("Invalid sender or receiver:", data);
          return;
        }

        let checkCon = await ConversationModel.findOne({
          $or: [
            { sender: data.sender, reciever: data.reciever },
            { sender: data.reciever, reciever: data.sender },
          ],
        });

        if (!checkCon) {
          const createConver = new ConversationModel({
            sender: data.sender,
            reciever: data.reciever,
          });
          checkCon = await createConver.save();
        }

        const message = new MessageModel({
          text: data.text,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          msgByUserId: data.msgByUserId,
        });

        const saveMessage = await message.save();

        await ConversationModel.updateOne(
          { _id: checkCon._id },
          { $push: { messages: saveMessage._id } }
        );

        const updatedConversation = await ConversationModel.findOne({
          $or: [
            { sender: data.sender, reciever: data.reciever },
            { sender: data.reciever, reciever: data.sender },
          ],
        })
          .populate("messages")
          .sort({ updatedAt: -1 });

        console.log("sender", data.sender);
        console.log("Reciever", data.reciever);
        console.log(
          "Sockets in sender's room:",
          io.sockets.adapter.rooms.get(data.sender)
        );
        console.log(
          "Sockets in receiver's room:",
          io.sockets.adapter.rooms.get(data.reciever)
        );

        io.to(data.sender).emit("message", updatedConversation.messages);
        io.to(data.reciever).emit("message", updatedConversation?.messages);

        //send conversation
        const conversationSender = await getConversation(data?.sender);
        const conversationReciever = await getConversation(data?.reciever);

        io.to(data.sender).emit("conversation", conversationSender);
        io.to(data.reciever).emit("conversation", conversationReciever);
      } catch (error) {
        console.error("Error processing new message:", error);
      }
    });

    // Fetch conversation list for sidebar
    socket.on("sidebar", async (currentUserId) => {
      const conversation = await getConversation(currentUserId);

      socket.emit("conversation", conversation);
    });
    socket.on("seen", async (msgByUserId) => {
      let checkCon = await ConversationModel.findOne({
        $or: [
          { sender: user?._id, reciever: msgByUserId },
          { sender: msgByUserId, reciever: user?._id },
        ],
      });
      const conversationMessageId = checkCon?.messages || [];
      const updateMessages = await MessageModel.updateMany(
        {
          _id: { $in: conversationMessageId },
          msgByUserId: msgByUserId,
        },
        {
          $set: { seen: true },
        }
      );
      const conversationSender = await getConversation(user?._id?.toString());
      const conversationReciever = await getConversation(msgByUserId);

      io.to(user?._id?.toString()).emit("conversation", conversationSender);
      io.to(msgByUserId).emit("conversation", conversationReciever);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      if (user?._id) {
        socket.leave(user._id.toString()); // Ensure user leaves the room
        onlineUser.delete(user._id.toString());
        io.emit("onlineUser", Array.from(onlineUser));
      }
    });
  } catch (error) {
    console.error("Socket connection error:", error.message);
    socket.disconnect(true); // Disconnect the socket on error
  }
});

module.exports = {
  app,
  server,
};
