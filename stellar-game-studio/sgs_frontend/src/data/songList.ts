export interface Song {
  id: string;
  index: number;
  title: string;
  artist: string;
  file: string;      // path relative to /game/assets/audio/
  bpm?: number;
  totalDuration?: number;  // full file length in seconds
  available: boolean;      // true = MP3 exists and is ready to play
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
    available: true,
    start: 28,
    duration: 155,
  },
  {
    id: 'rare-pizzas',
    index: 2,
    title: 'Rare Pizzas',
    artist: 'PizzaDAO',
    file: '02_rare_pizzas.mp3',
    bpm: 100,
    available: false,
    start: 0,
    duration: 120,
  },
  {
    id: 'pizza-mind',
    index: 3,
    title: 'Pizza Mind',
    artist: 'PizzaDAO',
    file: '03_pizza_mind.mp3',
    bpm: 90,
    available: false,
    start: 0,
    duration: 120,
  },
  {
    id: 'dao-it',
    index: 4,
    title: 'DAO It',
    artist: 'PizzaDAO',
    file: '04_dao_it.mp3',
    bpm: 110,
    available: false,
    start: 0,
    duration: 120,
  },
  {
    id: 'want-to-pie',
    index: 5,
    title: 'I Ate Myself and Want To Pie',
    artist: 'PizzaDAO',
    file: '05_want_to_pie.mp3',
    bpm: 95,
    available: false,
    start: 0,
    duration: 120,
  },
  {
    id: 'pizza-shortie',
    index: 6,
    title: 'Pizza Shortie',
    artist: 'PizzaDAO',
    file: '06_pizza_shortie.mp3',
    bpm: 105,
    available: false,
    start: 0,
    duration: 120,
  },
  {
    id: 'pizza-pop',
    index: 7,
    title: 'Pizza Pop',
    artist: 'PizzaDAO',
    file: '07_pizza_pop.mp3',
    bpm: 115,
    available: false,
    start: 0,
    duration: 120,
  },
  {
    id: 'wow-rare',
    index: 8,
    title: "Wow! That's Rare Pizzas",
    artist: 'PizzaDAO',
    file: '08_wow_rare.mp3',
    bpm: 98,
    available: false,
    start: 0,
    duration: 120,
  },
  {
    id: 'pizza-tron',
    index: 9,
    title: 'Pizza Tron',
    artist: 'PizzaDAO',
    file: '09_pizza_tron.mp3',
    bpm: 120,
    available: false,
    start: 0,
    duration: 120,
  },
  {
    id: 'pizzadao-meta',
    index: 10,
    title: 'PizzaDAO (We in the Metaverse)',
    artist: 'PizzaDAO',
    file: '10_pizzadao_meta.mp3',
    bpm: 95,
    available: false,
    start: 0,
    duration: 120,
  },
  {
    id: 'aint-no-za',
    index: 11,
    title: "Ain't No Za",
    artist: 'PizzaDAO',
    file: '11_aint_no_za.mp3',
    bpm: 88,
    available: false,
    start: 0,
    duration: 120,
  },
  {
    id: 'slice-heaven',
    index: 12,
    title: 'Slice of Heaven',
    artist: 'PizzaDAO',
    file: '12_slice_heaven.mp3',
    bpm: 92,
    available: false,
    start: 0,
    duration: 120,
  },
  {
    id: 'molto-bene',
    index: 13,
    title: 'Molto Bene',
    artist: 'PizzaDAO',
    file: '13_molto_bene.mp3',
    bpm: 100,
    available: false,
    start: 0,
    duration: 120,
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
