import axiosInstance from "@/lib/axios";
import { MessagesResponse, SendMessagePayload } from "@/types/message";

export const getMessage = async(conversationId: string,page=1): Promise<MessagesResponse>=>{
    const response = await axiosInstance.get(`/messages/${conversationId}?page=${page}`)
    return response.data
}

export const sendMessage = async(payload: SendMessagePayload)=>{
    const response = await axiosInstance.post("/messages",payload);
    return response.data
}