/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "@/lib/socket";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { useMarkMessageAsRead } from "@/hooks/messages/useMarkMessageAsRead";

export const useReceiverMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { selectedConversation, triggerScrollToBottom } = useChatStore();
  const { mutate: markMessagesAsRead } = useMarkMessageAsRead();

  useEffect(() => {
    const handleNewMessage = (message: any, acknowledge: () => void) => {
      if (message.conversation !== selectedConversation?._id) return;

      queryClient.setQueryData(
        ["messages", selectedConversation?._id],
        (old: any) => {
          if (!old) return old;

          const pages = [...old.pages];
          const messageExists = pages.some((page: any) =>
            page.messages.some((existingMessage: any) => existingMessage._id === message._id)
          );
          if (messageExists) {
            return old;
          }
          pages[0] = {
            ...pages[0],
            messages: [...pages[0].messages, message],
          };

          return {
            ...old,
            pages,
          };
        }
      );

      const senderId = message.sender?._id?.toString?.() ?? message.sender?._id;
      const currentUserId = user?._id?.toString?.() ?? user?._id;

      if (senderId && currentUserId && senderId !== currentUserId) {
        markMessagesAsRead(message.conversation);
      }

      acknowledge();
      triggerScrollToBottom();
      /**
       * Later:
       *
       * if (isNearBottom())
       *     triggerScrollToBottom()
       * else
       *     setShowNewMessageIndicator(true)
       */
    };
    const handleMessageDelivered = (payload: { message?: string; messageId?: string; conversationId: string }) => {
      const deliveredMessageId = payload.messageId ?? payload.message;
      const { conversationId } = payload;
      if (!deliveredMessageId) return;

      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((message: any) => {
              if (message._id === deliveredMessageId) {
                return {
                  ...message,
                  delivered: true,
                };
              }
              return message;
            }),
          })),
        };
      });
    };
    const handleMessagesRead = ({ conversationId, receiverId }: { conversationId: string; receiverId: string }) => {
      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((message: any) => {
              const senderId = message.sender?._id?.toString?.() ?? message.sender?._id;
              const currentUserId = user?._id?.toString?.() ?? user?._id;

              if (message.conversation === conversationId && senderId === currentUserId) {
                return {
                  ...message,
                  delivered: true,
                  read: true,
                };
              }

              return message;
            }),
          })),
        };
      });
    };
    socket.on("newMessage", handleNewMessage);
    socket.on("messageDelivered",handleMessageDelivered);
    socket.on("messagesRead",handleMessagesRead);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDelivered", handleMessageDelivered);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [queryClient, selectedConversation, triggerScrollToBottom, user, markMessagesAsRead]);
};