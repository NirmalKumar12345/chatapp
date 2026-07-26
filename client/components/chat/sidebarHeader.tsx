"use client";

import { useAuthStore } from "@/store/authStore";

export default function SidebarHeader() {
  const { user } = useAuthStore();

  return (
    <div className="border-b px-4 py-1">
      <h2 className="text-lg font-semibold">
        {user?.name}
      </h2>

      <p className="text-sm text-muted-foreground">
        {user?.email}
      </p>
    </div>
  );
}