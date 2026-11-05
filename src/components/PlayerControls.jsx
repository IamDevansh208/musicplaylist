function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function PlayerControls({ isPlaying, disabled, currentTime, duration, onToggle, onNext, onPrevious, onSeek }) {
  const safeDuration = Number.isFinite(duration) ? duration : 0;
  return (
    <div className="controls">
      <div className="progress-row">
        <span className="time">{formatTime(currentTime)}</span>
        <input
          type="range"
          className="progress"
          min="0"
          max={safeDuration}
          step="0.1"
          value={Math.min(currentTime, safeDuration)}
          onChange={(e) => onSeek(Number(e.target.value))}
          disabled={disabled || !safeDuration}
          aria-label="Seek"
          style={{ "--pct": safeDuration ? `${(currentTime / safeDuration) * 100}%` : "0%" }}
        />
        <span className="time">{formatTime(safeDuration)}</span>
      </div>
      <div className="button-row">
        <button className="round-btn" onClick={onPrevious} disabled={disabled} aria-label="Previous song">⏮</button>
        <button className="round-btn big" onClick={onToggle} disabled={disabled} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button className="round-btn" onClick={onNext} disabled={disabled} aria-label="Next song">⏭</button>
      </div>
    </div>
  );
}
