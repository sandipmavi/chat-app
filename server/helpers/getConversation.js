const mongoose = require("mongoose");
const { ConversationModel } = require("../models/conversationModel");

const getConversation = async (currentUserId) => {
  if (!currentUserId || !mongoose.Types.ObjectId.isValid(currentUserId)) {
    console.error("Invalid user ID:", currentUserId);
    return [];
  }

  const conversations = await ConversationModel.aggregate([
    {
      $match: {
        $or: [
          { sender: new mongoose.Types.ObjectId(currentUserId) },
          { reciever: new mongoose.Types.ObjectId(currentUserId) },
        ],
      },
    },
    { $sort: { updatedAt: -1 } },

    
    {
      $lookup: {
        from: "messages",
        let: { msgIds: "$messages" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$msgIds"] } } },
          { $sort: { createdAt: -1 } },
          { $limit: 1 }, // only latest
        ],
        as: "lastMsg",
      },
    },

    
    {
      $lookup: {
        from: "messages",
        let: { msgIds: "$messages" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$msgIds"] },
              msgByUserId: { $ne: new mongoose.Types.ObjectId(currentUserId) },
              seen: false,
            },
          },
          { $count: "unSeenMsg" },
        ],
        as: "unSeenMsg",
      },
    },

    
    {
      $project: {
        sender: 1,
        reciever: 1,
        lastMsg: { $arrayElemAt: ["$lastMsg", 0] },
        unSeenMsg: {
          $ifNull: [{ $arrayElemAt: ["$unSeenMsg.unSeenMsg", 0] }, 0],
        },
      },
    },

    // Populate sender/receiver dat
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender",
      },
    },
    { $unwind: "$sender" },
    {
      $lookup: {
        from: "users",
        localField: "reciever",
        foreignField: "_id",
        as: "reciever",
      },
    },
    { $unwind: "$reciever" },
  ]);

  return conversations;
};

module.exports = getConversation;
