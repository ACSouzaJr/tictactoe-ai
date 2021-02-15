import React from "react";
import Modal from "rodal";
import { Square } from "./features/counter/Counter";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBoard,
  selectWinner,
  resetGame,
} from "./features/counter/boardSlice";
import "./App.css";
// include styles
import "rodal/lib/rodal.css";

function App() {
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const winner = useSelector(selectWinner);

  function closeModal() {
    dispatch(resetGame());
  }

  return (
    <>
      <div className="game-wrapper">
        <div className="game-board">
          {board.map((_, index) => (
            <Square key={index} index={index} />
          ))}
        </div>
        <Modal
          visible={!!winner}
          onClose={closeModal}
          height="200"
          duration={200}
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
