import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { chooseCell, selectCell } from "./boardSlice";
import styles from "./Cell.module.css";

type CellProps = {
  index: number;
};

export function Cell({ index }: CellProps) {
  const cellSymbol = useSelector(selectCell(index));
  const dispatch = useDispatch();

  return (
    <div className={styles.cell} onClick={() => dispatch(chooseCell(index))}>
      {cellSymbol}
    </div>
  );
}
