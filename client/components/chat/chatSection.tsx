"use client";

import { useChatStore } from "@/store/chatStore";
import ChatHeader from "./chatHeader";
import MessageInput from "./messageInput";
import MessageList from "./messageList";
import EmptyChat from "./emptyChat";
import { useSocket } from "@/hooks/socket/useSocket";
import { useReceiverMessage } from "@/hooks/messages/useReceiverMessage";

export default function ChatSection() {
  const { selectedConversation } = useChatStore();
  useSocket();
  useReceiverMessage();
  if (!selectedConversation) {
    return <EmptyChat />;
  }
  return (
    <div className="flex h-full flex-col">
      <ChatHeader />

      <MessageList />

      <MessageInput />
    </div>
  );
}