"use client";

import { User } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { Conversation } from "@/types/conversation";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import Image from "next/image";

interface ConversationItemProps {
    conversation: Conversation;
}
export default function ConversationItem({
    conversation,
}: ConversationItemProps) {
    const formattedTime = conversation.lastMessageAt
        ? isToday(new Date(conversation.lastMessageAt))
            ? format(new Date(conversation.lastMessageAt), "hh:mm a")
            : isYesterday(new Date(conversation.lastMessageAt))
                ? "Yesterday"
                : format(new Date(conversation.lastMessageAt), "dd/MM/yy")
        : "";
    const { selectedConversation, setSelectedConversation } = useChatStore();
    const isActive = selectedConversation?._id === conversation._id
    const { user, onlineUsers } = useAuthStore();
    const participant = conversation.participants.find(
        (p) => p._id !== user?._id
    );
    const isOnline = participant ? onlineUsers.includes(participant._id) : false;
    return (
        <div
            onClick={() => setSelectedConversation(conversation)}
            className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-200 ${isActive
                ? "bg-primary/10"
                : "hover:bg-muted"
                }`}
        >
            {/* Avatar */}
            <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-muted">
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

            {/* User Info */}
            <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">
                    {participant?.name}
                </h3>

                <p className="truncate text-xs text-muted-foreground">
                    {conversation.lastMessage ?? "No messages yet"}
                </p>
            </div>
            <div className='flex flex-col items-end gap-1'>
                {/* Time */}
                <span className="text-xs text-muted-foreground">
                    {formattedTime}
                </span>
                {conversation.unreadCount > 0 && ( <span className="bg-green-400 text-white text-xs w-fit h-fit px-2 py-[3px] rounded-full text-center">
                    {
                        conversation.unreadCount > 999 ? "+999" : conversation.unreadCount
                    }
                </span> )}
            </div>
        </div>
    );
}