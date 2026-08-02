"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { useSendMessage } from "@/hooks/messages/useSendMessage";

export default function MessageInput() {
  const [text, setText] = useState("");

  const { selectedConversation } = useChatStore();
  const { user } = useAuthStore();

  const { mutate, isPending } = useSendMessage();

  if (!selectedConversation) return null;

  const receiver = selectedConversation.participants.find(
    (participant) => participant._id !== user?._id
  );

  const handleSend = () => {
    if (!text.trim() || !receiver) return;

    mutate(
      {
        conversationId: selectedConversation._id,
        receiverId: receiver._id,
        text: text.trim(),
      },
      {
        onSuccess: () => {
          setText("");
        },
      }
    );
  };

  return (
    <div className="border-t px-4 py-3">
      <div className="flex gap-2">
        <Input
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
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