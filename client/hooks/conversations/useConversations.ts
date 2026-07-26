import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createConversation, getConversations } from "@/services/conversation.service";

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
};

export const useCreateConversation =()=>{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createConversation,
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey: ['conversations'],
      })
    }
  })
}