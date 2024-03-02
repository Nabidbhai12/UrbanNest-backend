

import MessageModel from   "../models/message.model.js";


import ConversationModel from   "../models/conversation.model.js";






import User   from "../models/user.model.js";


//write a function to fetch all the users in usermodel
export const getAllusers=async(req,res)=>
{
  try {
    const users = await User.find({}, 'username');
    console.log(users);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export const sendMessage=async(req,res)=>
{
  console.log(req.body);
  console.log(req.user.id);
  const { receiverId, text } = req.body;

  try {
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: req.user.id, receiver: receiverId },
        { sender: receiverId, receiver: req.user.id }
      ]
    });

    if (!conversation) {
      console.log("conversation created");
      conversation = new ConversationModel({ sender: req.user.id, receiver: receiverId });
      await conversation.save();
    }

    const message = new MessageModel({
      conversationId: conversation._id,
      sender: req.user.id,
      receiver: receiverId,
      text: text
    });
    console.log(message);
    console.log("done");

    await message.save();

    res.status(201).json({ message: 'Message sent successfully', messageId: message._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// Function to fetch all conversations for a user along with messages and senders
export const getUserConversations = async (req, res) => {
  const userId = req.user.id; // Ensure you have user's ID from the session or token

  try {
    const conversations = await ConversationModel.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .lean() // Use lean() for faster execution as we only need to read data
    .exec();

    // Fetch messages for each conversation including the sender's information
    for (let conversation of conversations) {
      const messages = await MessageModel.find({ conversationId: conversation._id })
        .populate('sender', 'username') // Adjust 'username' based on your User model
        .lean()
        .exec();

      // Append messages to each conversation object
      conversation.messages = messages;
    }
console.log(conversations);
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations and messages:', error);
    res.status(500).json({ message: error.message });
  }
};



