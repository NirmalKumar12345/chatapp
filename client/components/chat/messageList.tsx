"use client";

import { useEffect, useMemo, useRef } from "react";
import { useMarkMessageAsRead } from "@/hooks/messages/useMarkMessageAsRead";
import { useMessages } from "@/hooks/messages/useMessages";
import { useChatStore } from "@/store/chatStore";
import MessageBubble from "./messageBubble";
import { useAutoScroll } from "@/hooks/messages/useAutoScroll";
import NewMessageIndicator from "./newMessageIndicator";
import { format, isToday, isYesterday } from "date-fns";
import DateSeparator from "./dateSeparator";

export default function MessageList() {
  const {
    selectedConversation,
    shouldScrollToBottom,
    resetScrollToBottom,
    showNewMessageIndicator,
    setShowNewMessageIndicator,
  } = useChatStore();
  const {
    mutate: markMessagesAsRead,
  } = useMarkMessageAsRead();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(selectedConversation?._id);
  const {
    containerRef,
    topRef,
    bottomRef,
    scrollToBottom,
    saveScrollHeight,
    restoreScrollPosition,
  } = useAutoScroll(
    shouldScrollToBottom,
    resetScrollToBottom
  );
  const previousConversationIdRef = useRef<string | null>(null);
  useEffect(() => {
    const conversationId = selectedConversation?._id;

    if (!conversationId) return;

    if (
      previousConversationIdRef.current === conversationId
    ) {
      return;
    }

    previousConversationIdRef.current = conversationId;

    markMessagesAsRead(conversationId);
  }, [
    selectedConversation?._id,
    markMessagesAsRead,
  ]);
  // Merge all pages
  const messages = useMemo(() => {
    const seen = new Set<string>();

    return (
      data?.pages
        .slice()
        .reverse()
        .flatMap((page) => page.messages)
        .filter((message) => {
          if (!message?._id) return false;
          if (seen.has(message._id)) return false;
          seen.add(message._id);
          return true;
        }) ?? []
    );
  }, [data]);
  const hasScrolledInitially = useRef(false);
  /**
   * Infinite Scroll
   */

  useEffect(() => {
    if (!selectedConversation) return;

    if (isLoading) return;

    if (!messages.length) return;

    if (hasScrolledInitially.current) return;

    requestAnimationFrame(() => {
      scrollToBottom("auto");
      hasScrolledInitially.current = true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedConversation?._id,
    isLoading,
    messages.length,
    scrollToBottom,
  ]);
  useEffect(() => {
    if (!topRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          saveScrollHeight();

          fetchNextPage();
        }
      },
      {
        root: containerRef?.current,
        rootMargin: "100px",
      }
    );

    observer.observe(topRef.current);

    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    containerRef,
    topRef,
    saveScrollHeight,
  ]);

  /**
   * Preserve scroll position after loading previous page
   */
  useEffect(() => {
    if (!isFetchingNextPage) {

      restoreScrollPosition();
    }
  }, [isFetchingNextPage, restoreScrollPosition]);

  /**
   * Scroll to bottom when conversation changes
   */

  useEffect(() => {
    hasScrolledInitially.current = false;
  }, [selectedConversation?._id]);
  const getMessageDateLabel = (date: string) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) {
      return "Today";
    }
    if (isYesterday(messageDate)) {
      return "Yesterday";
    }
    return format(messageDate, "dd MMMM yyyy");
  }
  if (!selectedConversation) return null;

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        Loading messages...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center text-red-500">
        Failed to load messages.
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        No messages yet. Start the conversation 👋
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-y-auto p-4 space-y-2"
    >
      <div ref={topRef} />

      {isFetchingNextPage && (
        <div className="py-2 text-center text-sm text-muted-foreground">
          Loading older messages...
        </div>
      )}

      {messages.map((message, index) => {
        const currentDate = new Date(message.createdAt);
        const previousMessage = messages[index - 1];
        const previousDate = previousMessage ? new Date(previousMessage.createdAt) : null;
        const isNewDate = !previousDate || currentDate.toDateString() !== previousDate.toDateString();
        return (
          <div key={message._id}>
            {isNewDate && (
              <DateSeparator
                label={getMessageDateLabel(message.createdAt)}
              />
            )}

            <MessageBubble message={message} />
          </div>
        )
      })}

      <div ref={bottomRef} />
      <NewMessageIndicator
        show={showNewMessageIndicator}
        onClick={() => {
          scrollToBottom("smooth");
          setShowNewMessageIndicator(false);
        }}
      />
    </div>
  );
}