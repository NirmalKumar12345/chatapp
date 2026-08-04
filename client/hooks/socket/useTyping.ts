import { socket } from "@/lib/socket";
import { useChatStore } from "@/store/chatStore";
import { useEffect } from "react";

interface TypingPayload {
    conversationId: string;
}

export const useTyping = () => {
    const { selectedConversation, setIsTyping } = useChatStore();
    useEffect(() => {
        const handleTyping = ({ conversationId }: TypingPayload) => {
            if (
                conversationId !==
                selectedConversation?._id
            ) {
                return;
            }
            setIsTyping(true);
        }
        const handleStopTyping = ({conversationId}:TypingPayload) => {
            if (
                conversationId !==
                selectedConversation?._id
            ) {
                return;
            }
            setIsTyping(false);
        }
        socket.on("typing", handleTyping);
        socket.on("stopTyping", handleStopTyping);
        return () => {
            socket.off("typing", handleTyping);
            socket.off("stopTyping", handleStopTyping);
        };
    }, [selectedConversation?._id, setIsTyping]);
}