import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";

export type MoveType = "X" | "O" | null;

interface BoardState {
  board: MoveType[];
  isGameFinished: boolean;
  winner: MoveType;
  user: string;
  currentPlayer: MoveType;
}

const initialState: BoardState = {
  board: Array(9).fill(null),
  isGameFinished: false,
  winner: null,
  user: "X",
  currentPlayer: "X",
};

/**
 * The Game always starts with X and O plays next
 * @param state Current board state
 * @return Symbol of the current player
 */
const player = (board: MoveType[]) => {
  const game_round = board.reduce((round, symbol) => {
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
const winner = (board: MoveType[]) => {
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
const terminal = (board: MoveType[]) => {
  const fullBoard = board.reduce((prev, curr) => {
    if (curr === null) return false;
    else return prev;
  }, true);

  return winner(board) || fullBoard;
};

/**
 * Return the result of appling an action to a set state
 * in the board.
 * @param state current board state
 * @param action position to play on the board
 * @return a copy of the state with the action
 */
const result = (board: MoveType[], action: number) => {
  // If the cell is not empty return
  if (board[action]) throw Error("Illegal move");

  // Discover hows turn it is
  const symbol = player(board);
  const newBoard = [...board];

  newBoard[action] = symbol;

  return newBoard;
};

const playMove = (state: BoardState, action: number) => {
  try {
    const newBoard = result(state.board, action);
    state.board = newBoard;

    if (terminal(newBoard)) {
      state.winner = winner(newBoard);
      state.isGameFinished = true;
      state.currentPlayer = null;
    } else {
      state.currentPlayer = player(newBoard);
    }
  } catch (error) {
    alert(error);
  }
};

const actions = (board: MoveType[]) => {
  const actions = board.reduce<number[]>((prev, curr, index) => {
    if (curr === null) {
      return [...prev, index];
    }
    return prev;
  }, []);

  return actions;
};

const utility = (board: MoveType[]) => {
  const gameWinner = winner(board);

  if (gameWinner === "X") {
    return 1;
  } else if (gameWinner === "O") {
    return -1;
  } else {
    return 0;
  }
};

const minimax = (board: MoveType[]) => {
  if (terminal(board)) {
    return utility(board);
  }

  if (player(board) === "X") {
    // User Maximazer
    let score = -1000; // Low score

    actions(board).forEach((action) => {
      score = Math.max(score, minimax(result(board, action)));
    });
    return score;
  } else {
    // AI Minimizer
    let score = 1000; // Low score

    actions(board).forEach((action) => {
      score = Math.min(score, minimax(result(board, action)));
    });
    return score;
  }
};

const findBestMove = (board: MoveType[]) => {
  if (terminal(board)) {
    return null;
  }

  let bestScore = 1000; // High value
  let bestMove = -1; // Initial illegal move(typescript)
  let score = bestScore;

  actions(board).forEach((action) => {
    score = minimax(result(board, action));

    if (score < bestScore) {
      // The AI Wants mo minimaze the player score
      bestScore = score;
      bestMove = action;
    }
  });

  return bestMove;
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    aiMove: (state) => {
      // AIs turn
      const move = findBestMove(state.board);
      if (move) {
        playMove(state, move);
      }
    },
    makeMove: (state, action: PayloadAction<{ position: number }>) => {
      const { position } = action.payload;

      // Users Turn
      playMove(state, position);
    },
    resetGame: (_) => initialState,
  },
});

export const { resetGame } = boardSlice.actions;
const { aiMove, makeMove } = boardSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const chooseCell = (position: number): AppThunk => (dispatch) => {
  dispatch(makeMove({ position }));
  setTimeout(() => {
    dispatch(aiMove());
  }, 300);
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectBoard = (state: RootState) => state.board;
export const selectCell = (index: number) => (state: RootState) =>
  state.board.board[index];

export default boardSlice.reducer;
