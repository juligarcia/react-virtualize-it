import { useState, useEffect, useRef, RefObject } from "react";

import { Data, Ledger } from "../../../types";

import { KEY } from "../components/ListRow/constants";

const useLedger = (
  data: Data
): [RefObject<Ledger>, (newLedger: Ledger) => void] => {
  const [ledger, setLedger] = useState({});
  const ledgerRef = useRef<Ledger>(ledger);
  ledgerRef.current = ledger;

  const resetLedger = () => {
    const newLedger: Ledger = {};

    data.forEach((_, index) => {
      newLedger[`${KEY}${index}`] = { height: 0, offset: 0 };
    });

    return newLedger;
  };

  useEffect(() => {
    setLedger(resetLedger());
  }, [data]);

  return [ledgerRef, setLedger];
};

export default useLedger;
