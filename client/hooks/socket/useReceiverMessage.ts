/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "@/lib/socket";
import { useChatStore } from "@/store/chatStore";

export const useReceiverMessage = () => {
  const queryClient = useQueryClient();

  const { selectedConversation,triggerScrollToBottom } = useChatStore();

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (message.conversation !== selectedConversation?._id) return;

      queryClient.setQueryData(
        ["messages", selectedConversation?._id],
        (old: any) => {
          if (!old) return old;

          const pages = [...old.pages];
          const alreadyExists = pages[0].messages.some(
            (m:any) => m._id === message._id
          );
         if(alreadyExists){
          return old;
         }
          pages[0] = {
            ...pages[0],
            messages: [...pages[0].messages, message],
          };

          return {
            ...old,
            pages,
          };
        }
      );
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
    
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [queryClient, selectedConversation, triggerScrollToBottom ]);
};