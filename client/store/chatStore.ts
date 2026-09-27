import { create } from "zustand";
import { Conversation } from "@/types/conversation";
import { Message } from "@/types/message";

interface ChatStore {
  selectedConversation: Conversation | null;
  highlightedMessageId: string | null;
  shouldScrollToBottom: boolean;
  replyingTo: Message | null;
  showNewMessageIndicator: boolean;
  isTyping: boolean;

  setSelectedConversation: (
    conversation: Conversation | null
  ) => void;
  setReplyingTo: (message: Message | null) => void;
  triggerScrollToBottom: () => void;

  resetScrollToBottom: () => void;
  setHighlightedMessageId: (messageId: string | null) => void;
  setShowNewMessageIndicator: (
    value: boolean
  ) => void;
  setIsTyping: (typing: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedConversation: null,
  highlightedMessageId: null,
  shouldScrollToBottom: false,

  showNewMessageIndicator: false,
  isTyping: false,
  replyingTo: null,
setHighlightedMessageId: (messageId) =>
  set({
    highlightedMessageId: messageId,
  }),
setReplyingTo: (message) =>
  set({
    replyingTo: message,
  }),
  setIsTyping: (typing) =>
    set({
      isTyping: typing,
    }),
  setSelectedConversation: (conversation) =>
    set({
      selectedConversation: conversation,
      shouldScrollToBottom: true,
      replyingTo: null,
      highlightedMessageId: null,
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