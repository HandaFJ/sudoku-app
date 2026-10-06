import { useState, useCallback, useEffect } from "react";
import { CellState, CellPosition } from "./types.ts";
import {
  createPuzzle,
  validateBoard,
  isBoardComplete,
} from "./utils/sudoku.ts";
import SudokuBoard from "./components/SudokuBoard.tsx";
import NumberPad from "./components/NumberPad.tsx";
import Controls from "./components/Controls.tsx";
import "./App.css";

function App() {
  const [board, setBoard] = useState<CellState[][]>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [noteMode, setNoteMode] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const startNewGame = useCallback(() => {
    const newBoard = createPuzzle(difficulty);
    setBoard(newBoard);
    setSelectedCell(null);
    setIsComplete(false);
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (board.length > 0) {
      const validated = validateBoard(board);
      setBoard(validated);
      setIsComplete(isBoardComplete(validated));
    }
  }, [board.map((r) => r.map((c) => c.value).join(",")).join(";")]);

  const handleSelectCell = (pos: CellPosition | null) => {
    setSelectedCell(pos);
  };

  const handleNumberClick = (num: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (board[row][col].isFixed) return;

    setBoard((prev) => {
      const newBoard = prev.map((r) =>
        r.map((c) => ({ ...c, notes: [...c.notes] })),
      );
      if (noteMode) {
        const notes = newBoard[row][col].notes;
        if (notes.includes(num)) {
          newBoard[row][col].notes = notes.filter((n) => n !== num);
        } else {
          newBoard[row][col].notes = [...notes, num].sort();
        }
      } else {
        newBoard[row][col].value = num;
        newBoard[row][col].notes = [];
      }
      return validateBoard(newBoard);
    });
  };

  const handleErase = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (board[row][col].isFixed) return;

    setBoard((prev) => {
      const newBoard = prev.map((r) =>
        r.map((c) => ({ ...c, notes: [...c.notes] })),
      );
      newBoard[row][col].value = null;
      newBoard[row][col].notes = [];
      return validateBoard(newBoard);
    });
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "9") {
        handleNumberClick(parseInt(e.key, 10));
      } else if (e.key === "Backspace" || e.key === "Delete") {
        handleErase();
      } else if (e.key === "ArrowUp" && selectedCell) {
        setSelectedCell({
          row: Math.max(0, selectedCell.row - 1),
          col: selectedCell.col,
        });
      } else if (e.key === "ArrowDown" && selectedCell) {
        setSelectedCell({
          row: Math.min(8, selectedCell.row + 1),
          col: selectedCell.col,
        });
      } else if (e.key === "ArrowLeft" && selectedCell) {
        setSelectedCell({
          row: selectedCell.row,
          col: Math.max(0, selectedCell.col - 1),
        });
      } else if (e.key === "ArrowRight" && selectedCell) {
        setSelectedCell({
          row: selectedCell.row,
          col: Math.min(8, selectedCell.col + 1),
        });
      }
    },
    [selectedCell, board, noteMode],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (board.length === 0) return <div className="loading">読み込み中...</div>;

  return (
    <div className="app">
      <h1>数独</h1>
      <Controls
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onNewGame={startNewGame}
        isComplete={isComplete}
      />
      <SudokuBoard
        board={board}
        selectedCell={selectedCell}
        onSelectCell={handleSelectCell}
      />
      <NumberPad
        onNumberClick={handleNumberClick}
        onErase={handleErase}
        onNoteToggle={() => setNoteMode((prev) => !prev)}
        noteMode={noteMode}
      />
    </div>
  );
}

export default App;
