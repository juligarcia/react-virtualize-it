import React, { useEffect, useState, FC } from "react";

import useComponentDimensions from "./hooks/use-component-dimensions";
import styles from "./styles.module.scss";
import {
  DEFAULT_ITEM_PADDING,
  DEFAULT_OVERSCAN,
  DEFAULT_EFFECT,
  DEFAULT_ELEMENTS_PER_ROW
} from "./constants";
import VirtualizedData from "./components/VirtualizedData";
import { VirtualizedListProps } from "./types";

const UTVirtualizedList: FC<VirtualizedListProps> = ({
  data,
  className,
  elementsPerRow,
  overscan,
  itemRenderer,
  itemPadding,
  NoDataComponent,
  effect,
  reRenderOnChange,
  HeaderRenderer,
  FooterRenderer
}) => {
  const {
    height: listViewportHeight,
    width: listViewportWidth,
    ref: listViewportRef
  } = useComponentDimensions();

  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    setReRender(!reRender);
  }, [...reRenderOnChange]);

  return (
    <div className={`${styles.container} ${className}`} ref={listViewportRef}>
      {data.length === 0 ? (
        NoDataComponent ? (
          <NoDataComponent />
        ) : null
      ) : (
        <VirtualizedData
          HeaderRenderer={HeaderRenderer}
          FooterRenderer={FooterRenderer}
          reRenderOnChange={reRender}
          listViewportHeight={listViewportHeight}
          listViewportWidth={listViewportWidth}
          listViewportRef={listViewportRef}
          data={data}
          elementsPerRow={elementsPerRow}
          overscan={overscan}
          itemRenderer={itemRenderer}
          itemPadding={itemPadding}
          effect={effect}
        />
      )}
    </div>
  );
};

UTVirtualizedList.defaultProps = {
  data: [],
  itemPadding: DEFAULT_ITEM_PADDING,
  overscan: DEFAULT_OVERSCAN,
  effect: DEFAULT_EFFECT,
  elementsPerRow: DEFAULT_ELEMENTS_PER_ROW,
  reRenderOnChange: []
};

export default UTVirtualizedList;
