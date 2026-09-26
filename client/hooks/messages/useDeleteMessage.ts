/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteMessage } from "@/services/message.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMessage,
        onSuccess: (data) => {
            const deletedMessage = data.message;
            queryClient.setQueryData(["messages", deletedMessage.conversation], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        messages: page.messages.map((message: any) =>
                            message._id === deletedMessage._id ? { ...message, text: "This message was deleted.", deleted: true } : message)
                    }))
                }
            })
        }
    })

}