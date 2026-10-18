"use client";

import NewConversationDialog from "../chat/newConversationDialog";
import ProfileDialog from "./profileDialog";

export default function SidebarHeader() {
  return (
    <div className="flex items-center justify-between border-b px-4 py-1.5">
      <ProfileDialog />
      <NewConversationDialog />
    </div>
  );
}