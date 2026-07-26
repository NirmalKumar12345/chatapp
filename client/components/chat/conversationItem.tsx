"use client";

import { User } from "lucide-react";

import { Conversation } from "@/types/conversation";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { Avatar, AvatarImage } from "../ui/avatar";

interface ConversationItemProps {
    conversation: Conversation;
}
export default function ConversationItem({
    conversation,
}: ConversationItemProps) {
    const { selectedConversation, setSelectedConversation } = useChatStore();
    const isActive = selectedConversation?._id === conversation._id
    const { user } = useAuthStore();
    const participant = conversation.participants.find(
        (p) => p._id !== user?._id
    );

    return (
        <div
            onClick={() => setSelectedConversation(conversation)}
            className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-200 ${isActive
                ? "bg-primary/10"
                : "hover:bg-muted"
                }`}
        >
            {/* Avatar */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                {participant?.profilePic ? (
                    <Avatar>
                        <AvatarImage src={participant.profilePic} />
                    </Avatar>
                ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                )}
                {participant?.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                )}
            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">
                    {participant?.name}
                </h3>

                <p className="truncate text-xs text-muted-foreground">
                    {conversation.lastMessage ?? "No messages yet"}
                </p>
            </div>

            {/* Time */}
            <div className="text-xs text-muted-foreground">
                {/* Later we'll format updatedAt */}
            </div>
        </div>
    );
}