import { getMessage } from "@/services/message.service"
import { useQuery } from "@tanstack/react-query"

export const useMessages = (conversationId?: string)=>{
    return useQuery({
        queryKey: ['messages',conversationId],
        queryFn: ()=>getMessage(conversationId!),
        enabled: !!conversationId,
    })
}