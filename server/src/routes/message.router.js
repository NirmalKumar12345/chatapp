import express from 'express'
import protect from '../middleware/auth.middleware.js';
import { sendMessage ,getMessages, markMessagesAsRead, editMessage,deleteMessage} from '../controllers/message.Controller.js';
 const router = express.Router();

 router.post("/",protect,sendMessage);
 router.get('/:conversationId',protect,getMessages);
 router.patch('/:conversationId/read',protect,markMessagesAsRead);
 router.patch('/:messageId',protect,editMessage);
 router.delete('/:messageId',protect,deleteMessage);

 export default router;