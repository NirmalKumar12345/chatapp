import { success } from "zod";
import Conversation from "../models/conversation.js";

export const createConversation = async(req,res,next)=>{
    try{
      const senderId = req.user._id;
      const {receiverId}= req.body;
      let conversation = await Conversation.findOne({
        participants:{
              $all:[senderId,receiverId]
        }
      });
      if(conversation){
        return res.status(200).json({
        success: true,
        conversation
      });
      }
      conversation = await Conversation.create({
        participants:[senderId,receiverId]
      });
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
   }).populate("participants","name email profilePic isOnline lastSeen").sort({lastMessageAt: -1});
   return res.status(200).json({success: true,conversations});
  }
  catch(error){
    next(error)
  }
}