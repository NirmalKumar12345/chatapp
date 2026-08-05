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