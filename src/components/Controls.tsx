interface ControlsProps {
  difficulty: "easy" | "medium" | "hard";
  onDifficultyChange: (d: "easy" | "medium" | "hard") => void;
  onNewGame: () => void;
  isComplete: boolean;
}

export default function Controls({
  difficulty,
  onDifficultyChange,
  onNewGame,
  isComplete,
}: ControlsProps) {
  return (
    <div className="controls">
      <div className="difficulty-selector">
        <label>難易度:</label>
        <select
          value={difficulty}
          onChange={(e) =>
            onDifficultyChange(e.target.value as "easy" | "medium" | "hard")
          }
        >
          <option value="easy">かんたん</option>
          <option value="medium">ふつう</option>
          <option value="hard">むずかしい</option>
        </select>
      </div>
      <button className="new-game-btn" onClick={onNewGame}>
        新規ゲーム
      </button>
      {isComplete && <div className="complete-message">クリア！</div>}
    </div>
  );
}
