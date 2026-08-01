"use client";

import Image from "next/image";
import { User } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";

export default function ChatHeader() {
  const { selectedConversation } = useChatStore();
  const { user, onlineUsers } = useAuthStore();

  if (!selectedConversation) return null;

  const participant = selectedConversation.participants.find(
    (p) => p._id !== user?._id
  );
  const isOnline = onlineUsers.includes(participant?._id || "");

  if (!participant) return null;

  return (
    <div className="flex p-1 items-center justify-between border-b px-5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-muted">
            {participant?.profilePic ? (
              <Image
                src={participant.profilePic}
                alt={participant.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
          )}
        </div>

        <div>
          <h2 className="font-semibold">
            {participant.name}
          </h2>

          <p className="text-sm text-muted-foreground">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
}