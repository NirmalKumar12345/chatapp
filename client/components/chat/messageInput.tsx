"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { useSendMessage } from "@/hooks/messages/useSendMessage";
import { socket } from "@/lib/socket";

export default function MessageInput() {
  const [text, setText] = useState("");

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    selectedConversation,
    replyingTo,
    setReplyingTo,
  } = useChatStore();

  const { user } = useAuthStore();

  const { mutate, isPending } = useSendMessage();

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (!selectedConversation) return null;

  const receiver = selectedConversation.participants.find(
    (participant) => participant._id !== user?._id
  );

  const handleTyping = (value: string) => {
    setText(value);

    if (!receiver) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (!value.trim()) {
      socket.emit("stopTyping", {
        receiverId: receiver._id,
        conversationId: selectedConversation._id,
      });

      return;
    }

    socket.emit("typing", {
      receiverId: receiver._id,
      conversationId: selectedConversation._id,
    });

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId: receiver._id,
        conversationId: selectedConversation._id,
      });
    }, 1000);
  };

  const handleSend = () => {
    if (!text.trim() || !receiver) return;

    mutate(
      {
        conversationId: selectedConversation._id,
        receiverId: receiver._id,
        text: text.trim(),

        // Reply message ID
        replyTo: replyingTo?._id ?? null,
      },
      {
        onSuccess: () => {
          setText("");

          // Clear reply mode
          setReplyingTo(null);

          socket.emit("stopTyping", {
            receiverId: receiver._id,
            conversationId: selectedConversation._id,
          });
        },
      }
    );
  };

  return (
    <div className="border-t px-4 py-3">

      {/* Reply Preview */}
      {replyingTo && (
        <div className="mb-2 flex items-center justify-between rounded-lg border-l-4 border-primary bg-muted/50 px-3 py-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-primary">
              Replying to{" "}
              {typeof replyingTo.sender === "object"
                ? replyingTo.sender.name
                : "Message"}
            </p>

            <p className="truncate text-sm text-muted-foreground">
              {replyingTo.text}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setReplyingTo(null)}
            className="ml-2 shrink-0 cursor-pointer rounded-md p-1 hover:bg-background"
            aria-label="Cancel reply"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder={
            replyingTo
              ? "Reply to message..."
              : "Type a message..."
          }
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <Button
          onClick={handleSend}
          disabled={!text.trim() || isPending}
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}