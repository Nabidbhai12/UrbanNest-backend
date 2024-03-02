//create api route
import express from "express";
import { authenticateToken,updateProfile,getUserDetails, getUserDetailsByID } from "../controllers/user.controller.js";
import { addPropertyForSale } from "../controllers/user.controller.js";
import { getUserWishlist,getUserBoughtlist,getUserSellinglist,getUserSoldlist } from "../controllers/user.controller.js";
import { storage } from '../config/cloudinaryConfig.js';
import { verifyLoginStatus } from '../controllers/user.controller.js';

import multer from "multer";
const upload = multer({ storage });
//for single image
const upload1 = multer({ storage: storage }).single('image');
const router = express.Router();
router.get('/verify',verifyLoginStatus);
router.post('/updateProfile', authenticateToken, upload1, updateProfile);
router.get('/getUserWishist',authenticateToken,getUserWishlist);
router.get('/getUserBoughtlist',authenticateToken,getUserBoughtlist);
router.get('/getUserSellinglist',authenticateToken,getUserSellinglist);
router.get('/getUserSoldlist',authenticateToken,getUserSoldlist);
router.get('/getUserDetails',authenticateToken,getUserDetails);
router.get('/getUserDetailsByID/:userID', authenticateToken, getUserDetailsByID);
router.post(
    '/addPropertyForSale',
    authenticateToken,
    upload.array('images'),
    (error, req, res, next) => {
      console.log("Image upload test");
      if (error instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log("unexpected field");
        //console.log(req.body);
        //console.log(req.files);
        return res.status(500).json({ error: error.message });
      } else if (error) {
        // An unknown error occurred when uploading.
        return res.status(500).json({ error: 'An unknown error occurred when uploading.' });
      }
  
      // Everything went fine.
 
      
      next();
    },
    addPropertyForSale
  );

export default router;