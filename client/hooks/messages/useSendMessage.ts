/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendMessage } from "@/services/message.service";
import { useChatStore } from "@/store/chatStore";
import { MessagesResponse } from "@/types/message";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useSendMessage = ()=>{
    const queryClient = useQueryClient();
    const { triggerScrollToBottom } = useChatStore();
    return useMutation({
        mutationFn: sendMessage,
        onSuccess: (data)=>{
            const newMessage = data.message;
            queryClient.setQueryData(
                ["messages",newMessage.conversation],
                (oldData: | {
                    pages: MessagesResponse[];
                    pageParams: number[];
                } | undefined)=>{
                    if(!oldData) return oldData;
                    const pages =[...oldData.pages];
                    const messageExits = pages.some((page)=>page.messages.some((message)=>message._id===newMessage._id))
                    if(messageExits){
                        return oldData;
                    }
                    pages[0]={
                        ...pages[0],
                        messages:[...pages[0].messages,newMessage],
                    };
                    return {
                        ...oldData,
                        pages,
                    };
                }
            );
            queryClient.setQueryData(
                ["conversations"],
                (oldData:any)=>{
                    if(!oldData) return oldData;
                    const conversations = oldData.conversations.map((conversation: any)=>{
                        if(conversation._id !== newMessage.conversation) return conversation;
                        return {
                            ...conversation,
                            lastMessage: newMessage.text,
                            lastMessageAt: newMessage.createdAt,
                        }
                    });
                    conversations.sort((a:any,b:any)=> new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
                    return {
                        ...oldData,
                        conversations,
                    }
                }
            )
            triggerScrollToBottom();
        }
    })
}