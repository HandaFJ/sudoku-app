export type CellValue = number | null;

export interface CellPosition {
  row: number;
  col: number;
}

export interface CellState {
  value: CellValue;
  isFixed: boolean;
  isValid: boolean;
  isHighlighted: boolean;
  notes: number[];
}
