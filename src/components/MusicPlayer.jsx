import { useEffect, useRef, useState } from "react";
import PlayerControls from "./PlayerControls.jsx";

export default function MusicPlayer({ song, onNext, onPrevious }) {
  const audioRef = useRef(null);
  const wantsToPlay = useRef(false); // true when the user wants playback to continue across songs
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const songId = song ? song.id : null;

  // When the song changes: reset state, and keep playing if playback was active.
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setError("");
    const audio = audioRef.current;
    if (songId && audio && wantsToPlay.current) {
      audio.play().catch(() => setError("Could not start playback for this song."));
    }
    if (!songId) {
      wantsToPlay.current = false;
      setIsPlaying(false);
    }
  }, [songId]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !song) return;
    if (audio.paused) {
      wantsToPlay.current = true;
      audio.play().catch(() => setError("Could not play this audio file."));
    } else {
      wantsToPlay.current = false;
      audio.pause();
    }
  }

  function handleSeek(value) {
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  }

  function handleEnded() {
    const audio = audioRef.current;
    if (!audio) return;
    onNext(); // linked-list next (wraps to first)
    // With a single song the id does not change, so restart it manually.
    audio.currentTime = 0;
    if (wantsToPlay.current) audio.play().catch(() => {});
  }

  return (
    <section className="panel player" aria-label="Music player">
      <img src={song ? song.cover : undefined} alt={song ? `Cover of ${song.title}` : ""} className={`player-cover ${song ? "" : "placeholder"}`} />
      <h2 className="player-title">{song ? song.title : "No song selected"}</h2>
      <p className="muted">{song ? song.artist : "Add songs to start listening"}</p>
      {error && <p className="notice error" role="alert">{error}</p>}

      <audio
        ref={audioRef}
        src={song ? song.audioUrl : undefined}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onEnded={handleEnded}
        onError={() => {
          if (song) setError("This audio could not be loaded. Check your connection or upload a local file.");
          setIsPlaying(false);
        }}
      />

      <PlayerControls
        isPlaying={isPlaying}
        disabled={!song}
        currentTime={currentTime}
        duration={duration}
        onToggle={togglePlay}
        onNext={onNext}
        onPrevious={onPrevious}
        onSeek={handleSeek}
      />
    </section>
  );
}
