import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import searchRouter from './routes/search.route.js';
import blogRouter from './routes/blog.route.js';
import conversationRouter from './routes/conversation.route.js';
import cookieParser from 'cookie-parser';
import cors from    'cors';


dotenv.config();
mongoose.connect(process.env.MONGO).then(()=>{  
    console.log('connected to mongodb');
}
).catch((err)=>{
    console.log(err);
}
);

const app=express()

app.listen(3000,()=>{
    console.log('server is running on port 3000');
}
);
const corsOptions = {
    origin: 'https://urbannest-frontend.vercel.app', // Replace with your actual frontend URL
    credentials: true, // To accept credentials like cookies
  };
  
  app.use(cors(corsOptions));
  
app.use(express.json());
app.use(cookieParser());
app.use("/api/users",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/listings",listingRouter);
app.use("/api/search",searchRouter);
app.use("/api/conversation",conversationRouter);
app.use("/api/blogs",blogRouter);
app.use((err,req,res,next) => {
   const statusCode = err.statusCode || 500;
   const msg=err.message || "internal server error";
   return res.status(statusCode).json({
      success:false,
      statusCode,
        msg
   });
}
);

