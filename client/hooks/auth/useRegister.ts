"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { register } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

export const useRegister = () => {
  const router = useRouter();

  const {setUser,setAccessToken}=useAuthStore();

  return useMutation({
    mutationFn: register,

    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);  
      toast.success(data.message);

      router.push("/chat");
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    },
  });
};