import { User } from "./user";

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage: string;
  lastMessageAt: string;
  updatedAt: string;
}
export interface ConversationResponse {
  success: boolean;
  conversations: Conversation[];
}
export interface CreateConversationResponse {
  success: boolean;
  conversation: Conversation;
}