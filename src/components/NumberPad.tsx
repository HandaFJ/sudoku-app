interface NumberPadProps {
  onNumberClick: (num: number) => void;
  onErase: () => void;
  onNoteToggle: () => void;
  noteMode: boolean;
}

export default function NumberPad({
  onNumberClick,
  onErase,
  onNoteToggle,
  noteMode,
}: NumberPadProps) {
  return (
    <div className="number-pad">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          className="num-btn"
          onClick={() => onNumberClick(num)}
        >
          {num}
        </button>
      ))}
      <button className="control-btn" onClick={onErase}>
        消去
      </button>
      <button
        className={`control-btn ${noteMode ? "active" : ""}`}
        onClick={onNoteToggle}
      >
        メモ{noteMode ? "ON" : "OFF"}
      </button>
    </div>
  );
}
