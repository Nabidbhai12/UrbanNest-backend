import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
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
      folder: 'profilePicture',
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


export const signup = async (req, res, next) => {
  const { username, email, password, contactNumber, role, bio, profilePicture } = req.body;
console.log(req.body);
console.log("hello from signup");
  try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcryptjs.hash(password, 10);

      // Handle profile picture upload
      
      // If there's a file uploaded and req.file.path exists, use that URL
    
console.log(profilePicture);
      // Create a new user with optional fields
      const newUser = new User({
          username,
          email,
          password: hashedPassword,
          ...(profilePicture && { profilePicture}),
          ...(contactNumber && { contactNumber }),
          ...(role && { role }),
          ...(bio && { bio })
      });
console.log(newUser);
console.log("prev");
      // Save the user to the database
      await newUser.save();
      console.log("after");

      // Sending success response
      res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    //print error
      console.log(error);
      // Handle errors
      next(error);
  }
};


//create a function signin
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    // Generate a token with an expiration time (e.g., 1 hour)
    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET,
      { expiresIn: 3600 } // Expires in 1 hour (3600 seconds)
    );

    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'strict' })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res,next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
          const { password: pass, ...rest } = user._doc;
          res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest);
        } else {
          const generatedPassword =
            Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);
          const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
          const newUser = new User({
            username:
              req.body.name.split(' ').join('').toLowerCase() +
              Math.random().toString(36).slice(-4),
            email: req.body.email,
            password: hashedPassword,
            avatar: req.body.photo,
          });
          await newUser.save();
          const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
          const { password: pass, ...rest } = newUser._doc;
          res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest);
        }
      } catch (error) {
        next(error);
      }

}
export const signout = async (req, res, next) => {
    try {
        console.log("signout");
      res.clearCookie('access_token');
      res.status(200).json('User has been logged out!');
    } catch (error) {
      next(error);
    }
  };
  //
