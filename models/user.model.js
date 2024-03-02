import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String, // URL to the image
    default: ''
  },
  contactNumber: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  upvotedBlogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required : false
    }
  ],
  downvotedBlogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required : false
    }
  ],
  mycomments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required : false
      
    }
  ],
  upvotedComments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required : false
    }
  ],
  downvotedComments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required : false
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
},
{ timestamps: true });

//create a model
const User = mongoose.model("User", userSchema);
export default User;

