"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { login } from "@/src/services/auth.service";
import { useAuthStore } from "@/src/store/authStore";


export const useLogin = () => {
  const router = useRouter();

  const { setUser, setAccessToken } = useAuthStore();

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);

      toast.success(data.message);

      router.push("/chat");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    },
  });
};