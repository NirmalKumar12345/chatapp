/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "@/lib/socket";
import { useChatStore } from "@/store/chatStore";

export const useReceiverMessage = () => {
  const queryClient = useQueryClient();

  const { selectedConversation,triggerScrollToBottom,setShowNewMessageIndicator } = useChatStore();

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (message.conversation !== selectedConversation?._id) return;

      queryClient.setQueryData(
        ["messages", selectedConversation?._id],
        (old: any) => {
          if (!old) return old;

          const pages = [...old.pages];

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
  }, [queryClient, selectedConversation, triggerScrollToBottom,setShowNewMessageIndicator]);
};