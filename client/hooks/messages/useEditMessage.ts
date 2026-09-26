/* eslint-disable @typescript-eslint/no-explicit-any */
import { editMessage } from "@/services/message.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEditMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: editMessage,
        onSuccess: (data) => {
            const updatedMessage = data.message;
            queryClient.setQueryData(["messages", updatedMessage.conversation], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        messages: page.messages.map((message: any) => message._id === updatedMessage._id ? updatedMessage : message)
                    }))
                };
            });
        }
    })
}