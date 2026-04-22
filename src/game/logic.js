import { CRAFT_RECIPES, PLACEABLE_ITEMS } from "./itemData";

export function addToHotbar(player, itemType, count = 1) {
  const newInventory = [...player.inventory];
  
  for (let i = 0; i < 5; i++) {
    if (newInventory[i] && newInventory[i].type === itemType) {
      newInventory[i] = { ...newInventory[i], count: newInventory[i].count + count };
      return { ...player, inventory: newInventory };
    }
  }
  
  for (let i = 0; i < 5; i++) {
    if (!newInventory[i]) {
      newInventory[i] = { type: itemType, count };
      return { ...player, inventory: newInventory };
    }
  }
  
  return addToInventory(player, itemType, count);
}

export function addToInventory(player, itemType, count = 1) {
  const newInventory = [...player.inventory];
  
  for (let i = 0; i < newInventory.length; i++) {
    if (newInventory[i] && newInventory[i].type === itemType) {
      newInventory[i] = { ...newInventory[i], count: newInventory[i].count + count };
      return { ...player, inventory: newInventory };
    }
  }
  
  for (let i = 0; i < newInventory.length; i++) {
    if (!newInventory[i]) {
      newInventory[i] = { type: itemType, count };
      return { ...player, inventory: newInventory };
    }
  }
  
  return null;
}

export function mineTile(player, map) {
  const { x, y } = player;
  const directions = [
    [1,0], [-1,0], [0,1], [0,-1]
  ];

  for (let [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;

    if (map[ny] && map[ny][nx]?.item?.type === "mine") {
      const drops = ["small_stone", "stick", "grass", "iron"];
      const item = drops[Math.floor(Math.random() * drops.length)];

      return {
        player: {
          ...player,
          inventory: {
            ...player.inventory,
            [item]: (player.inventory[item] || 0) + 1
          }
        },
        map
      };
    }
  }

  
  if (map[y] && map[y][x]?.type === "grass") {
    const drops = ["grass", "seed"];
    const item = drops[Math.floor(Math.random() * drops.length)];

    const newMap = map.map((row, rowY) =>
      rowY === y
        ? row.map((cell, cellX) =>
            cellX === x ? { ...cell, type: "tilled" } : cell
          )
        : row
    );

    return {
      player: {
        ...player,
        inventory: {
          ...player.inventory,
          [item]: (player.inventory[item] || 0) + 1
        }
      },
      map: newMap
    };
  }

  return { player, map };
}

export function placeItem(player, map, targetX, targetY) {
  const slot = player.inventory[player.selectedSlot];
  if (!slot || slot.count <= 0) return { player, map };

  if (!PLACEABLE_ITEMS.includes(slot.type)) return { player, map };

  const tile = map[targetY][targetX];
  if (tile.item) return { player, map }; 

  
  if (slot.type === "seed") {
    if (tile.type !== "c1" || !tile.farming || tile.farming.stage !== "c1") return { player, map };
    
    const newMap = map.map((row, y) =>
      y === targetY
        ? row.map((cell, x) =>
            x === targetX
              ? {
                  ...cell,
                  type: "c2",
                  farming: {
                    stage: 'c2',
                    startedAt: Date.now()
                  }
                }
              : cell
          )
        : row
    );
    const newInventory = [...player.inventory];
    const newCount = slot.count - 1;
    newInventory[player.selectedSlot] = newCount > 0 ? { ...slot, count: newCount } : null;

    return {
      map: newMap,
      player: { ...player, inventory: newInventory }
    };
  }

  
  const newMap = map.map((row, y) =>
    y === targetY
      ? row.map((cell, x) =>
          x === targetX
            ? {
                ...cell,
                item: {
                  type: slot.type,
                  storage: (slot.type === "chest" || slot.type === "furnace") ? {} : null
                }
              }
            : cell
        )
      : row
  );

  const newInventory = [...player.inventory];
  const newCount = slot.count - 1;
  newInventory[player.selectedSlot] = newCount > 0 ? { ...slot, count: newCount } : null;

  return {
    map: newMap,
    player: { ...player, inventory: newInventory }
  };
}

export function craftItem(player, recipeId) {
  const recipe = CRAFT_RECIPES[recipeId];
  if (!recipe) return { player, success: false };

  
  const totalCounts = {};
  player.inventory.forEach(slot => {
    if (slot) {
      totalCounts[slot.type] = (totalCounts[slot.type] || 0) + slot.count;
    }
  });

  const canCraft = Object.entries(recipe.requires).every(
    ([type, count]) => (totalCounts[type] || 0) >= count
  );

  if (!canCraft) return { player, success: false };

  
  const newInventory = [...player.inventory];
  Object.entries(recipe.requires).forEach(([type, requiredCount]) => {
    let remaining = requiredCount;
    for (let i = 0; i < newInventory.length; i++) {
      if (newInventory[i] && newInventory[i].type === type && remaining > 0) {
        const fromSlot = Math.min(remaining, newInventory[i].count);
        newInventory[i].count -= fromSlot;
        remaining -= fromSlot;
        if (newInventory[i].count <= 0) {
          newInventory[i] = null;
        }
      }
    }
  });

  
  const resultInventory = addToInventory({ ...player, inventory: newInventory }, recipe.result, 1);
  return { player: resultInventory, success: true };
}

export function pickupItem(player, map, targetX, targetY) {
  const tile = map[targetY]?.[targetX];
  if (!tile?.item) return { player, map };

  let itemType = tile.item.type;
  let count = 1;

  
  if (itemType === "tree") {
    itemType = "wood";
    count = Math.floor(Math.random() * 3) + 1; 
  } else if (itemType === "mine") {
    itemType = "iron";
    count = Math.floor(Math.random() * 2) + 1; 
  } else if (itemType === "supply_box") {
    
    return { player, map };
  }

  const updatedPlayer = addToHotbar(player, itemType, count) || addToInventory(player, itemType, count);

  const newMap = map.map((row, i) =>
    i === targetY
      ? row.map((t, j) => (j === targetX ? { ...t, item: null } : t))
      : row
  );

  return { player: updatedPlayer, map: newMap };
}

export function interactWithTile(player, map, actionType) {
  if (actionType === "mine") {
    return mineTile(player, map);
  }
  return { player, map };
}