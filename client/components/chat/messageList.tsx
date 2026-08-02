"use client";

import { useEffect, useMemo } from "react";

import { useMessages } from "@/hooks/messages/useMessages";
import { useChatStore } from "@/store/chatStore";

import MessageBubble from "./messageBubble";
import { useAutoScroll } from "@/hooks/messages/useAutoScroll";
import NewMessageIndicator from "./newMessageIndicator";

export default function MessageList() {
  const {
    selectedConversation,
    shouldScrollToBottom,
    resetScrollToBottom,
    showNewMessageIndicator,
    setShowNewMessageIndicator,
  } = useChatStore();

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
    isNearBottom,
    saveScrollHeight,
  restoreScrollPosition,
  } = useAutoScroll(
    shouldScrollToBottom,
    resetScrollToBottom
  );

  // Merge all pages
  const messages = useMemo(() => {
    return (
      data?.pages
        .slice()
        .reverse()
        .flatMap((page) => page.messages) ?? []
    );
  }, [data]);

  /**
   * Infinite Scroll
   */
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
    if (!selectedConversation) return;

    requestAnimationFrame(() => {
      scrollToBottom("auto");
    });
  }, [selectedConversation,scrollToBottom]);

  
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
      className="relative flex-1 overflow-y-auto p-4 space-y-3"
    >
      <div ref={topRef} />

      {isFetchingNextPage && (
        <div className="py-2 text-center text-sm text-muted-foreground">
          Loading older messages...
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble
          key={message._id}
          message={message}
        />
      ))}

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