"use client";

import { useChatStore } from "@/store/chatStore";
import { useMessages } from "@/hooks/messages/useMessages";
import MessageBubble from "./messageBubble";
import { useEffect, useRef } from "react";

export default function MessageList() {
  const { selectedConversation } = useChatStore();

  const {
    data,
    isLoading,
    isError,
  } = useMessages(selectedConversation?._id);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  },[data?.messages])
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
  if (!data?.messages.length) {
  return (
    <div className="flex flex-1 items-center justify-center text-muted-foreground">
      No messages yet. Start the conversation 👋
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
      <div ref={bottomRef} />
    </div>
  );
}