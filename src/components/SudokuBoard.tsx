import { CellState, CellPosition } from "../types.ts";
import SudokuCell from "./SudokuCell.tsx";

interface SudokuBoardProps {
  board: CellState[][];
  selectedCell: CellPosition | null;
  onSelectCell: (pos: CellPosition | null) => void;
}

export default function SudokuBoard({
  board,
  selectedCell,
  onSelectCell,
}: SudokuBoardProps) {
  const handleSelect = (pos: CellPosition) => {
    onSelectCell(pos);
  };

  return (
    <div className="sudoku-board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <SudokuCell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            position={{ row: rowIndex, col: colIndex }}
            isSelected={
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex
            }
            onSelect={handleSelect}
          />
        )),
      )}
    </div>
  );
}
