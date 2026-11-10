"use client";

import { useState } from "react";
import Image from "next/image";
import { AlignLeft, AtSign, Mail, Phone, User } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useUserProfileById } from "@/hooks/users/useUserProfile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function ChatHeader() {
  const { selectedConversation, isTyping } = useChatStore();
  const { user, onlineUsers } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const participant = selectedConversation?.participants.find(
    (p) => p._id !== user?._id
  );
  const isOnline = onlineUsers.includes(participant?._id || "");
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useUserProfileById(participant?._id, isProfileOpen);

  if (!selectedConversation || !participant) return null;

  const profile = profileData?.user;

  return (
    <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
      <div className="flex items-center justify-between border-b px-5 py-[7px]">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setIsProfileOpen(true)}
          aria-label={`View ${participant.name}'s profile`}
        >
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-muted">
                <Tooltip>
            <TooltipTrigger
              render={
                <span className="flex cursor-pointer size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                  {participant.profilePic ? (
                    <Image
                  src={participant.profilePic}
                  alt=""
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
                  ) : (
                    <User className="size-6 text-muted-foreground" />
                  )}
                </span>
              }
            />
            <TooltipContent>
              <p>View profile</p>
            </TooltipContent>
          </Tooltip>
            </div>

            {isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
            )}
          </div>

          <span>
            <span className="block font-semibold">{participant.name}</span>
            <span
              className={`block text-sm transition-colors ${
                isTyping ? "text-green-500" : "text-muted-foreground"
              }`}
            >
              {isTyping ? "Typing..." : isOnline ? "Online" : "Offline"}
            </span>
          </span>
        </button>
      </div>

      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            Contact information for {participant.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-2">
          <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-muted">
            {profile?.profilePic || participant.profilePic ? (
              <Image
                src={profile?.profilePic || participant.profilePic}
                alt={profile?.name || participant.name}
                width={80}
                height={80}
                className="size-full object-cover"
              />
            ) : (
              <User className="size-11 text-muted-foreground" />
            )}
          </div>
          <h3 className="text-base font-semibold">
            {profile?.name || participant.name}
          </h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <AtSign className="size-3.5" />
            {profile?.username || participant.username}
          </p>
        </div>

        {isProfileLoading ? (
          <p className="text-center text-sm text-muted-foreground">
            Loading profile...
          </p>
        ) : isProfileError ? (
          <p className="text-center text-sm text-destructive" role="alert">
            Could not load profile details.
          </p>
        ) : profile ? (
          <div className="grid gap-2">
            <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="break-words text-sm font-medium">
                  {profile.email || "Not added"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Mobile</p>
                <p className="break-words text-sm font-medium">
                  {profile.mobile || "Not added"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-3">
              <AlignLeft className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">About</p>
                <p className="break-words text-sm font-medium">
                  {profile.bio?.trim() || "Not added"}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}