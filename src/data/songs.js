// Sample tracks: royalty-free SoundHelix demo music (https://www.soundhelix.com).
// They are demonstration tracks, not commercial songs.

// Generates a gradient cover image (SVG data URI) so no image files are needed.
export function makeCover(title, hue = 260) {
  const letter = (title.trim()[0] || "♪").toUpperCase().replace(/[<>&"']/g, "♪");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="hsl(${hue},70%,55%)"/><stop offset="1" stop-color="hsl(${(hue + 60) % 360},65%,30%)"/>` +
    `</linearGradient></defs><rect width="200" height="200" fill="url(#g)"/>` +
    `<text x="100" y="125" font-size="90" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="white" fill-opacity="0.85">${letter}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

const base = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-";

export const initialSongs = [
  { id: "song-1", title: "Demo Track 1", artist: "SoundHelix", audioUrl: base + "1.mp3", cover: makeCover("Demo Track 1", 270) },
  { id: "song-2", title: "Demo Track 2", artist: "SoundHelix", audioUrl: base + "2.mp3", cover: makeCover("Demo Track 2", 310) },
  { id: "song-3", title: "Demo Track 3", artist: "SoundHelix", audioUrl: base + "3.mp3", cover: makeCover("Demo Track 3", 230) },
  { id: "song-4", title: "Demo Track 4", artist: "SoundHelix", audioUrl: base + "4.mp3", cover: makeCover("Demo Track 4", 340) },
];
