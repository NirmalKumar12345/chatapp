"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { refreshToken } from "@/services/auth.service";

export const useAuth = () => {
    const { accessToken, setUser, setAccessToken, setLoading } = useAuthStore();

    useEffect(() => {
        if (accessToken) return;
        const restoreSession = async () => {
            setLoading(true);
            try {
                const data = await refreshToken();

                setUser(data.user);
                setAccessToken(data.accessToken);
            } catch (error) {
                if (process.env.NODE_ENV === "development") {
                    console.error("Session restore failed:", error);
                }
            }
            finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, [accessToken, setUser, setAccessToken, setLoading]);
};