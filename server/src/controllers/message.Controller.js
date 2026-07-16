import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

export const sendMessage = async (req,res,next)=>{
    try{const senderId = req.user._id;
    const {conversationId,receiverId,text}=req.body;
    const conversation = await Conversation.findById(conversationId);
    if(!conversation){
        return res.status(404).json({
            success: false,
            message: "Coversation not found"
        })
    }
    const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        receiver: receiverId,
        text
    });
    //update conversation
    conversation.lastMessage= text;
    conversation.lastMessageAt = new Date();
    await conversation.save();
    return res.status(201).json({
        success: true,
        message
    })}
    catch(error){
        next(error)
    }
    
}