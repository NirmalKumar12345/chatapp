/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createConversation, getConversations } from "@/services/conversation.service";
import { useChatStore } from "@/store/chatStore";

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  const { setSelectedConversation } = useChatStore();
  return useMutation({
    mutationFn: createConversation,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['conversations'],
        (old: any) => {
          if (!old) return old;
          const exits = old.conversations.some((conversation: any) => conversation._id === data.conversation._id);
          if (exits) return old;
          return {
            ...old,
            conversations: [
              data.conversation,
              ...old.conversations,
            ],
          };
        }
      );
      setSelectedConversation(data.conversation)
    }
  })
}