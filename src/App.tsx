import React from "react";

import { useDispatch, useSelector } from "react-redux";
import Modal from "rodal";
// include styles
import "rodal/lib/rodal.css";

import { Cell } from "./features/board/Cell";
import {
  selectBoard,
  selectWinner,
  resetGame,
  selectIsGameFinished,
} from "./features/board/boardSlice";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const winner = useSelector(selectWinner);
  const isGameFinished = useSelector(selectIsGameFinished);

  function closeModal() {
    dispatch(resetGame());
  }

  return (
    <>
      <div className="game-wrapper">
        <h1 className="game-title">Play Tic Tac Toe</h1>
        <div className="game-board">
          {board.map((_, index) => (
            <Cell key={index} index={index} />
          ))}
        </div>
        <Modal
          visible={isGameFinished}
          onClose={closeModal}
          height={200}
          duration={100}
        >
          <div className="model-content">
            <h2 className="model-text">
              {winner ? `Game over: ${winner} wins` : "Game Over: Tie"}
            </h2>
            <button className="model-button" onClick={closeModal}>
              Play Again
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default App;
