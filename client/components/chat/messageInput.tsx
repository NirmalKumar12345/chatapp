"use client";

import { useEffect, useRef, useState } from "react";
import { Reply, SendHorizontal, X } from "lucide-react";

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
    <div className="shrink-0 border-t bg-background/95 px-3 py-3 md:px-5 md:py-3">

      {/* Reply Preview */}
      {replyingTo && (
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-border/70 bg-muted/50 px-3 py-2.5">
          <Reply className="size-4 shrink-0 text-primary" />
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
            className="ml-auto shrink-0 cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            aria-label="Cancel reply"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2">
        <Input
          aria-label="Message text"
          placeholder={
            replyingTo
              ? "Reply to message..."
              : "Type a message..."
          }
          value={text}
          className="h-auto min-w-0 rounded-xl border-border/70 bg-muted/40 px-4 shadow-none transition-colors focus-visible:bg-background"
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <Button
          type="button"
          size="icon"
          className="size-8 cursor-pointer rounded-xl"
          onClick={handleSend}
          disabled={!text.trim() || isPending}
          aria-label={isPending ? "Sending message" : "Send message"}
        >
          <SendHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}