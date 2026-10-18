import express from 'express';
import { getAllUsers,getMyProfile,updateMyProfile, UploadProfilePicture,getUserById } from '../controllers/user.Controller.js';
import protect from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { UpdateProfileSchema } from '../validations/userValidation.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.get("/", protect, getAllUsers);
router.get("/getUserById/:id", protect, getUserById);
router.get("/getMyProfile", protect, getMyProfile);
router.patch("/updateMyProfile", protect, validate(UpdateProfileSchema), updateMyProfile);
router.patch("/uploadProfilePicture",protect,upload.single("profilePic"),UploadProfilePicture)

export default router;