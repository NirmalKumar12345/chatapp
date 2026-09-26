"use client";

import { useState } from "react";
import { Copy, Check, CheckCheck, MoreVertical, Pencil, Trash2, Reply } from "lucide-react";
import { format } from "date-fns";

import { Message } from "@/types/message";
import { useAuthStore } from "@/store/authStore";
import { useEditMessage } from "@/hooks/messages/useEditMessage";
import { useDeleteMessage } from "@/hooks/messages/useDeleteMessage";
import { toast } from "sonner";
import { useChatStore } from "@/store/chatStore";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({
  message,
}: MessageBubbleProps) {
  const { user } = useAuthStore();
  // const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const { setReplyingTo } = useChatStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const { mutate: editMessage, isPending: isEditingMessage } =
    useEditMessage();

  const { mutate: deleteMessage, isPending: isDeletingMessage } =
    useDeleteMessage();

  const currentUserId = user?._id?.toString();

  const senderId = message.sender._id;

  const isOwnMessage = senderId === currentUserId;

  const handleEdit = () => {
    setEditText(message.text);
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleCancelEdit = () => {
    setEditText(message.text);
    setIsEditing(false);
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setShowMenu(false);
    } catch (error) {
      toast.error(`faild to copy message: ${error}`);
    }
  };
  const handleReply = () => {
    setReplyingTo(message);
    setShowMenu(false);
  };
  const handleSaveEdit = () => {
    const trimmedText = editText.trim();

    if (!trimmedText) return;

    if (trimmedText === message.text) {
      setIsEditing(false);
      return;
    }

    editMessage(
      {
        messageId: message._id,
        text: trimmedText,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDelete = () => {
    setShowMenu(false);

    deleteMessage(message._id);
  };

  const formattedTime = format(
    new Date(message.createdAt),
    "hh:mm a"
  );

  if (message.deleted) {
    return (
      <div
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"
          }`}
      >
        <div
          className={`max-w-[75%] rounded-2xl px-3 py-2 ${isOwnMessage
            ? "rounded-br-sm bg-primary/10"
            : "rounded-bl-sm bg-muted"
            }`}
        >
          <p className="text-sm text-muted-foreground">
            {message.text}
          </p>

          <div className="mt-1 flex items-center justify-end gap-1">
            <span className="text-[10px] text-muted-foreground">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex  ${isOwnMessage ? "justify-end" : "justify-start"
        }`}
    >
      <div className="relative max-w-[75%]">
        {isEditing ? (
          <div className="min-w-65 rounded-2xl bg-background p-2 shadow-md ring-1 ring-border">
            <textarea
              value={editText}
              onChange={(event) => setEditText(event.target.value)}
              autoFocus
              rows={2}
              className="w-full resize-none rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isEditingMessage}
                className="rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={
                  isEditingMessage ||
                  !editText.trim()
                }
                className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground disabled:opacity-50 cursor-pointer"
              >
                {isEditingMessage ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`relative rounded-2xl px-3 py-2 ${isOwnMessage
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm bg-muted"
              }`}
          >
            <button
              type="button"
              onClick={() => setShowMenu((value) => !value)}
              className="absolute right-1 top-1 cursor-pointer rounded-full p-1 opacity-0 transition-opacity hover:bg-black/10 group-hover:opacity-100"
              aria-label="Message options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showMenu && !message.deleted && (
              <div className="absolute right-0 top-8 z-20 w-36 overflow-hidden rounded-lg border bg-background py-1 text-foreground shadow-lg">

                {/* Reply - everyone */}
                <button
                  type="button"
                  onClick={handleReply}
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <Reply className="h-4 w-4" />
                  Reply
                </button>

                {/* Copy - everyone */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>

                {/* Edit - own only */}
                {isOwnMessage && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                )}

                {/* Delete - own only */}
                {isOwnMessage && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeletingMessage}
                    className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeletingMessage ? "Deleting..." : "Delete"}
                  </button>
                )}

              </div>
            )}

            <p className="whitespace-pre-wrap wrap-break-words pr-5 text-sm">
              {message.text}
            </p>

            <div className="mt-1 flex items-center justify-end gap-1">
              {message.edited && (
                <span className="text-[10px] opacity-70">
                  edited
                </span>
              )}

              <span className="text-[10px] opacity-70">
                {formattedTime}
              </span>

              {isOwnMessage &&
                (message.read ? (
                  <CheckCheck className="h-3.5 w-3.5 text-blue-400" />
                ) : message.delivered ? (
                  <CheckCheck className="h-3.5 w-3.5 opacity-70" />
                ) : (
                  <Check className="h-3.5 w-3.5 opacity-70" />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}