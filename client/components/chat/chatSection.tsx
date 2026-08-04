"use client";

import { useChatStore } from "@/store/chatStore";
import ChatHeader from "./chatHeader";
import MessageInput from "./messageInput";
import MessageList from "./messageList";
import EmptyChat from "./emptyChat";
import { useSocket } from "@/hooks/socket/useSocket";
import { useReceiverMessage } from "@/hooks/socket/useReceiverMessage";
import { useTyping } from "@/hooks/socket/useTyping";

export default function ChatSection() {
  const { selectedConversation } = useChatStore();
  useSocket();
  useReceiverMessage();
  useTyping();
  if (!selectedConversation) {
    return <EmptyChat />;
  }
  return (
    <div className="flex h-full flex-col">
      <ChatHeader />

      <MessageList />

      <MessageInput key={selectedConversation._id} />
    </div>
  );
}