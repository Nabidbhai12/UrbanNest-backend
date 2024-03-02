import   express   from "express";

import { authenticateToken }   from "../controllers/user.controller.js";

const router= express.Router();

import { sendMessage    } from  "../controllers/conversation.controller.js";
 import { getAllusers } from   "../controllers/conversation.controller.js";

import { getUserConversations }    from "../controllers/conversation.controller.js";


export default   router;


router.post('/sendMessage', authenticateToken,sendMessage);

router.get('/getMessage', authenticateToken, getUserConversations);
router.get('/getUsers', authenticateToken, getAllusers);


