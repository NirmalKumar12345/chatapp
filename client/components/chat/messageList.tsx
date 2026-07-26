"use client";

import { useChatStore } from "@/store/chatStore";
import { useMessages } from "@/hooks/messages/useMessages";
import MessageBubble from "./messageBubble";

export default function MessageList() {
  const { selectedConversation } = useChatStore();

  const {
    data,
    isLoading,
    isError,
  } = useMessages(selectedConversation?._id);

  if (!selectedConversation) return null;

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        Loading messages...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center">
        Failed to load messages.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {data?.messages.map((message) => (
        <MessageBubble
          key={message._id}
          message={message}
        />
      ))}
    </div>
  );
}