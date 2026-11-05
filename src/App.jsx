import { useState } from "react";
import usePlaylist from "./hooks/usePlaylist.js";
import Playlist from "./components/Playlist.jsx";
import MusicPlayer from "./components/MusicPlayer.jsx";
import { makeCover } from "./data/songs.js";

export default function App() {
  const { songs, currentSong, currentSongId, addSong, removeSong, selectSong, playNext, playPrevious, moveSong } = usePlaylist();
  const [message, setMessage] = useState("");

  function handleAddFiles(files) {
    const audioFiles = files.filter((f) => f.type.startsWith("audio/"));
    const rejected = files.length - audioFiles.length;
    audioFiles.forEach((file) => {
      const title = file.name.replace(/\.[^/.]+$/, "");
      addSong({
        title,
        artist: "Local Audio",
        audioUrl: URL.createObjectURL(file), // temporary URL
        cover: makeCover(title, Math.floor(Math.random() * 360)),
        isLocal: true,
      });
    });
    if (files.length === 0) setMessage("");
    else if (rejected > 0) setMessage(`${rejected} file(s) skipped: only audio files are allowed.${audioFiles.length ? ` Added ${audioFiles.length}.` : ""}`);
    else setMessage(`Added ${audioFiles.length} song(s).`);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon" aria-hidden="true">♫</span>
          <span className="logo-name">melody.list</span>
        </div>
        <span className="tag">REACT + DOUBLY LINKED LIST</span>
      </header>

      <section className="hero">
        <h1>Every song has its place.</h1>
        <p className="muted">Add, remove and reorder tracks in a playlist powered by a doubly linked list, then jump forward and back through the nodes.</p>
      </section>

      <main className="layout">
        <Playlist
          songs={songs}
          currentSongId={currentSongId}
          onSelect={selectSong}
          onRemove={removeSong}
          onMove={moveSong}
          onAddFiles={handleAddFiles}
          message={message}
        />
        <MusicPlayer song={currentSong} onNext={playNext} onPrevious={playPrevious} />
      </main>
    </div>
  );
}
