"use client";

import { logout } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout =()=>{
    const router = useRouter();
    const logoutFormStore = useAuthStore((state)=>state.logout);
    const setSelectedConversation = useChatStore((state)=>state.setSelectedConversation);
    return useMutation({
        mutationFn: logout,
        onSuccess:()=>{
            logoutFormStore();
            setSelectedConversation(null);
            sessionStorage.clear();
            localStorage.removeItem("token");
            router.replace("/login");
        }
    })
}