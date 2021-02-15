import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type MoveType = "X" | "O" | null;

interface BoardState {
  board: MoveType[];
  gameFinished: boolean;
  winner: MoveType;
}

const initialState: BoardState = {
  board: Array(9).fill(null),
  gameFinished: false,
  winner: null,
};

/**
 * The Game always starts with X and O plays next
 * @param state Current board state
 * @return Symbol of the current player
 */
const player = (state: BoardState) => {
  const game_round = state.board.reduce((round, symbol) => {
    if (symbol !== null) {
      round++;
    }
    return round;
  }, 0);
  return game_round % 2 === 0 ? "X" : "O";
};

/**
 * Return the winner of the game if any
 * @param state
 * @return winner move symbol or null for no winner
 */
const winner = ({ board }: BoardState) => {
  const winConditions = [
    // Row
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Column
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonal
    [0, 4, 8],
    [2, 4, 6],
  ];

  const winnerMoveType = winConditions.reduce((prev, curr) => {
    const [a, b, c] = curr;

    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return board[a];
    else return prev;
  }, null as MoveType);

  return winnerMoveType;
};

/**
 * Return if the game is in terminal state.
 * If any player won or no available moves.
 * @param state Current board state
 */
const terminal = (state: BoardState) => {
  const fullBoard = state.board.reduce((prev, curr) => {
    if (curr === null) return false;
    else return prev;
  }, true);

  return winner(state) || fullBoard;
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    makeMove: (state, action: PayloadAction<{ position: number }>) => {
      const { position } = action.payload;
      const symbol = player(state);

      // If the cell is not empty return
      if (state.board[position] || state.gameFinished) return;

      state.board[position] = symbol;

      if (terminal(state)) {
        state.winner = winner(state);
        state.gameFinished = true;
      }
    },
    resetGame: (_) => initialState,
  },
});

export const { resetGame, makeMove } = boardSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const isGameFinished = (state: RootState) => state.counter.gameFinished;
export const selectWinner = (state: RootState) => state.counter.winner;
export const selectBoard = (state: RootState) => state.counter.board;
export const selectCell = (index: number) => (state: RootState) =>
  state.counter.board[index];

export default boardSlice.reducer;
