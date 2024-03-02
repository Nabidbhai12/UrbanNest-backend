import express from 'express';
import { searchProperties,getListingById} from '../controllers/search.controller.js';
import { authenticateToken } from '../controllers/user.controller.js';
const router = express.Router();
router.post('/property',authenticateToken,searchProperties);
router.get('/property/:listingId',authenticateToken,getListingById);


export default router;