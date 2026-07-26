import { User } from "./user";

export interface Message {
  _id: string;
  conversation: string;
  sender: User;
  receiver: string;
  text: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessagesResponse {
  success: boolean;
  page: number;
  limit: number;
  totalMessages: number;
  totalPages: number;
  messages: Message[];
}

export interface SendMessagePayload {
  conversationId: string;
  receiverId: string;
  text: string;
}