/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { socket } from "@/lib/socket";
import { useChatStore } from "@/store/chatStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useReceiverMessage = ()=>{
    const queryClient = useQueryClient();
    const {selectedConversation} = useChatStore();
    useEffect(()=>{
        const handleNewMessage=(message:any)=>{
            if(selectedConversation && message.conversation !== selectedConversation._id){
            return;
            }
            queryClient.setQueryData(
                ["messages",message.conversation],
                (oldData: any)=>{
                    if(!oldData) return oldData;
                    return {
                        ...oldData,
                        messages:[...oldData.messages,message]
                    }
                }
            );
            queryClient.invalidateQueries({
                queryKey:["conversations"]
            });
        }
        socket.on("newMessage",handleNewMessage);
        return ()=>{
            socket.off("newMessage",handleNewMessage);
        }
    },[queryClient,selectedConversation])
};