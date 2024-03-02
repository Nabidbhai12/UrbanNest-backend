import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    numOfUpvotes: {
        type: Number,
        default: 0
    },
    numOfDownvotes: {
        type: Number,
        default: 0
    },
    /* numOfComments: {
        type: Number,
        default: 0
    }, */
    commentList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    content: {
        type: String,
        required: true,
        trim: true
    },
    tags: [
        {
            type: String,
            default: []
        }
    ],
    image: {
        type: String, //url to image
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;