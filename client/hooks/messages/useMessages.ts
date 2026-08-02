import { getMessage } from "@/services/message.service"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useMessages = (conversationId?: string)=>{
    return useInfiniteQuery({
        queryKey: ['messages',conversationId],
        queryFn: ({pageParam=1})=>getMessage(conversationId!,pageParam),
        enabled: !!conversationId,
        initialPageParam: 1,
        getNextPageParam: (lastPage)=>{
            return lastPage.page < lastPage.totalPages
            ? lastPage.page + 1
            : undefined
        }
    })
}
