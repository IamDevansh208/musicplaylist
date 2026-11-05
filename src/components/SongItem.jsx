export default function SongItem({ song, index, isFirst, isLast, isCurrent, onSelect, onRemove, onMove }) {
  return (
    <li className={`song-item ${isCurrent ? "current" : ""}`}>
      <button className="song-main" onClick={() => onSelect(song.id)} aria-label={`Select ${song.title}`}>
        <span className="song-index">{isCurrent ? "♪" : index + 1}</span>
        <img src={song.cover} alt="" className="song-cover" />
        <span className="song-text">
          <span className="song-title">{song.title}</span>
          <span className="song-artist">{song.artist}</span>
        </span>
      </button>
      <div className="song-actions">
        <button className="icon-btn" onClick={() => onMove(song.id, "up")} disabled={isFirst} aria-label={`Move ${song.title} up`}>▲</button>
        <button className="icon-btn" onClick={() => onMove(song.id, "down")} disabled={isLast} aria-label={`Move ${song.title} down`}>▼</button>
        <button className="icon-btn danger" onClick={() => onRemove(song.id)} aria-label={`Delete ${song.title}`}>✕</button>
      </div>
    </li>
  );
}
