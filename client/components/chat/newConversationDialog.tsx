"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import SearchUserList from "./searchUserList";

export default function NewConversationDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
        >
          <MessageSquarePlus className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            New Conversation
          </DialogTitle>
        </DialogHeader>

        <SearchUserList
          closeDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}