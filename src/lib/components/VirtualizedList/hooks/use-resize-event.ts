import {
  useState,
  useLayoutEffect,
  useRef,
  useCallback,
  useEffect
} from "react";

const useResizeEvent = (
  resizeCallback?: (element: HTMLElement) => void
): {
  setRef: (newRef: HTMLElement) => void;
  event: boolean;
  clearEvent: () => void;
} => {
  const [event, setEvent] = useState(true);
  const [ref, setRef] = useState<HTMLElement>(null);
  const observer = useRef<ResizeObserver>(null);

  const disconnect = useCallback(() => observer.current?.disconnect(), []);

  const clearEvent = useCallback(() => setEvent(false), []);

  const observe = useCallback(() => {
    window.requestAnimationFrame(() => {
      observer.current = new ResizeObserver(() => setEvent(true));
      if (ref) observer.current.observe(ref);
    });
  }, [ref]);

  useLayoutEffect(() => {
    observe();
    return () => disconnect();
  }, [disconnect, observe]);

  useEffect(() => {
    if (event && resizeCallback) {
      resizeCallback(ref);
      clearEvent();
    }
  }, [event]);

  return { setRef, event, clearEvent };
};

export default useResizeEvent;
