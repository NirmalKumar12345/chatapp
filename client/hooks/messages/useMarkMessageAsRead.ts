import { markMessagesAsRead } from "@/services/message.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markMessagesAsRead,
    onSuccess: (_, conversationId) => {
      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((message: any) => {
              if (message.conversation === conversationId && message.receiver === conversationId) {
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