import { create } from "zustand";
import { Conversation } from "@/types/conversation";

interface ChatStore {
  selectedConversation: Conversation | null;

  shouldScrollToBottom: boolean;

  showNewMessageIndicator: boolean;
  isTyping: boolean;

  setSelectedConversation: (
    conversation: Conversation | null
  ) => void;

  triggerScrollToBottom: () => void;

  resetScrollToBottom: () => void;

  setShowNewMessageIndicator: (
    value: boolean
  ) => void;
  setIsTyping: (typing: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedConversation: null,

  shouldScrollToBottom: false,

  showNewMessageIndicator: false,
  isTyping: false,
  setIsTyping: (typing) =>
    set({
      isTyping: typing,
    }),
  setSelectedConversation: (conversation) =>
    set({
      selectedConversation: conversation,
      shouldScrollToBottom: true,
      showNewMessageIndicator: false,
    }),

  triggerScrollToBottom: () =>
    set({
      shouldScrollToBottom: true,
    }),

  resetScrollToBottom: () =>
    set({
      shouldScrollToBottom: false,
    }),

  setShowNewMessageIndicator: (value) =>
    set({
      showNewMessageIndicator: value,
    }),
}));