const express = require("express");
const { Server } = require("socket.io");
const {
  ConversationModel,
  MessageModel,
} = require("../models/conversationModel.js");
const http = require("http");
const UserModel = require("../models/userModel.js");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken.js");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update this URL to match your frontend
    credentials: true,
  },
});

const onlineUser = new Set();

// Socket connection handler
io.on("connection", async (socket) => {
  console.log(`User connected: ${socket.id}`);

  try {
    const token = socket.handshake.auth.token;

    // Validate token and get user details
    const user = await getUserDetailsFromToken(token);
    if (!user) {
      throw new Error("Invalid token or user not found");
    }

    socket.join(user._id.toString());
    console.log(`User ${user._id} joined room ${user._id}`);

    // Emit the updated list of online users
    onlineUser.add(user._id.toString());
    io.emit("onlineUser", Array.from(onlineUser));

    // Handle incoming messages
    socket.on("message-page", async (userId) => {
      console.log("userId", userId);

      const userDetails = await UserModel.findById(userId).select("-password");
      if (!userDetails) {
        throw new Error("User not found");
      }

      const payload = {
        _id: userDetails._id,
        name: userDetails.name,
        email: userDetails.email,
        profile_pic: userDetails.profile_pic,
        online: onlineUser.has(userId),
      };

      socket.emit("message-user", payload); // Send user details to the client
      const updatedConversation = await ConversationModel.findOne({
        $or: [
          { sender: user?._id, reciever: userId },
          { sender: userId, reciever: user?._id },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      //previous message
      socket.emit("message", updatedConversation.messages);
    });

    // New message handler
    socket.on("new-message", async (data) => {
      try {
        if (!data?.sender || !data?.reciever) {
          return;
        }
        console.log("message-print", data.text);

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
      } catch (error) {
        console.error("Error processing new message:", error);
      }
    });
    socket.on("sidebar", async (currentUserId) => {
      console.log("Current user", currentUserId);
      const currentUserConversation = await ConversationModel.find({
        $or: [{ sender: currentUserId }, { reciever: currentUserId }],
      })
        .sort({ updatedAt: -1 })
        .populate("messages");

      const conversation = currentUserConversation.map((conv) => {
        const countUnseenMsg = conv.messages.reduce(
          (prev, curr) => prev + (curr.seen ? 0 : 0),
          0
        );

        return {
          _id: conv._id,
          sender: conv?.sender,
          reciever: conv?.reciever,
          unSeenMsg: countUnseenMsg,
          lastMsg: conv.messages[conv?.messages.length - 1],
        };
      });
     
      socket.emit("conversation", conversation);
    });

    socket.on("disconnect", () => {
      onlineUser.delete(user._id.toString());
      io.emit("onlineUser", Array.from(onlineUser)); // Emit updated online users list
      console.log(`User disconnected: ${socket.id}`);
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
