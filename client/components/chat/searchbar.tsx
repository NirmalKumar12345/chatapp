"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { useSearchUsers } from "@/hooks/users/useSearchUsers";
import { useCreateConversation } from "@/hooks/conversations/useConversations";
import { useDebounce } from "@/hooks/common/useDebounce";
import SearchUserSkeleton from "./searchUserSkeleton";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { data, isLoading } = useSearchUsers(debouncedSearch);
  const { mutate, isPending } = useCreateConversation();
  const handleCreateConversation = (receiverId: string)=>{
    if (isPending) return;
    mutate(receiverId,{
        onSuccess: ()=>{
            setSearch("")
        }}
    )
  }

  return (
    <div className="space-y-2">
      <Input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading && debouncedSearch && (
        <SearchUserSkeleton />
      )}
      
      {debouncedSearch &&
        data?.users?.map((user) => (
          <div
            key={user._id}
            onClick={()=>handleCreateConversation(user._id)}
            className="cursor-pointer rounded-lg border p-3 transition hover:bg-muted"
          >
            <p className="font-medium">{user.name}</p>

            <p className="text-xs text-muted-foreground">
              {user.username}
            </p>
          </div>
        ))}

      {debouncedSearch &&
        !isLoading &&
        data?.users?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No users found.
          </p>
        )}
    </div>
  );
}