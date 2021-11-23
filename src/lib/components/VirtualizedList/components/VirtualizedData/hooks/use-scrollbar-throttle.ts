import { useEffect, RefObject } from "react";
import { throttle } from "lodash";

import { SCROLL_EVENT_OPTIONS, SCROLL_EVENT } from "../constants";

const useScrollbarThrottle = (
  callback: (event: Event) => void,
  ref: RefObject<HTMLDivElement>,
  delay: number
) => {
  const target = ref.current;
  const throttledScrollHandler = throttle(callback, delay, { leading: false });

  useEffect(() => {
    if (callback && target)
      target.addEventListener(
        SCROLL_EVENT,
        throttledScrollHandler,
        SCROLL_EVENT_OPTIONS
      );
    return () => {
      if (callback && target)
        target.removeEventListener(
          SCROLL_EVENT,
          throttledScrollHandler,
          SCROLL_EVENT_OPTIONS
        );
    };
  }, [target]);
};

export default useScrollbarThrottle;
