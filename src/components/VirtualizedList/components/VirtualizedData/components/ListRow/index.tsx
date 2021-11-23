/* eslint-disable react/no-array-index-key */
import React, { FC, ReactNode } from "react";

import useResizeEvent from "../../../../hooks/use-resize-event";
import { ListRowProps } from "../../../../types";

import { KEY, SUB_KEY } from "./constants";
import styles from "./styles.module.scss";

const ListRow: FC<ListRowProps> = ({
  row,
  index,
  effect,
  configItemRender,
  updateLedger,
  ledgerRef
}) => {
  const elementKey = `${KEY}${index}`;

  const { setRef } = useResizeEvent((element: HTMLElement) => {
    const { clientHeight } = element || {};
    if (clientHeight) updateLedger(elementKey, clientHeight);
  });

  const { itemRenderer, itemPadding, elementWidth } = configItemRender;
  const width = elementWidth - itemPadding;

  return (
    <div
      key={elementKey}
      className={`${styles.row} ${styles[effect]}`}
      style={{
        top: ledgerRef.current?.[elementKey]?.offset ?? 0
      }}
      ref={setRef}
    >
      {row.map(
        (item, itemIndex) =>
          item && (
            <div
              key={`${SUB_KEY}${itemIndex}`}
              style={{ padding: itemPadding / 2, width, maxWidth: width }}
              className={styles.item}
            >
              {itemRenderer(item, index)}
            </div>
          )
      )}
    </div>
  );
};

export default ListRow;
