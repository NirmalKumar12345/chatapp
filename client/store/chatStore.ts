import { create } from "zustand";
import { Conversation } from "@/types/conversation";

interface ChatStore {
  selectedConversation: Conversation | null;

  setSelectedConversation: (
    conversation: Conversation | null
  ) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedConversation: null,

  setSelectedConversation: (conversation) =>
    set({
      selectedConversation: conversation,
    }),
}));