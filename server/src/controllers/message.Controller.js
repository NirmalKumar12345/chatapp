import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../server.js";

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
    await message.populate("sender", "name profilePic");
    const receiverSocketId = getReceiverSocketId(receiverId.toString());
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",message,async()=>{
            try {
              const updateMessage = await Message.findByIdAndUpdate(
                message._id,
                {
                    delivered: true
                },
                {
                    new: true
                }
              );
                            if (!updateMessage) return;
                            const senderSocketId = getReceiverSocketId(
                                senderId.toString()
                            );
                            if (senderSocketId) {
                                io.to(senderSocketId).emit("messageDelivered", {
                                    messageId: message._id.toString(),
                                    conversationId: conversationId.toString(),
                                });
                            }
            }
           catch(error){
            console.error("Delivery acknowledgement error:",error);
           }
        });
    }
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
     const [messages,totalMessages]=await Promise.all([
        Message.find({conversation:req.params.conversationId})
        .populate("sender","name profilePic")
        .sort({createdAt:-1})
        .skip((page-1)*limit)
        .limit(limit),
        Message.countDocuments({conversation:req.params.conversationId})
     ])
      const orderedMessages = messages.reverse();
     return res.status(200).json({
        success: true,
        page,
        limit,
        totalMessages,
        totalPages: Math.ceil(totalMessages / limit),
        messages: orderedMessages
     })

    }catch(error){
        next(error)
    }
}

export const markMessagesAsRead = async(req,res,next)=>{
    try{
    const { conversationId } = req.params;
    const userId = req.user._id;
    const conversation = await Conversation.findById(conversationId);
    if(!conversation){
        return res.status(404).json({status: false,
            message: "Conversation not found"
        })
    };
    const isParticipants = conversation.participants.some((participant)=>participant.toString()===userId.toString());
    if(!isParticipants){
        return res.status(403).json({
            status: false,
            message: "Unauthorized to access this conversations"
        })
    }
    const result = await Message.updateMany({
        conversation: conversationId,
        receiver: userId,
        read: false
    },{
        $set:{
            read: true
        },
    }
);
if(result.modifiedCount===0){
        return res.status(200).json({
            success: true,
            modifiedCount: 0
        })
    }
    const otherParticipants = conversation.participants.find((participant)=>participant.toString()!==userId.toString())
    if(otherParticipants){
        const receiverSocketId=getReceiverSocketId(
            otherParticipants.toString()
        );
        if(receiverSocketId){
            io.to(receiverSocketId).emit('messagesRead',{
                conversationId,
                receiverId: userId.toString()
            })
        }
    }
 return res.status(200).json({
    success: true,
    modifiedCount: result.modifiedCount
 });
    }catch(error){
        next(error)
    }
}