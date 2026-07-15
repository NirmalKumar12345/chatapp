import express from 'express';
import { getAllUsers } from '../controllers/user.Controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", protect, getAllUsers);

export default router;