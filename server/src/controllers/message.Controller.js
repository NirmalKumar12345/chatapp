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

export const getMessages = async(req,res,next)=>{
    try{
     const page = Number(req.query.page) || 1;
     const limit = 20;  
     const conversation = await Conversation.findById(req.params.conversationId);
     if(!conversation){
        return res.status(404).json({
            success: false,
            message: "Conversation not found"
        })
     }
     const isParticipants = conversation.participants.some((participant)=>participant.toString()===req.user._id.toString());
     if(!isParticipants){
        return res.status(403).json({
            success: false,
            message: "Unauthorized to access this conversation"
        })
     }
     const messages = await Message.find({conversation: req.params.conversationId}).populate('sender','name profilePic').sort({createdAt:1}).skip((page-1)*limit).limit(limit);
     const totalMessages = await Message.countDocuments({conversation: req.params.conversationId});
     return res.status(200).json({
        success: true,
        page,
        limit,
        totalMessages,
        totalPages: Math.ceil(totalMessages / limit),
        messages
     })

    }catch(error){
        next(error)
    }
}