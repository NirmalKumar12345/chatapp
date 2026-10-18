import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const allowedMimeTypes = [
"image/jpeg",
"image/png",
"image/webp",
]

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "profilePic") {
      return {
        folder: "chatapp/profilePics",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      };
    }

    return {
      folder: "chatapp",
      resource_type: "auto",
    };
  },
});

const fileFilter = (req,file,callback)=>{
    if(!allowedMimeTypes.includes(file.mimetype)){
        return callback(new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed."));
    }
    callback(null,true);
}

const upload = multer({ storage,fileFilter,limits: { fileSize: 5 * 1024 * 1024, files: 1 } }); // Limit file size to 5MB

export default upload;