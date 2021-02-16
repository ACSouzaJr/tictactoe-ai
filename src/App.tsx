import React from "react";

import { useDispatch, useSelector } from "react-redux";
import Modal from "rodal";
// include styles
import "rodal/lib/rodal.css";

import { Cell } from "./features/board/Cell";
import { selectBoard, resetGame } from "./features/board/boardSlice";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const { board, winner, isGameFinished, currentPlayer } = useSelector(
    selectBoard
  );

  function closeModal() {
    dispatch(resetGame());
  }

  return (
    <>
      <div className="game-wrapper">
        <div className="game-title-wrapper">
          <h1 className="game-title">Play Tic Tac Toe</h1>
          <h3 className="game-subtitle">
            {currentPlayer && `${currentPlayer} Turn`}
          </h3>
        </div>
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
