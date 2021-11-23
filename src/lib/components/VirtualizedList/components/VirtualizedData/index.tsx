/* eslint-disable react/forbid-prop-types */
import React, { useMemo, Fragment, memo, FC } from "react";

import { VirtualizedDataProps } from "../../types";

import useVirtualizedData from "./hooks/use-virtualized-data";
import { createRows } from "./utils";
import styles from "./styles.module.scss";

const VirtualizedData: FC<VirtualizedDataProps> = ({
  data,
  elementsPerRow,
  overscan,
  itemRenderer,
  itemPadding,
  listViewportRef,
  listViewportHeight,
  listViewportWidth,
  effect,
  reRenderOnChange,
  HeaderRenderer,
  FooterRenderer
}) => {
  const elementWidth = Math.floor(listViewportWidth / elementsPerRow);

  const rows = useMemo(
    () => createRows(data, elementsPerRow),
    [data, elementsPerRow]
  );

  const totalRows = rows.length;
  const configItemRender = useMemo(
    () => ({ itemRenderer, itemPadding, elementWidth }),
    [itemRenderer, itemPadding, elementWidth]
  );

  const { virtualizedData, listHeight } = useVirtualizedData(
    rows,
    totalRows,
    overscan,
    listViewportHeight,
    listViewportWidth,
    configItemRender,
    listViewportRef,
    elementsPerRow,
    effect,
    reRenderOnChange
  );

  return (
    <Fragment>
      {HeaderRenderer && (
        <div className={styles.header}>
          <HeaderRenderer />
        </div>
      )}
      <div
        style={{
          height: listHeight,
          position: "relative",
          scrollBehavior: "smooth",
          width: "100%"
        }}
      >
        {virtualizedData}
      </div>
      {FooterRenderer && (
        <div className={styles.footer}>
          <FooterRenderer />
        </div>
      )}
    </Fragment>
  );
};

export default memo(VirtualizedData);
