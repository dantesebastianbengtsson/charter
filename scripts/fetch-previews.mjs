import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const songsPath = resolve(__dirname, "../src/data/songs.json");
const songs = JSON.parse(readFileSync(songsPath, "utf-8"));

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchDeezerInfo(song) {
  const query = encodeURIComponent(`artist:"${song.artist}" track:"${song.title}"`);
  const url = `https://api.deezer.com/search?q=${query}&limit=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`  HTTP ${res.status} for "${song.title}"`);
      return song;
    }
    const data = await res.json();
    let track = data.data?.[0];

    if (!track) {
      // Fallback: simpler search
      const simpleQuery = encodeURIComponent(`${song.artist} ${song.title}`);
      const res2 = await fetch(`https://api.deezer.com/search?q=${simpleQuery}&limit=1`);
      const data2 = await res2.json();
      track = data2.data?.[0];
    }

    if (track) {
      return {
        ...song,
        deezerId: track.id,
        // Album art URLs from Deezer CDN are stable (no expiry token)
        albumArtUrl: track.album?.cover_medium || track.album?.cover || "",
      };
    }

    console.warn(`  No results for "${song.title}" by ${song.artist}`);
    return song;
  } catch (err) {
    console.error(`  Error for "${song.title}": ${err.message}`);
    return song;
  }
}

async function main() {
  console.log(`Fetching Deezer info for ${songs.length} songs...`);
  const updated = [];
  let found = 0;

  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    process.stdout.write(`[${i + 1}/${songs.length}] ${song.title}...`);
    const result = await fetchDeezerInfo(song);
    if (result.deezerId) {
      found++;
      console.log(` ✓ (id: ${result.deezerId})`);
    } else {
      console.log(` ✗`);
    }
    updated.push(result);
    await delay(120);
  }

  writeFileSync(songsPath, JSON.stringify(updated, null, 2) + "\n");
  console.log(`\nDone! ${found}/${songs.length} songs have Deezer IDs.`);
}

main();
