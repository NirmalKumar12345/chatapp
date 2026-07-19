import { User } from "./user";

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage: string;
}