
const onlineUsers =new Map();
export const getReceiverSocketId = (userId)=>{
    return onlineUsers.get(userId);
}
export const socketHandler = (io)=>{
    io.on("connection",(socket)=>{
      console.log("Socket Connected:",socket.id);  
     //user joins
     socket.on("addUser",(userId)=>{
       onlineUsers.set(userId,socket.id);
       io.emit("onlineUsers",[...onlineUsers.keys()]);
     })
     //Typing
     socket.on("typing",({receiverId,conversationId})=>{
      const receiverSocketId=getReceiverSocketId(receiverId);
      if(receiverSocketId){
        io.to(receiverSocketId).emit("typing",{conversationId});
      }
     })
     socket.on("stopTyping",({receiverId,conversationId})=>{
      const receiverSocketId=getReceiverSocketId(receiverId);
      if(receiverSocketId){
        io.to(receiverSocketId).emit("stopTyping",{conversationId});
      }
     })
     // disconnect
     socket.on("disconnect",()=>{
        for (const [userId,socketId] of onlineUsers.entries()){
            if(socketId===socket.id){
                onlineUsers.delete(userId);
                break;
            }
        }
        io.emit("onlineUsers",[...onlineUsers.keys()]);
        console.log("User Disconnected:",socket.id);
     });
    });
}