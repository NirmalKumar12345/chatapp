"use client";

import { Message } from "@/types/message";
import { useAuthStore } from "@/store/authStore";

interface Props {
  message: Message;
}

export default function MessageBubble({
  message,
}: Props) {
  const { user } = useAuthStore();

  const isOwnMessage =
    message.sender._id === user?._id;

  return (
    <div
      className={`flex ${
        isOwnMessage
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs rounded-2xl px-4 py-2 ${
          isOwnMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}