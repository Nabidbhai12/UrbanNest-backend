import Blog from "../models/blog.model.js";
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';
import mongoose from "mongoose";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {v2 as cloudinary} from 'cloudinary';
import multer from "multer";

cloudinary.config({ 
    cloud_name: 'dtzwdn1jf', 
    api_key: '741567594763319', 
    api_secret: 'zQUzLn_BFPqVNcmbWG-WCsoNv0k' 
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'blogPicture',
      format: async (req, file) => 'png', // or other formats
      public_id: (req, file) => `property-${Date.now()}`, // Example to generate a unique ID    },
    },
  });
  
  const parser = multer({ storage: storage });

export  const uploadImage = parser.single('image');
  
 export  const handleImageUpload = (req, res) => {
    console.log(req.body);
    console.log(req.file);
   

    if (!req.file) {
      return res.status(400).send({ message: 'Please upload an image.' });
    }
  
    // The image URL will be in req.file.path
    const imageUrl = req.file.path;
    console.log(imageUrl);
  
    res.send({ url: imageUrl });
  };



//Write createBlog function here. It will first check if the user is logged in or not. 
//If the user is logged in, it will create a new blog and save it to the database. 
//If the user is not logged in, it will send a 401 status code with a message "You are not logged in".
export const createBlog = async (req, res) => {
    try {
        //get user name from user id from database
        const userId = req.user.id;
        const user = await User.findById(userId);
        //get name
        const name = user.username;


        const { title, content, tags, image } = req.body;
        

        const newBlog = new Blog({
            author : user,
            authorName : name,
            title,
            content,
            ...(tags && { tags }),
            ...(image && { image }),
        });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Show all blogs of a user
export const showMyBlogs = async (req, res) => {
    console.log("In showMyBlogs");
    try {
        const userId = req.user.id;
        console.log("User id in showMyBlogs: " + userId + " " + typeof(userId));
        const userIdObj = new mongoose.Types.ObjectId(userId);
        const blogs = await Blog.find({ "author" : userIdObj });
        //const blogs = await Blog.find({ "$expr": { "$eq": [{ "$toString": "$author._id" }, "$toString": userId] } });

        res.status(200).json(blogs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//Show one blog
export const showBlog = async (req, res) => {
    try {
        console.log("showblog");
        const blogid = req.params.id;
        const blog = await Blog.findById(blogid);
        console.log(blog);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//Update a blog
export const updateBlog = async (req, res) => {
    try {
        const blogid = req.params.id;
        const blog = await Blog.findById(blogid);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        const { title, content, tags} = req.body;
        blog.title = title;
        blog.content = content;
        blog.tags = tags;
        await blog.save();
        res.status(200).json(blog);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


//Upvote a blog.
export const upvoteBlog = async (req, res) => {
    try {
        const blogid = req.params.id;
        const userid = req.user.id;

        const blog = await Blog.findById(blogid);
        const user = await User.findById(userid);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        blog.numOfUpvotes += 1;
        user.upvotedBlogs.push(blogid);
        await blog.save();
        await user.save();
        res.status(200).json(blog);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


//Downvote a blog
export const downvoteBlog = async (req, res) => {
    try {
        const blogid = req.params.id;
        const blog = await Blog.findById(blogid);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        blog.numOfDownvotes += 1;
        await blog.save();
        res.status(200).json(blog);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//Decrease upvote of a blog
export const decreaseUpvoteBlog = async (req, res) => {
    try {
        const blogid = req.params.id;
        const userid = req.user.id;

        const blog = await Blog.findById(blogid);
        const user = await User.findById(userid);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        blog.numOfUpvotes -= 1;
        user.upvotedBlogs.pull(blogid);
        await blog.save();
        await user.save();
        res.status(200).json(blog);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//Decrease downvote of a blog
export const decreaseDownvoteBlog = async (req, res) => {
    try {
        const blogid = req.params.id;
        const blog = await Blog.findById(blogid);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        blog.numOfDownvotes -= 1;
        await blog.save();
        res.status(200).json(blog);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//check whether the user has upvoted the blog or not
export const checkUpvote = async (req, res) => {
    try {
        const blogid = req.params.id;
        const blog = await Blog.findById(blogid);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        const userId = req.user.id;
        //find the user
        const user = await User.findById(userId);
        if (user.upvotedBlogs.includes(blogid)) {
            res.status(200).json({ hasUpvoted: true });
        } else {
            res.status(200).json({ hasUpvoted: false });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//check whether the user has downvoted the blog or not
export const checkDownvote = async (req, res) => {
    try {
        const blogid = req.params.id;
        const blog = await Blog.findById(blogid);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        const userId = req.user.id;
        //find the user
        const user = await User.findById(userId);
        if (user.downvotedBlogs.includes(blogid)) {
            res.status(200).json({ hasDownvoted: true });
        } else {
            res.status(200).json({ hasDownvoted: false });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//Show all blogs
export const showAllBlogsByTitle = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ title: 1 });
        //const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//Show all blogs by title descending
export const showAllBlogsByTitleDesc = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ title: -1 });
        //const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//Show all blogs by date ascending
export const showAllBlogsByDate = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: 1 });
        //const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//Show all blogs by date descending
export const showAllBlogsByDateDesc = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        //const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//Show all blogs by upvotes descending
export const showAllBlogsByUpvotes = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ numOfUpvotes: -1 });
        //const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//Show all blogs by downvotes descending
export const showAllBlogsByDownvotes = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ numOfDownvotes: -1 });
        //const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//Show blogs by tag
export const showBlogsByTag = async (req, res) => {
    try {
        const tag = req.params.tag;
        const blogs = await Blog.find({ "tags": tag });
        //const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//Show top 5 blogs based on upvotes
export const showTopFive = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ numOfUpvotes: -1 }).limit(5);
        res.status(200).json(blogs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
// Get top 5 recent blogs
export const showRecentBlogs = async (req, res) => {
    try {
        const recentBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5);
        res.status(200).json(recentBlogs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//Show one blog, no auth
export const showBlogNoAuth = async (req, res) => {
    try {
        const blogid = req.params.id;
        const blog = await Blog.findById(blogid);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


//Write deleteBlog function here. It will first check if the user is logged in or not.
//If the user is logged in, it will delete the blog with the given id from the database.
//If the user is not logged in, it will send a 401 status code with a message "You are not logged in".
export const deleteBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        console.log("req.user: " + req.user);
        console.log("User id in deleteBlog: " + userId);
        //console.log("User name in deleteBlog: " + req.user.username);
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        

        if (!(blog.author._id == req.user.id)) {
            return res.status(401).json({ message: "You are not authorized to delete this blog" });
        }
        await Blog.findByIdAndDelete(id);
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//COMMENT CONTROLLERS

//create comment
export const createComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        //get name
        const name = user.username;

        const blogid = req.params.id;
        const blog = await Blog.findById(blogid);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        const { content } = req.body;
        console.log("Create comment request received.");
        const newComment = new Comment({
            author : user._id,
            authorName : name,
            blog : blog,
            content : content
        });
        console.log("New comment content: " + newComment.content);
        await newComment.save();
        blog.commentList.push(newComment._id);
        console.log("New comment pushed to blog.");
        await blog.save();
        user.mycomments.push(newComment._id);
        console.log("New comment pushed to user.");
        await user.save();
        res.status(201).json(newComment);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}



//update comment
export const updateComment = async (req, res) => {
    try {
        const commentid = req.params.id;
        const comment = await Comment.findById(commentid);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const { content } = req.body;
        comment.content = content;

        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//delete comment
export const deleteComment = async (req, res) => {
    try{
        const id = req.params.id;
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        await Comment.findByIdAndDelete(id);
        res.status(200).json({ message: "Comment deleted successfully" });
    }catch(error){
        res.status(404).json({ message: error.message });
    }
}

//upvote comment
export const upvoteComment = async (req, res) => {
    try{
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);

        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if(!(user.upvotedComments.includes(commentId))){
            comment.numOfUpvotes += 1;
            user.upvotedComments.push(commentId);
            await comment.save();
            await user.save();
            res.status(200).json(comment);
        }
        // await comment.save();
        // res.status(200).json(comment);
    }catch(error){
        res.status(404).json({ message: error.message });
    }
}

//downvote comment
export const downvoteComment = async (req, res) => {
    try{
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);

        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        // comment.numOfDownvotes += 1;
        // await comment.save();
        // res.status(200).json(comment);

        if(!(user.downvotedComments.includes(commentId))){
            comment.numOfDownvotes += 1;
            user.downvotedComments.push(commentId);
            await comment.save();
            await user.save();
            res.status(200).json(comment);
        }
    }catch(error){
        res.status(404).json({ message: error.message });
    }
}

//decrease upvote comment
export const decreaseUpvoteComment = async (req, res) => {
    try{
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);

        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        // comment.numOfUpvotes -= 1;
        // await comment.save();
        // res.status(200).json(comment);
        if(user.upvotedComments.includes(commentId)){
            comment.numOfUpvotes -= 1;
            user.upvotedComments.pull(commentId);
            await comment.save();
            await user.save();
            res.status(200).json(comment);
        }
    }catch(error){
        res.status(404).json({ message: error.message });
    }
}

//decrease downvote comment
export const decreaseDownvoteComment = async (req, res) => {
    try{
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);

        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        // comment.numOfDownvotes -= 1;
        // await comment.save();
        // res.status(200).json(comment);

        if(user.downvotedComments.includes(commentId)){
            comment.numOfDownvotes -= 1;
            user.downvotedComments.pull(commentId);
            await comment.save();
            await user.save();
            res.status(200).json(comment);
        }
    }catch(error){
        res.status(404).json({ message: error.message });
    }
}

/* export const checkUpvote = async (req, res) => {
    try {
        const blogid = req.params.id;
        const blog = await Blog.findById(blogid);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        const userId = req.user.id;
        //find the user
        const user = await User.findById(userId);
        if (user.upvotedBlogs.includes(blogid)) {
            res.status(200).json({ hasUpvoted: true });
        } else {
            res.status(200).json({ hasUpvoted: false });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
} */

/* //check if comment is upvoted
export const checkUpvoteComment = async (req, res) => {
    try{
        const commentid = req.params.id;
        const userid = req.user.id;

        const user = await User.findById(userid);
        
        if(user.upvotedComments.includes(commentid)){
            res.status(200).json({ hasUpvoted: true });
        }
        else{
            res.status(200).json({ hasUpvoted: false });
        }
    }catch(error){
        res.status(404).json({ message: error.message});
    }
}

//check if comment is downvoted
export const checkDownvoteComment = async (req, res) => {
    try{
        const commentid = req.params.id;
        const userid = req.user.id;

        const user = await User.findById(userid);
        
        if(user.downvotedComments.includes(commentid)){
            res.status(200).json({ hasDownvoted: true });
        }
        else{
            res.status(200).json({ hasDownvoted: false });
        }
    }catch(error){
        res.status(404).json({ message: error.message});    
    }
} */

//check whether every comment of a blog is upvoted, or downvoted, or none by a user. 
//Retrun a list of integers. 0 for none, 1 for upvote, -1 for downvote.
export const checkVoteComment = async (req, res) => {
    try{
        const blogid = req.params.id;
        const userid = req.user.id;

        const user = await User.findById(userid);
        const blog = await Blog.findById(blogid);

        const comments = blog.commentList;
        let result = [];

        for(let i = 0; i < comments.length; i++){
            if(user.upvotedComments.includes(comments[i])){
                result.push(1);
            }
            else if(user.downvotedComments.includes(comments[i])){
                result.push(-1);
            }
            else{
                result.push(0);
            }
        }
        res.status(200).json(result);
    }catch(error){
        res.status(404).json({ message: error.message});
    }
}

//show my comments
export const showMyCommentsByUpvotes = async (req, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId);

        const comments = await Comment.find({ "author" : user._id }).sort({ numOfUpvotes: -1 });
        res.status(200).json(comments);
    }catch(error){
        res.status(404).json({ message: error.message });
    }
}

//show all comments of a blog
export const showAllComments = async (req, res) => {
    try {
        const blogid = req.params.id;
        const blog = await Blog.findById(blogid).populate('commentList');
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(blog.commentList);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//show all comments by upvotes descending
export const showAllCommentsByUpvotes = async (req, res) => {
    try{
        const comments = await Comment.find().sort({ numOfUpvotes: -1 });
        res.status(200).json(comments);
    }catch(error){
        res.status(404).json({ message: error.message });
    }
}

//show all comments by downvotes descending
export const showAllCommentsByDownvotes = async (req, res) => {
    try{
        const comments = await Comment.find().sort({ numOfDownvotes: -1 });
        res.status(200).json(comments);
    }catch(error){
        res.status(404).json({ message: error.message });
    }
}
