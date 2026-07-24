"use client";

import { useEffect } from "react";
import { getUsers } from "@/services/user.service";

export default function ChatPage() {
  useEffect(() => {
    getUsers()
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);

  return <div>Chat Page</div>;
}