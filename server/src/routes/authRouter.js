import express from 'express';
import { refreshAccessToken,logout, register } from '../controllers/userController.js';
import validate from '../middleware/validate.js';
import { registerSchema } from '../validations/authvalidation.js';

const router = express.Router();

router.post("/register",validate(registerSchema),register);
router.post("/refresh",refreshAccessToken);
router.post("/logout", logout);

export default router;