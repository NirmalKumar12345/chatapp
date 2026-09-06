"use client";

import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { User } from "lucide-react";
import NewConversationDialog from "../chat/newConversationDialog";


export default function SidebarHeader() {
  const { user } = useAuthStore();

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-muted">
          {user?.profilePic ? (
            <Image
              src={user.profilePic}
              alt={user.name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div>
          <h2 className="font-semibold">
            {user?.name}
          </h2>

          <p className="text-sm text-muted-foreground">
            @{user?.username}
          </p>
        </div>
      </div>

      {/* Right */}
      <NewConversationDialog />
    </div>
  );
}