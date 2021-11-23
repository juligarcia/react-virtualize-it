import { useState, useEffect, useRef, RefObject } from "react";
import _ from "lodash";

import useResizeEvent from "./use-resize-event";

interface Config {
  cache: { width: number; height: number };
  externalRefObject: RefObject<HTMLDivElement>;
  externalRef: HTMLDivElement;
}

const useComponentDimensions = (
  config?: Config
): { width: number; height: number; ref: RefObject<HTMLDivElement> } => {
  const { cache, externalRef, externalRefObject } = config || {};
  const [dimensions, setDimensions] = useState({
    width: cache?.width || 0,
    height: cache?.height || 0
  });
  const ref = useRef<HTMLDivElement>(null);
  const { setRef, event, clearEvent } = useResizeEvent();

  const target =
    ref.current || externalRefObject?.current || externalRef || null;

  useEffect(() => {
    if (target && !_.isEmpty(target)) setRef(target);
  }, [target]);

  useEffect(() => {
    const { clientWidth, clientHeight } = target;
    if (clientWidth && clientHeight)
      setDimensions({ width: clientWidth, height: clientHeight });
    if (event) clearEvent();
  }, [event, target]);

  return { ref, ...dimensions };
};

export default useComponentDimensions;
