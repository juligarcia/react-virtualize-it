/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */

import React, { ReactNode } from "react";

import {
  Data,
  Rows,
  LedgerRef,
  ConfigItemRender,
  Ledger,
  RowRenderer
} from "../../types";

import { KEY } from "./components/ListRow/constants";
import ListRow from "./components/ListRow";
import { MAX_LIMIT_MULTIPLIER, DEFAULT_LIMIT_MULTIPLIER } from "./constants";

export const createRows = (data: Data, elementsPerRow: number): Rows => {
  const totalRows = Math.ceil(data.length / elementsPerRow);

  const rows = new Array(totalRows).fill(0).map(() => []);

  for (let i = 0; i < data.length; i++) {
    rows[Math.floor(i / elementsPerRow)].push(data[i]);
  }

  return rows;
};

export const applyToIndex = (index: number, target: number, object: any) =>
  index === target ? object : null;

export const createRowRenderer =
  (configItemRender: ConfigItemRender, effect: string) =>
  (
    row: Data,
    index: number,
    updateLedger: (key: string, height: number) => void,
    ledgerRef: LedgerRef
  ): ReactNode =>
    (
      <ListRow
        row={row}
        index={index}
        effect={effect}
        configItemRender={configItemRender}
        updateLedger={updateLedger}
        ledgerRef={ledgerRef}
      />
    );

const getOffsets = (ledger: Ledger): number[] =>
  Object.values(ledger).map(({ offset }) => offset);

const getFirstIndex = (ledger: Ledger, scroll: number): number => {
  const offsets = getOffsets(ledger);
  return Math.max(offsets.findIndex((offset) => offset > scroll) - 1, 0);
};

const getElementsInViewport = (
  ledger: Ledger,
  scroll: number,
  listViewportHeight: number,
  firstIndex: number,
  totalElements: number
) => {
  const offsets = getOffsets(ledger);
  const index = offsets.findIndex(
    (offset) => offset > scroll + listViewportHeight
  );
  return (index !== -1 ? index : totalElements) - 1 - firstIndex;
};

const getListHeight = (ledger: Ledger) => {
  const values = Object.values(ledger);
  const lastUsableIndex = values.findIndex(({ height }) => !height);

  const { height = 0, offset = 0 } =
    values[lastUsableIndex !== -1 ? lastUsableIndex : values.length - 1] || {};

  return offset + height;
};

export const renderVirtualScreen = (
  scrollPosition: number,
  overscan: number,
  totalElements: number,
  listViewportHeight: number,
  ledger: Ledger
) => {
  const listHeight = getListHeight(ledger);

  if (!listViewportHeight)
    return {
      virtualScreenStart: 0,
      virtualScreenEnd: Math.min(2 * overscan, totalElements)
    };

  const firstElementIndex = getFirstIndex(ledger, scrollPosition);

  const elementsInViewport = listHeight
    ? getElementsInViewport(
        ledger,
        scrollPosition,
        listViewportHeight,
        firstElementIndex,
        totalElements
      )
    : 0;

  const upperScan = Math.min(firstElementIndex, overscan);
  const lowerScan = Math.min(
    totalElements - (firstElementIndex + elementsInViewport),
    overscan
  );

  const normalizedUpperScan = upperScan + overscan - lowerScan;
  const normalizedLowerScan = lowerScan + overscan - upperScan;

  const virtualScreenStart = Math.max(
    firstElementIndex - normalizedUpperScan,
    0
  );
  let virtualScreenEnd = Math.min(
    firstElementIndex + elementsInViewport + normalizedLowerScan,
    totalElements
  );

  if (virtualScreenEnd - virtualScreenStart >= MAX_LIMIT_MULTIPLIER * overscan)
    virtualScreenEnd = virtualScreenStart + DEFAULT_LIMIT_MULTIPLIER * overscan;

  return {
    virtualScreenStart,
    virtualScreenEnd,
    listHeight
  };
};

export const nullifyDataInBetween = (
  data: Rows,
  startIndex: number,
  endIndex: number
) => {
  for (let i = startIndex; i < endIndex; i++) data[i] = null;
};

export const addVirtualizedElements = (
  data: Rows,
  virtualizedData: ReactNode[],
  startIndex: number,
  endIndex: number,
  rowRenderer: RowRenderer,
  updateLedger: (key: string, height: number) => void,
  ledgerRef: LedgerRef
) => {
  for (let i = startIndex; i < endIndex; i++) {
    if (!virtualizedData[i])
      virtualizedData[i] = rowRenderer(data[i], i, updateLedger, ledgerRef);
  }
};

export const updateLedger =
  (ledgerRef: LedgerRef, setLedgerRef: (newLedger: Ledger) => void) =>
  (key: string, height: number) => {
    const currentHeight = ledgerRef.current?.[key]?.height;

    if (currentHeight !== height) {
      const newLedger = { ...ledgerRef.current, [key]: { height } };
      let accumulator = 0;

      const keys = Object.keys(newLedger);

      keys.forEach((currentKey, index) => {
        if (!newLedger[currentKey].height) {
          newLedger[currentKey].height = height;
        }
        if (index) {
          accumulator += newLedger[`${KEY}${index - 1}`].height;
        }
        newLedger[currentKey] = {
          ...newLedger[currentKey],
          offset: accumulator
        };
      });

      setLedgerRef(newLedger as Ledger);
    }
  };
