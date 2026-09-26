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
      const senderId = message.sender?._id?.toString?.() ?? message.sender?._id;
      const currentUserId = user?._id?.toString?.() ?? user?._id;
      const messageConversationId = message.conversation?.toString?.() ?? message.conversation;
      const selectedConversationId = selectedConversation?._id?.toString?.() ?? selectedConversation?._id;

      if (messageConversationId === selectedConversationId) {
        queryClient.setQueryData(
          ["messages", selectedConversation?._id],
          (old: any) => {
            if (!old) return old;

            const pages = old.pages.map((page: any) => ({
              ...page,
              messages: page.messages.filter((existingMessage: any) => existingMessage._id !== message._id),
            }));

            const firstPage = pages[0] ?? { messages: [] };
            firstPage.messages = [...firstPage.messages, message];

            return {
              ...old,
              pages,
            };
          }
        );

        if (senderId && currentUserId && senderId !== currentUserId) {
          markMessagesAsRead(message.conversation);
        }
      }

      // Always update conversation list with the new message
      queryClient.setQueryData(["conversations"], (oldData: any) => {
        if (!oldData) return oldData;

        const conversations = oldData.conversations.map((conversation: any) => {
          const conversationId = conversation._id?.toString?.() ?? conversation._id;

          if (conversationId === messageConversationId) {
            return {
              ...conversation,
              lastMessage: message.text,
              lastMessageAt: message.createdAt || new Date(),
              unreadCount: conversation.unreadCount + 1,
            };
          }
          return conversation;
        });

        // Sort conversations by lastMessageAt (most recent first)
        conversations.sort((a: any, b: any) =>
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );

        return {
          ...oldData,
          conversations,
        };
      });

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
      const currentUserId = user?._id?.toString?.() ?? user?._id;
      const targetReceiverId = receiverId?.toString?.() ?? receiverId;

      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((message: any) => {
              const senderId = message.sender?._id?.toString?.() ?? message.sender?._id;
              const messageReceiverId = message.receiver?.toString?.() ?? message.receiver;

              if (
                message.conversation === conversationId &&
                senderId === currentUserId &&
                messageReceiverId === targetReceiverId
              ) {
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
    const handleMessageEdited = (updatedMessage: any) => {
      queryClient.setQueryData(
        ["messages", updatedMessage.conversation],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,

            pages: oldData.pages.map((page: any) => ({
              ...page,

              messages: page.messages.map((message: any) =>
                message._id === updatedMessage._id
                  ? updatedMessage
                  : message
              ),
            })),
          };
        }
      );
    };
    const handleMessageDeleted = ({
      messageId,
      conversationId,
    }: {
      messageId: string;
      conversationId: string;
    }) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,

            pages: oldData.pages.map((page: any) => ({
              ...page,

              messages: page.messages.map((message: any) =>
                message._id === messageId
                  ? {
                    ...message,
                    text: "This message was deleted",
                    deleted: true,
                  }
                  : message
              ),
            })),
          };
        }
      );
    };
    socket.on("newMessage", handleNewMessage);
    socket.on("messageDelivered", handleMessageDelivered);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("messageEdited", handleMessageEdited);
    socket.on("messageDeleted", handleMessageDeleted);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDelivered", handleMessageDelivered);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("messageEdited", handleMessageEdited);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [queryClient, selectedConversation, triggerScrollToBottom, user, markMessagesAsRead]);
};