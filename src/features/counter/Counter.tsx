import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeMove, selectCell } from "./boardSlice";
import styles from "./Counter.module.css";

type SquareProps = {
  index: number;
};

export function Square({ index }: SquareProps) {
  const cellSymbol = useSelector(selectCell(index));
  const dispatch = useDispatch();

  return (
    <div
      className={styles.cell}
      onClick={() => dispatch(makeMove({ position: index }))}
    >
      {cellSymbol}
    </div>
  );
}
