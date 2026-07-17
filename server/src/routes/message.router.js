import express from 'express'
import protect from '../middleware/auth.middleware.js';
import { sendMessage ,getMessages} from '../controllers/message.Controller.js';
 const router = express.Router();

 router.post("/",protect,sendMessage);
 router.get('/:conversationId',protect,getMessages);

 export default router;