import { User } from "./user";

export interface Message {
  _id: string;
  conversation: string;
  sender: User;
  receiver: string;
  text: string;
  read: boolean;
  edited: boolean;
  deleted: boolean;
  delivered: boolean;
  replyTo?: {
    _id: string;
    text: string;
    sender:
    | string
    | {
      _id: string;
      name: string;
      profilePic?: string;
    };
  } | null;
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
  replyTo?: string | null;
}