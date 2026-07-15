import express from 'express';
import { refreshAccessToken,logout, register, login } from '../controllers/userController.js';
import validate from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../validations/authvalidation.js';

const router = express.Router();

router.post("/register",validate(registerSchema),register);
router.post("/login",validate(loginSchema),login);
router.post("/refresh",refreshAccessToken);
router.post("/logout", logout);

export default router;