"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface NewMessageIndicatorProps {
  show: boolean;
  onClick: () => void;
}

export default function NewMessageIndicator({
  show,
  onClick,
}: NewMessageIndicatorProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 30,
            scale: 0.9,
          }}
          transition={{
            duration: 0.2,
          }}
          onClick={onClick}
          className="
            absolute
            bottom-24
            left-1/2
            z-50
            flex
            -translate-x-1/2
            items-center
            gap-2
            rounded-full
            bg-primary
            px-4
            py-2
            text-sm
            font-medium
            text-primary-foreground
            shadow-lg
            hover:scale-105
            transition-transform
          "
        >
          New Messages

          <ArrowDown className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}