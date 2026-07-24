"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();

  const {
    user,
    accessToken,
    isLoading,
  } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    if (!user || !accessToken) {
      router.replace("/login");
    }
  }, [user, accessToken, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user || !accessToken) {
    return null;
  }

  return children;
}