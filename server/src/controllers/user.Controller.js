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
            email:{
                $regex: req.query.search,
                $options: "i"
            } 
            }
        ]
    }: {}
    const user = await User.find(keyword).find({_id:{$ne: loggedInUserId}}).select("-password -refreshToken")
    return res.status(200).json({
        status: true,
        user
    })
}
catch(error){
    next(error)
}
}