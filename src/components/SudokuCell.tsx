import { CellState, CellPosition } from "../types.ts";

interface SudokuCellProps {
  cell: CellState;
  position: CellPosition;
  isSelected: boolean;
  onSelect: (pos: CellPosition) => void;
}

export default function SudokuCell({
  cell,
  position,
  isSelected,
  onSelect,
}: SudokuCellProps) {
  const { row, col } = position;
  const isThickRight = (col + 1) % 3 === 0 && col !== 8;
  const isThickBottom = (row + 1) % 3 === 0 && row !== 8;

  const classNames = [
    "sudoku-cell",
    cell.isFixed ? "fixed" : "",
    isSelected ? "selected" : "",
    !cell.isValid ? "invalid" : "",
    cell.isHighlighted ? "highlighted" : "",
    isThickRight ? "thick-right" : "",
    isThickBottom ? "thick-bottom" : "",
  ].join(" ");

  return (
    <div className={classNames} onClick={() => onSelect(position)}>
      {cell.value !== null ? (
        <span className="cell-value">{cell.value}</span>
      ) : (
        <div className="notes">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) =>
            cell.notes.includes(n) ? (
              <span key={n} className="note">
                {n}
              </span>
            ) : (
              <span key={n} className="note empty" />
            ),
          )}
        </div>
      )}
    </div>
  );
}
