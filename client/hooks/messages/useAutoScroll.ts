import { useCallback, useEffect, useRef } from "react";

export const useAutoScroll = (
  shouldScrollToBottom: boolean,
  resetScrollToBottom: () => void
) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const topRef = useRef<HTMLDivElement>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  const previousScrollHeightRef = useRef(0);
  const saveScrollHeight = useCallback(() => {
    previousScrollHeightRef.current =
      containerRef.current?.scrollHeight ?? 0;
  }, []);

const restoreScrollPosition = useCallback(() => {
  const container = containerRef.current;

  if (!container) return;

  if (!previousScrollHeightRef.current) return;

  const newHeight = container.scrollHeight;

  container.scrollTop +=
    newHeight - previousScrollHeightRef.current;

  previousScrollHeightRef.current = 0;
},[]);
  const isNearBottom = useCallback(() => {
    const container = containerRef.current;

    if (!container) return true;

    return (
      container.scrollHeight -
        container.scrollTop -
        container.clientHeight <
      120
    );
  }, []);

  const scrollToBottom = useCallback(
  (behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({
      behavior,
    });
  },
  []
);

  useEffect(() => {
    if (!shouldScrollToBottom) return;

    requestAnimationFrame(() => {
      scrollToBottom("smooth");
      resetScrollToBottom();
    });
  }, [
    shouldScrollToBottom,
    resetScrollToBottom,
    scrollToBottom,
  ]);

  return {
    containerRef,
    topRef,
    bottomRef,
    isNearBottom,
    scrollToBottom,
    saveScrollHeight,
    restoreScrollPosition,
  };
};