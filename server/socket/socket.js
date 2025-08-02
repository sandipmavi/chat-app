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
const getConversation = require("../helpers/getConversation.js");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Map for tracking userId -> Set of socketIds
const onlineUsers = new Map();

function addOnlineUser(userId, socketId) {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
}

function removeOnlineUser(userId, socketId) {
  const sockets = onlineUsers.get(userId);
  if (sockets) {
    sockets.delete(socketId);
    if (sockets.size === 0) onlineUsers.delete(userId);
  }
}

io.on("connection", async (socket) => {
  try {
    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);
    if (!user) throw new Error("Invalid token or user not found");

    const userId = user._id.toString();
    socket.join(userId);
    addOnlineUser(userId, socket.id);
    io.emit("onlineUser", Array.from(onlineUsers.keys()));

    socket.on("message-page", async (otherUserId) => {
      if (!otherUserId || !mongoose.Types.ObjectId.isValid(otherUserId)) return;

      const userDetails = await UserModel.findById(otherUserId).select(
        "-password"
      );
      if (!userDetails) return;

      socket.emit("message-user", {
        _id: userDetails._id,
        name: userDetails.name,
        email: userDetails.email,
        profile_pic: userDetails.profile_pic,
        online: onlineUsers.has(otherUserId),
      });

      const conversation = await ConversationModel.findOne({
        $or: [
          { sender: userId, reciever: otherUserId },
          { sender: otherUserId, reciever: userId },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 })
        .lean();

      socket.emit("message", conversation?.messages || []);
    });

    socket.on("new-message", async (data) => {
      try {
        const { sender, reciever, text, imageUrl, videoUrl, msgByUserId } =
          data;
        if (
          !sender ||
          !reciever ||
          !mongoose.Types.ObjectId.isValid(sender) ||
          !mongoose.Types.ObjectId.isValid(reciever)
        )
          return;

        let checkCon = await ConversationModel.findOne({
          $or: [
            { sender, reciever },
            { sender: reciever, reciever: sender },
          ],
        });

        if (!checkCon) {
          checkCon = await new ConversationModel({ sender, reciever }).save();
        }

        const savedMessage = await new MessageModel({
          text,
          imageUrl,
          videoUrl,
          msgByUserId,
        }).save();

        await ConversationModel.updateOne(
          { _id: checkCon._id },
          { $push: { messages: savedMessage._id } }
        );

        const updatedConvo = await ConversationModel.findOne({
          _id: checkCon._id,
        })
          .populate("messages")
          .sort({ updatedAt: -1 })
          .lean();

        if (io.sockets.adapter.rooms.has(sender))
          io.to(sender).emit("message", updatedConvo.messages);
        if (io.sockets.adapter.rooms.has(reciever))
          io.to(reciever).emit("message", updatedConvo.messages);

        const convoSender = await getConversation(sender);
        const convoReciever = await getConversation(reciever);

        io.to(sender).emit("conversation", convoSender);
        io.to(reciever).emit("conversation", convoReciever);
      } catch (error) {
        console.error("new-message error:", error);
      }
    });

    let sidebarCooldown = false;
    socket.on("sidebar", async (userId) => {
      if (sidebarCooldown) return;
      sidebarCooldown = true;
      setTimeout(() => (sidebarCooldown = false), 2000);

      const conversations = await getConversation(userId);
      socket.emit("conversation", conversations);
    });

    socket.on("seen", async (msgByUserId) => {
      const convo = await ConversationModel.findOne({
        $or: [
          { sender: userId, reciever: msgByUserId },
          { sender: msgByUserId, reciever: userId },
        ],
      });

      const messageIds = convo?.messages || [];
      await MessageModel.updateMany(
        {
          _id: { $in: messageIds },
          msgByUserId,
          seen: false,
        },
        { $set: { seen: true } }
      );

      const convoSender = await getConversation(userId);
      const convoReciever = await getConversation(msgByUserId);

      io.to(userId).emit("conversation", convoSender);
      io.to(msgByUserId).emit("conversation", convoReciever);
    });

    socket.on("disconnect", () => {
      removeOnlineUser(userId, socket.id);
      socket.leave(userId);
      io.emit("onlineUser", Array.from(onlineUsers.keys()));
    });
  } catch (err) {
    console.error("Socket connection error:", err.message);
    socket.disconnect(true);
  }
});

module.exports = {
  app,
  server,
};
