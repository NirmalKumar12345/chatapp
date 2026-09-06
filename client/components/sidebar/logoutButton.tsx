"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";

export default function LogoutButton() {
  const {mutate,isPending}= useLogout()
  const handleLogout =()=>{
    mutate();
  }
  return (
    <Button
      variant="destructive"
      className="w-full cursor-pointer rounded-lg border p-3 text-sm font-medium transition hover:bg-red-600 hover:text-white"
      disabled={isPending}
      onClick={handleLogout}
    >
      {isPending ? "Logging out...": "Logout"}
    </Button>
  );
}