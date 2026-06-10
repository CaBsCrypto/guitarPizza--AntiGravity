export interface Song {
  id: string;
  index: number;
  title: string;
  artist: string;
  file: string;      // path relative to /game/assets/audio/
  bpm?: number;
  totalDuration?: number;  // full file length in seconds
  available: boolean;      // true = MP3 exists and is ready to play
  difficulty: 1 | 2 | 3;  // 1=easy, 2=medium, 3=hard
  // ── Segment ──────────────────────────────────────────────────────────────
  start: number;     // seconds into the file where gameplay begins
  duration: number;  // how many seconds to play (game length)
}

export const SONGS: Song[] = [
  {
    id: 'sauce',
    index: 1,
    title: 'Sauce',
    artist: 'PizzaDAO feat. IFE SENOJ & TAJ.',
    file: '01_sauce.mp3',
    totalDuration: 190,
    bpm: 95,
    difficulty: 1,
    available: true,
    start: 28,
    duration: 150,
  },
  {
    id: 'rare-pizzas',
    index: 2,
    title: 'Rare Pizzas (Hard Mode)',
    artist: 'PizzaDAO',
    file: '02_Rare Pizzas.mp3',
    bpm: 115, // Faster!
    difficulty: 3,
    available: true,
    start: 0,
    duration: 60,
  },
  {
    id: 'pizza-mind',
    index: 3,
    title: 'Pizza Mind',
    artist: 'PizzaDAO',
    file: '03_Pizza Mind.mp3',
    bpm: 90,
    difficulty: 1,
    available: true,
    start: 0,
    duration: 99.5,
  },
  {
    id: 'dao-it',
    index: 4,
    title: 'DAO It',
    artist: 'PizzaDAO',
    file: '04_DAO It.mp3',
    bpm: 110,
    difficulty: 2,
    available: true,
    start: 0,
    duration: 168.2,
  },
  {
    id: 'want-to-pie',
    index: 5,
    title: 'I Ate Myself and Want To Pie',
    artist: 'PizzaDAO',
    file: '05_I Ate Myself and Want To Pie.mp3',
    bpm: 95,
    difficulty: 1,
    available: true,
    start: 0,
    duration: 30.4,
  },
  {
    id: 'pizza-shortie',
    index: 6,
    title: 'Pizza Shortie',
    artist: 'PizzaDAO',
    file: '06_Pizza Shortie.mp3',
    bpm: 105,
    difficulty: 2,
    available: true,
    start: 0,
    duration: 80.8,
  },
  {
    id: 'pizza-pop',
    index: 7,
    title: 'Pizza Pop',
    artist: 'PizzaDAO',
    file: '07_Pizza Pop.mp3',
    bpm: 115,
    difficulty: 2,
    available: true,
    start: 0,
    duration: 104.6,
  },
  {
    id: 'wow-rare',
    index: 8,
    title: "Wow! That's Rare Pizzas",
    artist: 'PizzaDAO',
    file: "08_Wow! That's Rare Pizzas.mp3",
    bpm: 98,
    difficulty: 2,
    available: true,
    start: 0,
    duration: 75.7,
  },
  {
    id: 'pizza-tron',
    index: 9,
    title: 'Pizza Tron',
    artist: 'PizzaDAO',
    file: '09_Pizza Tron.mp3',
    bpm: 120,
    difficulty: 3,
    available: true,
    start: 0,
    duration: 137.9,
  },
  {
    id: 'pizzadao-meta',
    index: 10,
    title: 'PizzaDAO (We in the Metaverse)',
    artist: 'PizzaDAO',
    file: '10_PizzaDAO (We in the Metaverse).mp3',
    bpm: 95,
    difficulty: 1,
    available: true,
    start: 0,
    duration: 60,
  },
  {
    id: 'aint-no-za',
    index: 11,
    title: "Ain't No Za",
    artist: 'PizzaDAO',
    file: "11_Ain't No Za (if The Homies Can't Have a Slice).mp3",
    bpm: 88,
    difficulty: 1,
    available: true,
    start: 0,
    duration: 136.7,
  },
  {
    id: 'slice-heaven',
    index: 12,
    title: 'Slice of Heaven',
    artist: 'PizzaDAO',
    file: '12_Slice of Heaven.mp3',
    bpm: 92,
    difficulty: 2,
    available: true,
    start: 0,
    duration: 160.2,
  },
  {
    id: 'molto-bene',
    index: 13,
    title: 'Molto Bene',
    artist: 'PizzaDAO',
    file: '13_Molto Bene.mp3',
    bpm: 100,
    difficulty: 2,
    available: true,
    start: 0,
    duration: 66,
  },
];

/** Get only available (unlocked) songs */
export function getAvailableSongs(): Song[] {
  return SONGS.filter(s => s.available);
}

/** Pick a random available song */
export function getRandomSong(): Song {
  const available = getAvailableSongs();
  return available[Math.floor(Math.random() * available.length)];
}

/** Get song by id */
export function getSongById(id: string): Song | undefined {
  return SONGS.find(s => s.id === id);
}

/** Resolve full public URL for the audio file */
export function songPath(song: Song): string {
  return `/game/assets/audio/${song.file}`;
}
