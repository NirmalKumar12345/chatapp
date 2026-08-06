"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { User as UserType } from "@/types/user";
import { motion } from "framer-motion";

interface Props {
    user: UserType;
    onClick: () => void;
    disabled?: boolean;
}

export default function SearchUserCard({
    user,
    onClick,
    disabled,
}: Props) {
    return (
        <motion.button
            initial={{
                opacity: 0,
                y: 10
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            exit={{
                opacity: 0,
                y: -10
            }}
            transition={{
                duration: .2
            }}
            onClick={onClick}
            disabled={disabled}
            className="flex w-full items-center gap-3 rounded-lg p-3 transition hover:bg-muted"
        >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-muted">
                {user.profilePic ? (
                    <Image
                        src={user.profilePic}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <User className="h-6 w-6 text-muted-foreground" />
                )}
            </div>

            <div className="flex flex-col text-left">
                <span className="font-medium">
                    {user.name}
                </span>

                <span className="text-sm text-muted-foreground">
                    @{user.username}
                </span>
            </div>
        </motion.button>
    );
}