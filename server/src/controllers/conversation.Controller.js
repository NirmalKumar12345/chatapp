import Conversation from "../models/conversation.js";
import User from "../models/user.js";

export const createConversation = async(req,res,next)=>{
    try{
      const senderId = req.user._id;
      const {receiverId}= req.body;
       if (senderId.toString() === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You can't chat with yourself",
      });
    }
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

      let conversation = await Conversation.findOne({
        participants:{
              $all:[senderId,receiverId]
        }
      }).populate(
          "participants",
          "name username profilePic"
        );
      if(conversation){
        return res.status(200).json({
        success: true,
        conversation
      });
      }
      conversation = await Conversation.create({
        participants:[senderId,receiverId]
      });
      conversation = await Conversation.findById(conversation._id).populate(
        "participants",
        "name username profilePic"
      );
      return res.status(201).json({
        success: true,
        conversation
      })
    }
    catch(error){
        next(error);
    }
}

export const getConversation = async(req,res,next)=>{
  try{
   const conversations = await Conversation.find({
    participants: req.user._id
   }).populate("participants","name username email profilePic isOnline lastSeen").sort({lastMessageAt: -1});
   return res.status(200).json({success: true,conversations});
  }
  catch(error){
    next(error)
  }
}