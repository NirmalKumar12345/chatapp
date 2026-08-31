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
        className={`max-w-xs rounded-2xl px-4 py-2 shadow-sm ${
          isOwnMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <p className="wrap-break-words text-sm">
          {message.text}
        </p>

        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            isOwnMessage
              ? "text-primary-foreground/70"
              : "text-muted-foreground"
          }`}
        >
          <span>
            {new Date(
              message.createdAt
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isOwnMessage && (
            <span
              className={
                message.read
                  ? "font-semibold text-blue-500"
                  : ""
              }
            >
              {message.read ? "✓✓" : message.delivered ? "✓✓": "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}