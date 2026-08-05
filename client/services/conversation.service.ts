import axiosInstance from "@/lib/axios";
import { ConversationResponse, CreateConversationResponse } from "@/types/conversation";


export const getConversations = async (): Promise<ConversationResponse> => {
  const response = await axiosInstance.get("/conversation/getConversations");
  return response.data;
}
 export const createConversation = async (receiverId: string): Promise<CreateConversationResponse>=>{
    const response = await axiosInstance.post("/conversation/createConversation",{receiverId});
    return response.data
 }