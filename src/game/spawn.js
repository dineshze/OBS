export const SPAWN_COOLDOWNS_MS = {
  tree: 30000, // 30 seconds
  mine: 60000, // 1 minute
  grass: 120000 // 2 minutes
};

export const MIN_ENTITY_COUNTS = {
  tree: 2,
  mine: 1,
  grass: 4
};

export function countEntities(map, type) {
  return map.reduce((count, row) => {
    return (
      count +
      row.reduce((itemCount, tile) => {
        return itemCount + (tile.item?.type === type ? 1 : 0);
      }, 0)
    );
  }, 0);
}

export function findEmptyGrassTiles(map) {
  const emptyTiles = [];
  map.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (!tile.item && tile.type === "grass") emptyTiles.push({ x, y });
    });
  });
  return emptyTiles;
}

export function spawnEntity(map) {
  const emptyTiles = findEmptyGrassTiles(map);
  if (emptyTiles.length === 0) return map;

  let newMap = map;
  const treeCount = countEntities(map, "tree");
  const mineCount = countEntities(map, "mine");
  const grassCount = countEntities(map, "grass");

  // Spawn trees up to 2
  for (let i = treeCount; i < MIN_ENTITY_COUNTS.tree && emptyTiles.length > 0; i++) {
    const index = Math.floor(Math.random() * emptyTiles.length);
    const { x, y } = emptyTiles.splice(index, 1)[0];
    newMap = newMap.map((row, rowIndex) =>
      rowIndex === y
        ? row.map((tile, colIndex) =>
            colIndex === x
              ? {
                  ...tile,
                  item: { type: "tree" }
                }
              : tile
          )
        : row
    );
  }

  // Spawn mine up to 1
  if (mineCount < MIN_ENTITY_COUNTS.mine && emptyTiles.length > 0) {
    const index = Math.floor(Math.random() * emptyTiles.length);
    const { x, y } = emptyTiles.splice(index, 1)[0];
    newMap = newMap.map((row, rowIndex) =>
      rowIndex === y
        ? row.map((tile, colIndex) =>
            colIndex === x
              ? {
                  ...tile,
                  item: { type: "mine" }
                }
              : tile
          )
        : row
    );
  }

  // Spawn grass up to 4
  for (let i = grassCount; i < MIN_ENTITY_COUNTS.grass && emptyTiles.length > 0; i++) {
    const index = Math.floor(Math.random() * emptyTiles.length);
    const { x, y } = emptyTiles.splice(index, 1)[0];
    newMap = newMap.map((row, rowIndex) =>
      rowIndex === y
        ? row.map((tile, colIndex) =>
            colIndex === x
              ? {
                  ...tile,
                  item: { type: "grass" }
                }
              : tile
          )
        : row
    );
  }

  return newMap;
}

export function shouldSpawn(map) {
  const treeCount = countEntities(map, "tree");
  const mineCount = countEntities(map, "mine");
  const grassCount = countEntities(map, "grass");

  return treeCount < MIN_ENTITY_COUNTS.tree ||
         mineCount < MIN_ENTITY_COUNTS.mine ||
         grassCount < MIN_ENTITY_COUNTS.grass;
}
