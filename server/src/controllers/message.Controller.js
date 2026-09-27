import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../server.js";

export const sendMessage = async (req,res,next)=>{
    try{const senderId = req.user._id;
    const {conversationId,receiverId,text,replyTo}=req.body;
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
        text,
        replyTo: replyTo || null
    });
    //update conversation
    conversation.lastMessage= text;
    conversation.lastMessageAt = new Date();
    await conversation.save();
    await message.populate([
  {
    path: "sender",
    select: "name profilePic",
  },
  {
    path: "replyTo",
    populate: {
      path: "sender",
      select: "name profilePic",
    },
  },
]);
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
export const editMessage = async(req,res,next)=>{
    try {
     const {messageId}= req.params;
     const {text} = req.body;
     const userId = req.user._id;
     if (!text?.trim()){
        return res.status(400).json({
            success: false,
            message: "Message cannot be empty"
        })
     }
     const message = await Message.findById(messageId);
     if (!message){
        return res.status(404).json({
            success: false,
            message: "Message not found"
        })
     }
     if (message.sender.toString()!== userId.toString()){
        return res.status(403).json({
            success: false,
            message: "only edit your own message"
        })
     }
     if(message.deleted){
        return res.status(400).json({
            success: false,
            message: "Deleted message cannot be edited"
        })
     }
     message.text= text.trim()
     message.edited=true
     await message.save()
     await message.populate("sender", "name profilePic");
     const receiverSocketId= getReceiverSocketId(message.receiver.toString());
     if(receiverSocketId){
        io.to(receiverSocketId).emit("messageEdited",message)
     }
     return res.status(200).json({
        success:true,
        message
     })

    }catch(error){
        next(error)
    }
}
export const deleteMessage = async(req,res,next)=>{
    try{
     const {messageId}= req.params;
     const userId = req.user._id;
     const message = await Message.findById(messageId);
     if (!message){
        return res.status(404).json({
            success: false,
            message: "Message not found"
        })
     }
     if (message.sender.toString()!==userId.toString()){
        return res.status(400).json({
            success: false,
            message: "You can delete your own messages"
        })
     }
     if (message.deleted) {
      return res.status(400).json({
        success: false,
        message: "Message already deleted",
      });
    }
     message.deleted= true;
     message.text= "This message was deleted"
     await message.save();
     const receiverSocketId = getReceiverSocketId(message.receiver.toString());
     if(receiverSocketId){
        io.to(receiverSocketId).emit("messageDeleted",{
            messageId:  message._id.toString(),
            conversationId: message.conversation.toString()
        }
        )
     }
     return res.status(200).json({
        success: true,
        message
     })
    }
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
        .populate({
            path: "replyTo",
            select: "text sender",
            populate: {
                path: "sender",
                select: "name profilePic"
            }
        })
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