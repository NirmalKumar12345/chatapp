import express from 'express'
import protect from '../middleware/auth.middleware.js';
import { sendMessage } from '../controllers/message.Controller.js';
 const router = express.Router();

 router.post("/",protect,sendMessage);

 export default router;