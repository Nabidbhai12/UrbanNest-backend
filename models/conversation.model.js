import mongoose from 'mongoose';

// Updated Conversation Schema to explicitly handle two participants for one-to-one conversation
const ConversationSchema = new mongoose.Schema({
  // Define two separate fields for participants to ensure one-to-one mapping
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ConversationModel = mongoose.model('Conversation', ConversationSchema);
export default ConversationModel;
