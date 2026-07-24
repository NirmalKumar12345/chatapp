"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/auth/useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  useAuth();

  return <>{children}</>;
}