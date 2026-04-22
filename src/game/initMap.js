export function createMap() {
  const map = [];

  for (let y = 0; y < 8; y++) {
    let row = [];
    for (let x = 0; x < 8; x++) {
      row.push({ type: "grass", item: null });
    }
    map.push(row);
  }

  // Add initial entities
  const emptyTiles = [];
  map.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile.type === "grass" && !tile.item) emptyTiles.push({ x, y });
    });
  });

  // Shuffle empty tiles
  for (let i = emptyTiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [emptyTiles[i], emptyTiles[j]] = [emptyTiles[j], emptyTiles[i]];
  }

  // Add 2 trees
  for (let i = 0; i < 2 && emptyTiles.length > 0; i++) {
    const { x, y } = emptyTiles.pop();
    map[y][x].item = { type: "tree" };
  }

  // Add 1 mine
  if (emptyTiles.length > 0) {
    const { x, y } = emptyTiles.pop();
    map[y][x].item = { type: "mine" };
  }

  // Add 4 grass items
  for (let i = 0; i < 4 && emptyTiles.length > 0; i++) {
    const { x, y } = emptyTiles.pop();
    map[y][x].item = { type: "grass" };
  }

  return map;
}