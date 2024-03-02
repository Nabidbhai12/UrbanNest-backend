import express from 'express';
import { getListingsByType } from '../controllers/listing.controller.js'; 
import { addListing } from '../controllers/listing.controller.js';
const router = express.Router();
router.get('/getlisting/:id', getListingsByType);
router.post('/addlisting', addListing);

export default router;