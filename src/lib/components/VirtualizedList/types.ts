import React, { FC, ReactNode, RefObject } from "react";

interface LedgerItem {
  height: number;
  offset: number;
}

export interface Ledger {
  [row: string]: LedgerItem;
}

export interface ConfigItemRender {
  itemPadding: number;
  elementWidth: number;
  itemRenderer(item: any, index: number): ReactNode;
}

export type LedgerRef = RefObject<Ledger>;

export type Data = any[];

export type Rows = Data[];

export interface ListRowProps {
  row: Data;
  index: number;
  effect: string;
  configItemRender: ConfigItemRender;
  updateLedger: (key: string, height: number) => void;
  ledgerRef: LedgerRef;
}

export type RowRenderer = (
  row: Data,
  index: number,
  updateLedger: (key: string, height: number) => void,
  ledgerRef: LedgerRef
) => ReactNode;

export interface VirtualizedListProps {
  data: Data;
  className?: string;
  elementsPerRow?: number;
  overscan?: number;
  itemRenderer(item: any, index: number): ReactNode;
  itemPadding?: number;
  NoDataComponent?: FC;
  effect?: string;
  reRenderOnChange?: any[];
  HeaderRenderer?: FC;
  FooterRenderer?: FC;
}

export interface VirtualizedDataProps {
  listViewportRef: RefObject<HTMLDivElement>;
  listViewportHeight: number;
  listViewportWidth: number;
  reRenderOnChange: boolean;
  data: Data;
  elementsPerRow: number;
  overscan: number;
  itemRenderer(item: any, index: number): ReactNode;
  itemPadding: number;
  effect: string;
  HeaderRenderer: FC;
  FooterRenderer: FC;
}
