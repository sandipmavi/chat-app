const { ConversationModel } = require("../models/conversationModel");
const getConversation = async (currentUserId) => {
  if (!currentUserId) {
    console.error("current user ID is not there:", currentUserId);
    return;
  }
  //|| !mongoose.Types.ObjectId.isValid(currentUserId)

  console.log("Current user", currentUserId);
  const currentUserConversation = await ConversationModel.find({
    $or: [{ sender: currentUserId }, { reciever: currentUserId }],
  })
    .sort({ updatedAt: -1 })
    .populate("messages")
    .populate("sender")
    .populate("reciever");

  const conversation = currentUserConversation.map((conv) => {
    const countUnseenMsg = conv.messages.reduce((prev, curr) => {
      if (curr?.msgByUserId.toString() !== currentUserId) {
        return prev + (curr?.seen ? 0 : 1);
      } else {
        return prev;
      }
    }, 0);

    return {
      _id: conv._id,
      sender: conv?.sender,
      reciever: conv?.reciever,
      unSeenMsg: countUnseenMsg,
      lastMsg: conv.messages[conv?.messages.length - 1],
    };
  });
  return conversation;
};
module.exports = getConversation;
