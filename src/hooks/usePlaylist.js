import { useRef, useState } from "react";
import DoublyLinkedList from "../structures/DoublyLinkedList.js";
import { initialSongs } from "../data/songs.js";

function createInitialList() {
  const list = new DoublyLinkedList();
  initialSongs.forEach((song) => list.insertAtEnd(song));
  return list;
}

export default function usePlaylist() {
  // The linked list is the source of truth and survives re-renders.
  const listRef = useRef(null);
  if (listRef.current === null) listRef.current = createInitialList();
  const idCounter = useRef(0);

  // Array snapshot (built by traversal) only so React can render.
  const [songs, setSongs] = useState(() => listRef.current.toArray());
  const [currentSongId, setCurrentSongId] = useState(() => listRef.current.getFirst()?.id ?? null);

  const refresh = () => setSongs(listRef.current.toArray());
  const currentNode = currentSongId ? listRef.current.findById(currentSongId) : null;
  const currentSong = currentNode ? currentNode.song : null;

  // Adds to the end. Returns the new song (with a unique id).
  function addSong(song) {
    idCounter.current += 1;
    const newSong = { ...song, id: `song-${Date.now()}-${idCounter.current}` };
    listRef.current.insertAtEnd(newSong);
    refresh();
    if (currentSongId === null) setCurrentSongId(newSong.id);
    return newSong;
  }

  function removeSong(id) {
    const list = listRef.current;
    const node = list.findById(id);
    if (!node) return false;
    if (id === currentSongId) {
      // choose the neighbour (next, else previous, else nothing)
      const replacement = node.next ?? node.prev;
      setCurrentSongId(replacement ? replacement.song.id : null);
    }
    const removed = list.removeById(id);
    // safe to free a local file URL: this song is no longer in the list or player
    if (removed && removed.isLocal) URL.revokeObjectURL(removed.audioUrl);
    refresh();
    return true;
  }

  function selectSong(id) {
    if (!listRef.current.findById(id)) return false;
    setCurrentSongId(id);
    return true;
  }

  function playNext() {
    const list = listRef.current;
    if (list.size === 0 || currentSongId === null) return;
    const next = list.getNext(currentSongId) ?? list.getFirst(); // wrap to first
    setCurrentSongId(next.id);
  }

  function playPrevious() {
    const list = listRef.current;
    if (list.size === 0 || currentSongId === null) return;
    const prev = list.getPrevious(currentSongId) ?? list.getLast(); // wrap to last
    setCurrentSongId(prev.id);
  }

  function moveSong(id, direction) {
    const moved = listRef.current.move(id, direction);
    if (moved) refresh();
    return moved;
  }

  return { songs, currentSong, currentSongId, addSong, removeSong, selectSong, playNext, playPrevious, moveSong };
}
