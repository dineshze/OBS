export const FARMING_STATES = {
  c1: { duration: 30000, next: null }, // 30 seconds, reverts to grass if not planted
  c2: { duration: 30000, next: 'c3' }, // 30 seconds to c3
  c3: { duration: 10000, next: 'c4' }, // 30 seconds to c4
  c4: { duration: 10000, next: 'c5' }, // 30 seconds to c5
  c5: { duration: Infinity, next: null } // Final stage, ready for harvest
};

export function prepareSoil(tile) {
  if (tile.type === "grass" && !tile.item) {
    return {
      ...tile,
      type: "c1",
      farming: {
        stage: 'c1',
        startedAt: Date.now()
      }
    };
  }
  return tile;
}

export function canPlantSeed(tile) {
  return tile.type === "c1" && tile.farming && tile.farming.stage === "c1";
}

export function plantSeed(tile) {
  if (!canPlantSeed(tile)) return tile;
  return {
    ...tile,
    type: "c2",
    farming: {
      stage: 'c2',
      startedAt: Date.now()
    }
  };
}

export function growCrops(map) {
  const now = Date.now();
  return map.map((row) =>
    row.map((tile) => {
      if (!tile.farming) return tile;

      const { stage, startedAt } = tile.farming;
      const state = FARMING_STATES[stage];
      if (!state || state.duration === Infinity) return tile;

      const elapsed = now - startedAt;
      if (elapsed >= state.duration) {
        if (stage === 'c1') {
          // c1 expired, revert to grass
          return { ...tile, type: "grass", farming: null };
        } else if (state.next) {
          // Progress to next stage
          return {
            ...tile,
            type: state.next,
            farming: {
              stage: state.next,
              startedAt: now
            }
          };
        }
      }
      return tile;
    })
  );
}

export function harvestCrop(tile) {
  if (tile.type !== "c5" || !tile.farming) return { tile, reward: null };

  return {
    tile: { ...tile, type: "grass", farming: null },
    reward: "wheat"
  };
}

export function tillSoil(tile) {
  if (tile.type === "grass" && !tile.item) {
    return {
      ...tile,
      type: "c1",
      farming: {
        stage: 'c1',
        startedAt: Date.now()
      }
    };
  }
  return tile;
}
