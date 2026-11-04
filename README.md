# melody.list — Music Playlist Manager Using Doubly Linked List

A college DSA project: a React music player whose playlist is a **manually implemented doubly linked list**.

## Objectives
- Show a real-world use of a doubly linked list (playlist with next/previous navigation and reordering).
- Keep the linked list as the single source of truth; React only renders a snapshot.

## Features
- Add local audio files (multi-select, non-audio files rejected), delete songs, move songs up/down.
- Next / previous with circular wrap-around, select any song.
- HTML5 audio player: play/pause, seek bar, current time, duration, auto-advance, error messages.
- Dark, responsive UI in plain CSS.
- Playback behaviour: if music is playing when you change song, the new song keeps playing; if paused, it stays paused.

## Technology Stack
React 19, JavaScript (ES6+), HTML/CSS, Vite (dev tooling only), HTML5 Audio API. No backend, database or state library.

## Folder Structure
```
src/
  components/  Playlist, SongItem, MusicPlayer, PlayerControls
  hooks/       usePlaylist.js
  data/        songs.js (sample tracks + generated covers)
  structures/  DoublyLinkedList.js, DoublyLinkedList.test.js
  App.jsx  App.css  index.css  main.jsx
```

## Install and Run
```
npm install

npm run build    # production build
npm test         # linked-list tests
npm run lint     # oxlint
```

## Doubly Linked List Explanation
`head ⇄ Song 1 ⇄ Song 2 ⇄ Song 3 ⇄ tail`

Each node stores `song`, `prev` and `next`. The list tracks `head`, `tail` and `size`.
- **insertAtEnd / insertAtBeginning** use `tail` / `head` for O(1) insertion.
- **removeById** finds the node, then links `node.prev` and `node.next` to each other, updating `head`/`tail` when the first or last node goes.
- **move(id, "up"|"down")** swaps a node with its neighbour by rewiring four pointers plus `head`/`tail` if needed; no array is involved.
- **getNext / getPrevious** follow one pointer; the hook wraps at the ends using `getFirst()` / `getLast()`.
- **toArray** traverses the list to create a snapshot for React rendering. The snapshot is never used for mutations.

## Custom Hook (`usePlaylist`)
Keeps the list in a `useRef` (persists between renders) and a snapshot in `useState`. After each successful mutation it calls `toArray()` to update the UI. It also generates unique ids, chooses a new current song when the current one is deleted (next, else previous, else `null`), wraps navigation, and ignores invalid ids safely.

## Complexity Analysis
| Operation | Time |
|---|---|
| Insert at beginning | O(1) |
| Insert at end using tail | O(1) |
| Search by ID | O(n) |
| Delete by ID including search | O(n) |
| Delete a known node | O(1) |
| Move a known node one position | O(1) |
| Move by ID, including search | O(n) |
| Traverse the list for UI rendering | O(n) |
| Move to the next/previous node | O(1) |

## Testing
`npm test` runs 16 plain-Node tests covering: empty list, first/multiple inserts, deleting first/last/middle/only node, moving first/last/middle nodes, edge moves, navigation, wrap support, invalid ids and empty playlist. Every test also checks that `prev`/`next`, `head`, `tail` and `size` are consistent in both directions.

Manual UI checks: upload a valid audio file and play it; disconnect the network (or use a bad URL) to see the error message; confirm the list updates after add, delete, move and navigation.

## Limitations
- Local files use `URL.createObjectURL`; these URLs are temporary and are lost on refresh.
- No backend or database, so the playlist is not saved.
- Sample tracks are royalty-free SoundHelix demo music and need an internet connection.
