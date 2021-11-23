import { useState, useCallback, useEffect, useMemo, RefObject } from "react";
import { ConfigItemRender, Rows } from "../../../types";

import { SCROLL_THROTTLE_DELAY } from "../constants";
import {
  createRowRenderer,
  renderVirtualScreen,
  nullifyDataInBetween,
  addVirtualizedElements,
  updateLedger
} from "../utils";

import useHeightLedger from "./use-ledger";
import useScrollbarThrottle from "./use-scrollbar-throttle";

const useVirtualizedData = (
  data: Rows,
  totalElements: number,
  overscan: number,
  listViewportHeight: number,
  listViewportWidth: number,
  configItemRender: ConfigItemRender,
  listViewportRef: RefObject<HTMLDivElement>,
  elementsPerRow: number,
  effect: string,
  reRenderOnChange: boolean
) => {
  const [shouldReRender, setShouldReRender] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [virtualizedData, setVirtualizedData] = useState([]);
  const [heightLedger, setHeightLedger] = useHeightLedger(data);

  const updateScroll = ({ target }: Event) => {
    if (target === listViewportRef.current) {
      const { scrollTop } = target as Element;
      setScroll(scrollTop);
    }
  };

  useScrollbarThrottle(updateScroll, listViewportRef, SCROLL_THROTTLE_DELAY);

  const rowRenderer = useCallback(createRowRenderer(configItemRender, effect), [
    configItemRender,
    effect
  ]);

  const { virtualScreenStart, virtualScreenEnd, listHeight } = useMemo(
    () =>
      renderVirtualScreen(
        scroll,
        overscan,
        totalElements,
        listViewportHeight,
        heightLedger.current
      ),
    [scroll, overscan, totalElements, heightLedger.current, listViewportHeight]
  );

  useEffect(() => {
    setShouldReRender(true);
  }, [
    listViewportWidth,
    rowRenderer,
    elementsPerRow,
    heightLedger.current,
    data,
    reRenderOnChange
  ]);

  const ledgerUpdater = useMemo(
    () => updateLedger(heightLedger, setHeightLedger),
    [heightLedger, setHeightLedger]
  );

  useEffect(() => {
    const newVirtualizedData = shouldReRender
      ? new Array(totalElements).fill(null)
      : [...virtualizedData];

    nullifyDataInBetween(newVirtualizedData, 0, virtualScreenStart);
    nullifyDataInBetween(
      newVirtualizedData,
      virtualScreenEnd,
      newVirtualizedData.length
    );

    addVirtualizedElements(
      data,
      newVirtualizedData,
      virtualScreenStart,
      virtualScreenEnd,
      rowRenderer,
      ledgerUpdater,
      heightLedger
    );

    setVirtualizedData(newVirtualizedData);

    if (shouldReRender) setShouldReRender(false);
  }, [virtualScreenStart, virtualScreenEnd, shouldReRender, ledgerUpdater]);

  return { virtualizedData, listHeight };
};

export default useVirtualizedData;
