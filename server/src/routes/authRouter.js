import express from 'express';
import { refreshAccessToken,logout, register, login, getProfile } from '../controllers/auth.Controller.js';
import validate from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../validations/authvalidation.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/register",validate(registerSchema),register);
router.post("/login",validate(loginSchema),login);
router.get("/refresh",refreshAccessToken);
router.get("/me",protect,getProfile)
router.post("/logout", logout);

export default router;
