"use client";

import { MessageCircleMore } from "lucide-react";

export default function EmptyChat() {
  return (
    <div className="flex h-full flex-1 items-center justify-center bg-muted/20">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <MessageCircleMore className="h-12 w-12 text-primary" />
        </div>

        <h2 className="text-2xl font-semibold">
          Welcome to ChatApp
        </h2>

        <p className="mt-3 text-sm text-muted-foreground">
          Select a conversation from the sidebar or search for a user
          to start chatting.
        </p>

        <div className="mt-8 rounded-lg border bg-background px-5 py-3">
          <p className="text-sm text-muted-foreground">
            🔒 Your personal messages are securely stored.
          </p>
        </div>
      </div>
    </div>
  );
}