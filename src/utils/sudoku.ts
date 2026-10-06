import { CellValue, CellState } from "../types.ts";

export function generateSolvedBoard(): CellValue[][] {
  const board: CellValue[][] = Array.from({ length: 9 }, () =>
    Array(9).fill(null),
  );

  function isValid(
    board: CellValue[][],
    row: number,
    col: number,
    num: number,
  ): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
      if (board[i][col] === num) return false;
      const boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
      const boxCol = Math.floor(col / 3) * 3 + (i % 3);
      if (board[boxRow][boxCol] === num) return false;
    }
    return true;
  }

  function solve(board: CellValue[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of nums) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solve(board)) return true;
              board[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve(board);
  return board;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createPuzzle(
  difficulty: "easy" | "medium" | "hard",
): CellState[][] {
  const solved = generateSolvedBoard();
  const board: CellState[][] = Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => ({
      value: solved[row][col],
      isFixed: true,
      isValid: true,
      isHighlighted: false,
      notes: [],
    })),
  );

  const cellsToRemove = { easy: 35, medium: 45, hard: 55 }[difficulty];

  let removed = 0;
  const positions = shuffleArray(
    Array.from({ length: 81 }, (_, i) => ({
      row: Math.floor(i / 9),
      col: i % 9,
    })),
  );

  for (const { row, col } of positions) {
    if (removed >= cellsToRemove) break;
    const originalValue = board[row][col].value;
    board[row][col].value = null;
    board[row][col].isFixed = false;

    const boardCopy = board.map((r) => r.map((c) => c.value));
    if (countSolutions(boardCopy) === 1) {
      removed++;
    } else {
      board[row][col].value = originalValue;
      board[row][col].isFixed = true;
    }
  }

  return board;
}

function countSolutions(board: CellValue[][]): number {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        let count = 0;
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num;
            count += countSolutions(board);
            board[row][col] = null;
            if (count > 1) return count;
          }
        }
        return count;
      }
    }
  }
  return 1;
}

function isValidPlacement(
  board: CellValue[][],
  row: number,
  col: number,
  num: number,
): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
    const boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
    const boxCol = Math.floor(col / 3) * 3 + (i % 3);
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
}

export function validateBoard(board: CellState[][]): CellState[][] {
  const newBoard = board.map((row) =>
    row.map((cell) => ({ ...cell, isValid: true })),
  );

  for (let row = 0; row < 9; row++) {
    const seen = new Map<number, number[]>();
    for (let col = 0; col < 9; col++) {
      const val = newBoard[row][col].value;
      if (val !== null) {
        if (!seen.has(val)) seen.set(val, []);
        seen.get(val)!.push(col);
      }
    }
    for (const [, cols] of seen) {
      if (cols.length > 1) {
        for (const col of cols) newBoard[row][col].isValid = false;
      }
    }
  }

  for (let col = 0; col < 9; col++) {
    const seen = new Map<number, number[]>();
    for (let row = 0; row < 9; row++) {
      const val = newBoard[row][col].value;
      if (val !== null) {
        if (!seen.has(val)) seen.set(val, []);
        seen.get(val)!.push(row);
      }
    }
    for (const [, rows] of seen) {
      if (rows.length > 1) {
        for (const row of rows) newBoard[row][col].isValid = false;
      }
    }
  }

  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Map<number, [number, number][]>();
      for (let i = 0; i < 9; i++) {
        const row = boxRow * 3 + Math.floor(i / 3);
        const col = boxCol * 3 + (i % 3);
        const val = newBoard[row][col].value;
        if (val !== null) {
          if (!seen.has(val)) seen.set(val, []);
          seen.get(val)!.push([row, col]);
        }
      }
      for (const [, cells] of seen) {
        if (cells.length > 1) {
          for (const [row, col] of cells) newBoard[row][col].isValid = false;
        }
      }
    }
  }

  return newBoard;
}

export function isBoardComplete(board: CellState[][]): boolean {
  return board.every((row) =>
    row.every((cell) => cell.value !== null && cell.isValid),
  );
}
