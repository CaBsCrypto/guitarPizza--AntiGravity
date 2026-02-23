export interface Song {
  id: string;
  index: number;
  title: string;
  artist: string;
  file: string;       // path relative to /game/assets/audio/
  bpm?: number;       // fill in manually after listening
  duration?: number;  // seconds
}

export const SONGS: Song[] = [
  {
    id: 'sauce',
    index: 1,
    title: 'Sauce',
    artist: 'PizzaDAO feat. IFE SENOJ & TAJ.',
    file: '01_sauce.mp3',
  },
  // TODO: add remaining 13 songs after download
  // { id: 'rare-pizzas',   index: 2,  title: 'Rare Pizzas',   artist: 'PizzaDAO', file: '02_rare_pizzas.mp3' },
  // { id: 'pizza-mind',    index: 3,  title: 'Pizza Mind',    artist: 'PizzaDAO', file: '03_pizza_mind.mp3' },
  // { id: 'dao-it',        index: 4,  title: 'DAO It',        artist: 'PizzaDAO', file: '04_dao_it.mp3' },
  // { id: 'want-to-pie',   index: 5,  title: 'I Ate Myself and Want To Pie', artist: 'PizzaDAO', file: '05_want_to_pie.mp3' },
  // { id: 'pizza-shortie', index: 6,  title: 'Pizza Shortie', artist: 'PizzaDAO', file: '06_pizza_shortie.mp3' },
  // { id: 'pizza-pop',     index: 7,  title: 'Pizza Pop',     artist: 'PizzaDAO', file: '07_pizza_pop.mp3' },
  // { id: 'wow-rare',      index: 8,  title: "Wow! That's Rare Pizzas", artist: 'PizzaDAO', file: '08_wow_rare.mp3' },
  // { id: 'pizza-tron',    index: 9,  title: 'Pizza Tron',    artist: 'PizzaDAO', file: '09_pizza_tron.mp3' },
  // { id: 'pizzadao-meta', index: 10, title: 'PizzaDAO (We in the Metaverse)', artist: 'PizzaDAO', file: '10_pizzadao_meta.mp3' },
  // { id: 'aint-no-za',    index: 11, title: "Ain't No Za", artist: 'PizzaDAO', file: '11_aint_no_za.mp3' },
  // { id: 'slice-heaven',  index: 12, title: 'Slice of Heaven', artist: 'PizzaDAO', file: '12_slice_heaven.mp3' },
  // { id: 'molto-bene',    index: 13, title: 'Molto Bene',   artist: 'PizzaDAO', file: '13_molto_bene.mp3' },
  // { id: 'outro',         index: 14, title: 'Rare Pizzas Mixtape Outro', artist: 'PizzaDAO', file: '14_outro.mp3' },
];

/** Pick a random song from the available list */
export function getRandomSong(): Song {
  return SONGS[Math.floor(Math.random() * SONGS.length)];
}

/** Get song by id */
export function getSongById(id: string): Song | undefined {
  return SONGS.find(s => s.id === id);
}

/** Resolve full public path for a song file */
export function songPath(song: Song): string {
  return `/game/assets/audio/${song.file}`;
}
