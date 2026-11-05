import { useRef } from "react";
import SongItem from "./SongItem.jsx";

export default function Playlist({ songs, currentSongId, onSelect, onRemove, onMove, onAddFiles, message }) {
  const fileInputRef = useRef(null);

  function handleFiles(event) {
    onAddFiles(Array.from(event.target.files));
    event.target.value = ""; // allow picking the same file again
  }

  return (
    <section className="panel" aria-labelledby="playlist-title">
      <div className="panel-header">
        <div>
          <h2 id="playlist-title">My Playlist</h2>
          <p className="muted">{songs.length} {songs.length === 1 ? "song" : "songs"}</p>
        </div>
        <button className="btn primary" onClick={() => fileInputRef.current.click()}>+ Add Songs</button>
        <input ref={fileInputRef} type="file" accept="audio/*" multiple hidden onChange={handleFiles} aria-label="Choose audio files" />
      </div>
      {message && <p className="notice" role="status">{message}</p>}
      {songs.length === 0 ? (
        <p className="empty">Your playlist is empty. Add some songs to get started.</p>
      ) : (
        <ul className="song-list">
          {songs.map((song, i) => (
            <SongItem
              key={song.id}
              song={song}
              index={i}
              isFirst={i === 0}
              isLast={i === songs.length - 1}
              isCurrent={song.id === currentSongId}
              onSelect={onSelect}
              onRemove={onRemove}
              onMove={onMove}
            />
          ))}
        </ul>
      )}
      <p className="hint">Local files use temporary browser URLs and will not survive a page refresh.</p>
    </section>
  );
}
