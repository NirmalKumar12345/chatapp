import axiosInstance from "@/lib/axios";
import { ConversationResponse } from "@/types/conversation";


export const getConversations = async (): Promise<ConversationResponse> => {
  const response = await axiosInstance.get("/conversations");
  return response.data;
}
 export const createConversation = async (receiverId: string): Promise<ConversationResponse>=>{
    const response = await axiosInstance.post("/conversation",{receiverId});
    return response.data
 }