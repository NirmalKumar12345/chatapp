import { sendMessage } from "@/services/message.service";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useSendMessage = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: sendMessage,
        onSuccess: (_,variables)=>{
            queryClient.invalidateQueries({
                queryKey: ['messages',variables.conversationId]
            });
            queryClient.invalidateQueries({
                queryKey: ['conversations']
            })
        }
    })
}