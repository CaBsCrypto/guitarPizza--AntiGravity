const fs = require('fs');

/**
 * NFT Hard Cap Distribution (Total 888):
 * 1 = Golden Oven (8)
 * 2 = Il Capo Oven (40)
 * 3 = Crypto Punk Oven (40)
 * 4 = Neon Oven (100)
 * 5 = Arcade Oven (100)
 * 6 = Brick Oven (200)
 * 7 = Steel Oven (200)
 * 8 = Vintage Oven (200)
 */

const distribution = {
  1: 8,
  2: 40,
  3: 40,
  4: 100,
  5: 100,
  6: 200,
  7: 200,
  8: 200
};

let map = [];
for (const [id, count] of Object.entries(distribution)) {
  for (let i = 0; i < count; i++) {
    map.push(Number(id));
  }
}

if (map.length !== 888) {
    console.error(`Math error: array length is ${map.length}, expected 888`);
    process.exit(1);
}

// Fisher-Yates Shuffle
for (let i = map.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [map[i], map[j]] = [map[j], map[i]];
}

// Save to frontend public assets so it's readable
fs.writeFileSync('./sgs_frontend/public/game/assets/metadata_map.json', JSON.stringify(map));
console.log('Successfully generated and shuffled 888 NFTs to metadata_map.json!');
