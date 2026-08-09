import express from 'express'
import protect from '../middleware/auth.middleware.js';
import { sendMessage ,getMessages, markMessagesAsRead} from '../controllers/message.Controller.js';
 const router = express.Router();

 router.post("/",protect,sendMessage);
 router.get('/:conversationId',protect,getMessages);
 router.patch('/:conversationId/read',protect,markMessagesAsRead);

 export default router;