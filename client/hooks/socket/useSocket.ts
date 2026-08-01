import { socket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export const useSocket =()=>{
    const {user,setOnlineUsers} = useAuthStore();
    useEffect(()=>{
     if (!user?._id) return;
     socket.connect();
     const onConnect =()=>{
     console.log("Socket Connected:",socket.id);   
     socket.emit("addUser",user._id);
     };
     const handleOnlineUsers=(users: string[])=>{
        setOnlineUsers(users)
     };
     socket.on("connect",onConnect);
     socket.on("onlineUsers",handleOnlineUsers);
     return ()=>{
        socket.off("connect",onConnect);
        socket.off("onlineUsers",handleOnlineUsers);
        socket.disconnect();
     };
    },[user,setOnlineUsers]);
}