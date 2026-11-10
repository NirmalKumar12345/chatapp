"use client";

import { useEffect, useMemo, useRef } from "react";
import { useMarkMessageAsRead } from "@/hooks/messages/useMarkMessageAsRead";
import { useMessages } from "@/hooks/messages/useMessages";
import { useChatStore } from "@/store/chatStore";
import MessageBubble from "./messageBubble";
import { useAutoScroll } from "@/hooks/messages/useAutoScroll";
import { format, isToday, isYesterday } from "date-fns";
import DateSeparator from "./dateSeparator";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Marker, MarkerContent } from "@/components/ui/marker";

export default function MessageList() {
  const {
    selectedConversation,
    shouldScrollToBottom,
    resetScrollToBottom,
    setShowNewMessageIndicator,
    setIsAtBottom,
    highlightedMessageId,
    setHighlightedMessageId,
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
  } = useAutoScroll(
    shouldScrollToBottom,
    resetScrollToBottom
  );
  const previousConversationIdRef = useRef<string | null>(null);
  const jumpingToMessageRef = useRef(false);
  const loadingOlderRef = useRef(false);
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
useEffect(() => {
  if (!highlightedMessageId) return;

  const findAndScrollToMessage = () => {
    const messageElement = document.querySelector(
      `[data-message-id="${highlightedMessageId}"]`
    );

    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      messageElement.classList.add("message-highlight");

      const timeout = setTimeout(() => {
        messageElement.classList.remove("message-highlight");
        setHighlightedMessageId(null);
        jumpingToMessageRef.current = false;
      }, 1500);

      return () => {
        clearTimeout(timeout);
        messageElement.classList.remove("message-highlight");
      };
    }

    if (hasNextPage && !isFetchingNextPage) {
      jumpingToMessageRef.current = true;
      fetchNextPage();
    } else if (!hasNextPage) {
      setHighlightedMessageId(null);
      jumpingToMessageRef.current = false;
    }
  };

  const frame = requestAnimationFrame(findAndScrollToMessage);

  return () => {
    cancelAnimationFrame(frame);
  };
}, [
  highlightedMessageId,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  setHighlightedMessageId,
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
    const viewport = containerRef.current;
    const topSentinel = topRef.current;

    if (!viewport || !topSentinel || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
          if (!entry.isIntersecting) {
            loadingOlderRef.current = false;
            return;
          }

        if (
          hasNextPage &&
            !isFetchingNextPage &&
          !loadingOlderRef.current
        ) {
          loadingOlderRef.current = true;
          const viewportTop = viewport.getBoundingClientRect().top;
          const visibleAnchor = Array.from(
            viewport.querySelectorAll<HTMLElement>("[data-message-id]")
          ).find((message) => {
            return message.getBoundingClientRect().bottom > viewportTop;
          });
          const anchorId = visibleAnchor?.dataset.messageId;
          const anchorTop = visibleAnchor?.getBoundingClientRect().top;

          fetchNextPage().then((result) => {
            if (result.isError) {
              loadingOlderRef.current = false;
              return;
            }

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const currentViewport = containerRef.current;
                if (!currentViewport) return;

                if (!anchorId || anchorTop === undefined) return;

                const currentAnchor = Array.from(
                  currentViewport.querySelectorAll<HTMLElement>(
                    "[data-message-id]"
                  )
                ).find((message) => message.dataset.messageId === anchorId);

                if (!currentAnchor) return;

                currentViewport.scrollTop +=
                  currentAnchor.getBoundingClientRect().top - anchorTop;
              });
            });
          });
        }
      },
      {
        root: viewport,
        rootMargin: "100px 0px 0px 0px",
      }
    );

    observer.observe(topSentinel);

    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    containerRef,
    topRef,
  ]);

  /**
   * Scroll to bottom when conversation changes
   */

  useEffect(() => {
    hasScrolledInitially.current = false;
    loadingOlderRef.current = false;
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
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <Marker variant="border" className="max-w-xs justify-center py-3">
          <MarkerContent>Loading your conversation...</MarkerContent>
        </Marker>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <Marker variant="border" className="max-w-xs justify-center py-3 text-destructive">
          <MarkerContent>Unable to load messages.</MarkerContent>
        </Marker>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <Marker variant="border" className="max-w-xs justify-center py-3">
          <MarkerContent>No messages yet. Send the first one.</MarkerContent>
        </Marker>
      </div>
    );
  }

  return (
    <MessageScrollerProvider autoScroll={false}>
      <MessageScroller className="min-h-0 flex-1 bg-muted/15">
        <MessageScrollerViewport
          ref={containerRef}
          className="scrollbar-thin"
          onScroll={(event) => {
            const viewport = event.currentTarget;
            const isAtBottom =
              viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 120;
            setIsAtBottom(isAtBottom);

            if (isAtBottom) {
              setShowNewMessageIndicator(false);
            }
          }}
        >
          <MessageScrollerContent
            className="gap-3 px-4 py-5 md:px-6"
            spacerClassName="flex-1"
          >
            <div
              ref={topRef}
              className="h-px w-full shrink-0"
              aria-hidden="true"
            />

            {isFetchingNextPage && (
              <Marker variant="separator" className="py-2">
                <MarkerContent>Loading older messages...</MarkerContent>
              </Marker>
            )}

            {messages.map((message, index) => {
              const currentDate = new Date(message.createdAt);
              const previousMessage = messages[index - 1];
              const previousDate = previousMessage
                ? new Date(previousMessage.createdAt)
                : null;
              const isNewDate =
                !previousDate ||
                currentDate.toDateString() !== previousDate.toDateString();

              return (
                <MessageScrollerItem
                  key={message._id}
                  messageId={message._id}
                  className="w-full"
                >
                  {isNewDate && (
                    <DateSeparator
                      label={getMessageDateLabel(message.createdAt)}
                    />
                  )}
                  <MessageBubble message={message} />
                </MessageScrollerItem>
              );
            })}

            <div
              ref={bottomRef}
              className="h-px w-full shrink-0"
              aria-hidden="true"
            />
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton
          direction="end"
          aria-label="Scroll to latest message"
          onClick={() => setShowNewMessageIndicator(false)}
        />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}