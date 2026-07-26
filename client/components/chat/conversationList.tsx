"use client";

import { useConversations } from "@/hooks/conversations/useConversations";
import ConversationItem from "./conversationItem";

export default function ConversationList() {
  const { data, isLoading, isError } = useConversations();

  if (isLoading) {
    return (
      <div className="flex justify-center py-10 text-sm text-muted-foreground">
        Loading conversations...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-10 text-sm text-red-500">
        Failed to load conversations.
      </div>
    );
  }

  if (!data?.conversations?.length) {
    return (
      <div className="flex justify-center py-10 text-sm text-muted-foreground">
        No conversations yet.
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {data.conversations.map((conversation) => (
        <ConversationItem
          key={conversation._id}
          conversation={conversation}
        />
      ))}
    </div>
  );
}