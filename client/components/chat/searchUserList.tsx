"use client";

import { useState } from "react";
import {
    AnimatePresence
} from "framer-motion";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useSearchUsers } from "@/hooks/users/useSearchUsers";
import { useCreateConversation } from "@/hooks/conversations/useConversations";
import SearchUserCard from "./searchUserCard";
import { Search } from "lucide-react";
import SearchUserSkeleton from "../sidebar/searchUserSkeleton";

interface Props {
    closeDialog: () => void;
}

export default function SearchUserList({
    closeDialog,
}: Props) {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);
    const { mutate, isPending } =
        useCreateConversation();
    const { data, isLoading, isError } = useSearchUsers(debouncedSearch)
    return (
        <div className="space-y-4">
            <Input
                autoFocus
                className="group rounded-xl transition-all duration-200 hover:bg-accent hover:scale-[1.01]"
                placeholder="Search by name or username..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />

            {isLoading && debouncedSearch && (
                <SearchUserSkeleton />
            )}

            {isError && (
                <p className="text-sm text-red-500">
                    Failed to search users.
                </p>
            )}
            {/* Search Results */}
            <div className="max-h-80 overflow-y-auto">
                <AnimatePresence>
                    {data?.users.map((user) => (
                        <SearchUserCard
                            key={user._id}
                            disabled={isPending}
                            user={user}
                            onClick={() => {
                                mutate(user._id, {
                                    onSuccess: () => {
                                        closeDialog();
                                    },
                                });
                            }}
                        />
                    ))}
                </AnimatePresence>
            </div>
            {!isLoading &&
                debouncedSearch &&
                data?.users?.length === 0 && (
                    < div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
                        <Search className="mx-auto h-10 w-10 text-muted-foreground" />

                        <p>No users found</p>

                        <p className="text-xs">
                            Try another username.
                        </p>
                    </div>
                )}
        </div>
    );
}