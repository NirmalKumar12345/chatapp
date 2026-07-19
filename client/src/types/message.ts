import { User } from "./user";

export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  text: string;
  createdAt: string;
}