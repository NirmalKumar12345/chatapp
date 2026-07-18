
const onlineUsers =new Map();
export const getReceiverSockedId = (userId)=>{
    return onlineUsers.get(userId);
}
export const socketHandler = (io)=>{
    io.on("connection",(socket)=>{
     //user joins
     socket.on("addUser",(userId)=>{
       onlineUsers.set(userId,socket.id);
       console.log("Online Users:",onlineUsers);
     })
     // disconnect
     socket.on("disconnect",()=>{
        for (const [userId,socketId] of onlineUsers.entries()){
            if(socketId===socket.id){
                onlineUsers.delete(userId);
                break;
            }
        }
     });
    });
}