import express from 'express'
import protect from '../middleware/auth.middleware.js';
import { createConversation, getConversation } from '../controllers/conversation.Controller.js';

const router = express.Router();

router.post('/',protect,createConversation);
router.get('/',protect,getConversation);

export default router;