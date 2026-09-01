import { markMessagesAsRead } from "@/services/message.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: markMessagesAsRead,
    onSuccess: (_, conversationId) => {
      const currentUserId = user?._id?.toString?.() ?? user?._id;
      if (!currentUserId) return;

      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((message: any) => {
              const receiverId = message.receiver?.toString?.() ?? message.receiver;
              if (message.conversation === conversationId && receiverId === currentUserId) {
                return {
                  ...message,
                  read: true,
                  delivered: true,
                };
              }
              return message;
            }),
          })),
        };
      });
    },
  });
};