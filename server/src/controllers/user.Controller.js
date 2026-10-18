import User from "../models/user.js";

export const getAllUsers = async (req,res,next)=>{
    try{
    const loggedInUserId = req.user._id;
    const keyword = req.query.search
    ? {
        $or:[
            {
              name:{
                $regex: req.query.search,
                $options: "i"
              },
            },
            {
            username:{
                $regex: req.query.search,
                $options: "i"
            }
            }
        ]
    }: {}
    const users = await User.find(keyword).find({_id:{$ne: loggedInUserId}}).sort({
        username: 1,
      })
      .limit(20).select("-password -refreshToken")
    return res.status(200).json({
        success: true,
        users
    })
}
catch(error){
    next(error)
}
}
export const getUserById = async (req,res,next)=>{
    try{
        const user = await User.findById(req.params.id).select("-password -refreshToken");
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch(error){
        next(error)
    }
}
export const getMyProfile = async (req,res,next)=>{
    try {
        const user = await User.findById(req.user._id).select("-password -refreshToken");
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        next(error);
    }
}

export const updateMyProfile = async (req,res,next)=>{
    try{
      const user = await User.findById(req.user._id);
      if(!user){
        return res.status(400).json({
            success: false,
            message: "User not found"
        })
      }
      const {name,username,bio}=req.body;
      if (name !== undefined) user.name=name;
      if(username !==undefined) user.username= username;
      if(bio!==undefined) user.bio = bio;
      await user.save();
      //exclude sensitive data
      const safeUser = await User.findById(user._id).select("-password -refreshToken")
      return res.status(200).json({
        success: true,
        message: "User Updated successfully",
        user: safeUser
      })
    }
    catch(error){
        if(error.code===11000){
            const duplicateField = Object.keys(error.keyPattern ?? {})[0];
            const messages = {username: "Username already taken"};
            return res.status(409).json({success: false,message: messages[duplicateField] ?? "This value already exists"});
        }
        next(error)
    }
}

export const UploadProfilePicture = async (req,res,next)=>{
    try{
      if(!req.file){
        return res.status(400).json({
            success: false,
            message: "Please select a profile picture"
        })
      }
      const user = await User.findById(req.user._id);
      if(!user){
        return res.status(404).json({
            success: false,
            message: "user not found"
        })
      }
      //save the Cloudinary image URL
      user.profilePic= req.file.path
      await user.save();
      const safeUser = await User.findById(user._id).select("-password -refreshToken");
      return res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
        user: safeUser
      })
    }
    catch(error){
        next(error);
    }
}