import { useState, useEffect } from "react";
import { createMap } from "./game/initMap";
import { craftItem, placeItem } from "./game/logic";
import { DEFAULT_INVENTORY, PLACEABLE_ITEMS, SMELTING_RECIPES } from "./game/itemData";
import { MAX_HUNGER, MAX_HEALTH } from "./game/survival";
import { growCrops, tillSoil, harvestCrop } from "./game/farming";
import { spawnEntity, shouldSpawn } from "./game/spawn";
import Grid from "./components/Grid";
import Inventory from "./components/Inventory";
import Hotbar from "./components/Hotbar";
import Crafting from "./components/Crafting";
import StatusBar from "./components/StatusBar";
import ChestModal from "./components/ChestModal";
import FurnaceModal from "./components/FurnaceModal";

function inventoryArrayToObject(inventoryArray) {
  const obj = {};
  inventoryArray.forEach(slot => {
    if (slot) {
      obj[slot.type] = (obj[slot.type] || 0) + slot.count;
    }
  });
  return obj;
}

function addToInventory(currentInventory, itemType, count = 1) {
  const newInventory = [...currentInventory];
  // First, try to stack in existing slots
      return newInventory;
    }
  }
  // Then, find empty slot
      return newInventory;
    }
  }
  // No space
  return currentInventory;
}

export default function App() {
  const [map, setMap] = useState(createMap());
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [craftingOpen, setCraftingOpen] = useState(false);
  const [chestOpen, setChestOpen] = useState(false);
  const [activeChest, setActiveChest] = useState(null);
  const [furnaceOpen, setFurnaceOpen] = useState(false);
  const [activeFurnace, setActiveFurnace] = useState(null);
  const [mining, setMining] = useState(null); // { x, y, progress, maxProgress }

  const [player, setPlayer] = useState({
    health: MAX_HEALTH,
    hunger: MAX_HUNGER,
    inventory: Array(25).fill(null),
    selectedSlot: 0
  });

  function handleCraft(recipeId) {
    const result = craftItem(player, recipeId);
    if (result.success) {
      setPlayer(result.player);
    }
  }

  function handleCellClick(x, y) {
    const tile = map[y]?.[x];
    if (!tile) return;

    // Check if player has hoi to till soil
    const tool = player.inventory[player.selectedSlot]?.type;
    if (tool === "hoi" && tile.type === "grass" && !tile.item) {
      // Till soil with hoi
      const newMap = map.map((row, rowY) =>
        rowY === y
          ? row.map((cell, cellX) =>
              cellX === x ? tillSoil(cell) : cell
            )
          : row
      );
      setMap(newMap);
      return;
    }

    if (tile.item) {
      if (tile.item.type === "chest") {
        setActiveChest({ x, y, storage: tile.item.storage });
        setChestOpen(true);
        return;
      }
      if (tile.item.type === "furnace") {
        setActiveFurnace({ x, y, storage: tile.item.storage, smelting: tile.item.smelting });
        setFurnaceOpen(true);
        return;
      }
      // Mining logic
      const type = tile.item.type;
      if (!["tree", "mine", "grass"].includes(type)) return;

      if (mining) return; // Already mining

      const isStoneAxe = tool === "stone_axe";
      const isIronAxe = tool === "iron_axe";

      let duration = 5000; // 5 seconds
      if (isStoneAxe || isIronAxe) duration = 3000; // 3 seconds with tool

      setMining({ x, y, progress: 0, maxProgress: duration });
    } else {
      // Harvesting logic for ready crops
      if (tile.type === "c5" && tile.farming) {
        const harvestResult = harvestCrop(tile);
        if (harvestResult.reward) {
          setMap(prevMap =>
            prevMap.map((row, rowY) =>
              rowY === y
                ? row.map((cell, cellX) =>
                    cellX === x ? harvestResult.tile : cell
                  )
                : row
            )
          );
          setPlayer(prevPlayer => ({
            ...prevPlayer,
            inventory: addToInventory(prevPlayer.inventory, harvestResult.reward, 1)
          }));
        }
        return;
      }

      // Placing logic
      const slot = player.inventory[player.selectedSlot];
      if (slot && slot.count > 0 && PLACEABLE_ITEMS.includes(slot.type)) {
        const result = placeItem(player, map, x, y);
        setPlayer(result.player);
        setMap(result.map);
      }
    }
  }

  function handleMoveHotbarToInventory(hotbarIndex) {
    const slot = player.inventory[hotbarIndex];
    if (!slot) return;

    // Find first empty inventory slot (5-24)
    for (let i = 5; i < 25; i++) {
      if (!player.inventory[i]) {
        const newInventory = [...player.inventory];
        newInventory[i] = slot;
        newInventory[hotbarIndex] = null;
        setPlayer(prev => ({
          ...prev,
          inventory: newInventory
        }));
        return;
      }
    }
    // No empty slot, do nothing
  }


      ...player.inventory,
    };


    if (!currentSlot) {
      newHotbar[hotbarIndex] = { type: itemType, count: 1 };
    } else if (currentSlot.type === itemType) {
      newHotbar[hotbarIndex] = { ...currentSlot, count: currentSlot.count + 1 };
    } else {
      newHotbar[hotbarIndex] = { type: itemType, count: 1 };
    }

    setPlayer(prev => ({
      ...prev,
      inventory: newInventory,
      hotbar: newHotbar
    }));
  }

  function handleCloseChest() {
    if (activeChest) {
      setMap(prev =>
        prev.map((row, y) =>
          row.map((tile, x) => {
            if (x === activeChest.x && y === activeChest.y && tile.item?.type === "chest") {
              return {
                ...tile,
                item: {
                  ...tile.item,
                  storage: activeChest.storage
                }
              };
            }
            return tile;
          })
        )
      );
      setActiveChest(null);
    }
    setChestOpen(false);
  }

  function handleCloseFurnace() {
    if (activeFurnace) {
      setMap(prev =>
        prev.map((row, y) =>
          row.map((tile, x) => {
            if (x === activeFurnace.x && y === activeFurnace.y && tile.item?.type === "furnace") {
              return {
                ...tile,
                item: {
                  ...tile.item,
                  storage: activeFurnace.storage,
                  smelting: activeFurnace.smelting
                }
              };
            }
            return tile;
          })
        )
      );
      setActiveFurnace(null);
    }
    setFurnaceOpen(false);
  }

  // ✅ WASD keyboard support
  useEffect(() => {
    if (!mining) return;

    const interval = setInterval(() => {
      setMining(prev => {
        if (!prev) return null;
        const newProgress = prev.progress + 100;
        if (newProgress >= prev.maxProgress) {
          // Mining complete
          const tile = map[prev.y]?.[prev.x];
          if (tile?.item) {
            const type = tile.item.type;
            const tool = player.inventoryory[player.selectedSlot]?.type;
            const isStoneAxe = tool === "stone_axe";
            const isIronAxe = tool === "iron_axe";

            let rewards = {};
            if (type === "tree") {
              if (isIronAxe) {
                rewards = { wood: 4, apple: 2 };
              } else if (isStoneAxe) {
                rewards = { wood: 2, apple: 1 };
              } else {
                rewards = { wood: 1 };
              }
            } else if (type === "mine") {
              if (isIronAxe) {
                rewards = { stone: 4, iron_ore: 2, stihl_ore: 1 };
              } else if (isStoneAxe) {
                rewards = { stone: 2, iron_ore: 1 };
              } else {
                rewards = { stone: 1 };
              }
            } else if (type === "grass") {
              if (isIronAxe) {
                rewards = { seed: 4 };
              } else if (isStoneAxe) {
                rewards = { seed: 2 };
              } else {
                rewards = { seed: 1 };
              }
            }

            // Add rewards to inventory
            setPlayer(prevPlayer => ({
              ...prevPlayer,
              inventory: Object.keys(rewards).reduce((inv, item) => addToInventory(inv, item, rewards[item]), prevPlayer.inventory)
            }));

            // Remove the mined item
            setMap(prevMap =>
              prevMap.map((row, rowY) =>
                rowY === prev.y
                  ? row.map((cell, cellX) =>
                    cellX === prev.x ? { ...cell, item: null } : cell
                  )
                  : row
              )
            );
          }
          return null;
        }
        return { ...prev, progress: newProgress };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [mining, map, player.inventory, player.selectedSlot]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayer(prev => ({
        ...prev,
        health: Math.max(0, Math.min(MAX_HEALTH, prev.health)),
        hunger: Math.max(0, Math.min(MAX_HUNGER, prev.hunger))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMap(prevMap => {
        if (shouldSpawn(prevMap)) {
          return spawnEntity(prevMap);
        }
        return prevMap;
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMap(prevMap => growCrops(prevMap));
    }, 1000); // Update crops every second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFurnace(prev => {
        if (!prev || !prev.smelting) return prev;
        const newProgress = prev.smelting.progress + 100;
        if (newProgress >= prev.smelting.max) {
          // Smelting complete
          const recipe = SMELTING_RECIPES[prev.smelting.item];
          const newStorage = { ...prev.storage };
          newStorage[recipe.result] = (newStorage[recipe.result] || 0) + 1;
          return {
            ...prev,
            storage: newStorage,
            smelting: null
          };
        }
        return {
          ...prev,
          smelting: { ...prev.smelting, progress: newProgress }
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen bg-emerald-500">
      <div className="p-3 max-w-md mx-auto">
        <StatusBar health={player.health} hunger={player.hunger} />
        <Grid map={map} onCellClick={handleCellClick} mining={mining} />

        <Hotbar
          inventory={player.inventory}
          selected={player.selectedSlot}
          setSelected={(i) => setPlayer(p => ({ ...p, selectedSlot: i }))}
          onMoveToInventory={handleMoveHotbarToInventory}
        />

        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setInventoryOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Open Inventory
          </button>
          <button
            onClick={() => setCraftingOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Open Crafting
          </button>
        </div>

        <Inventory
          inventory={player.inventory}
          selectedSlot={player.selectedSlot}
          setSelectedSlot={(i) => setPlayer(p => ({ ...p, selectedSlot: i }))}
          isOpen={inventoryOpen}
          onClose={() => setInventoryOpen(false)}
        />

        <ChestModal
          isOpen={chestOpen}
          chestStorage={activeChest?.storage || {}}
          playerInventory={inventoryArrayToObject(player.inventory)}
          onClose={handleCloseChest}
          onTransferToChest={(itemType, count) => {
            if (!itemType || !activeChest || (inventoryArrayToObject(player.inventory)[itemType] || 0) < count) return;

            const newInventory = [...player.inventory];
            let remaining = count;
                const fromSlot = Math.min(remaining, newInventory[i].count);
                newInventory[i].count -= fromSlot;
                remaining -= fromSlot;
                  newInventory[i] = null;
                }
              }
            }
            setActiveChest(prev => ({
              ...prev,
              storage: { ...prev.storage, [itemType]: (prev.storage[itemType] || 0) + count }
            }));
          }}
          onTransferToPlayer={(itemType, count) => {
            if (!itemType || !activeChest || (activeChest.storage[itemType] || 0) < count) return;

            setPlayer(prev => ({
              ...prev,
              inventory: addToInventory(prev.inventory, itemType, count)
            }));
            setActiveChest(prev => ({
              ...prev,
              storage: { ...prev.storage, [itemType]: prev.storage[itemType] - count }
            }));
          }}
        />

        <FurnaceModal
          isOpen={furnaceOpen}
          furnaceStorage={activeFurnace?.storage || {}}
          playerInventory={inventoryArrayToObject(player.inventory)}
          smelting={activeFurnace?.smelting}
          onClose={handleCloseFurnace}
          onTransferToFurnace={(itemType, count) => {
            if (!itemType || !activeFurnace || (inventoryArrayToObject(player.inventory)[itemType] || 0) < count) return;

            const newInventory = [...player.inventory];
            let remaining = count;
                const fromSlot = Math.min(remaining, newInventory[i].count);
                newInventory[i].count -= fromSlot;
                remaining -= fromSlot;
                  newInventory[i] = null;
                }
              }
            }
            setActiveFurnace(prev => ({
              ...prev,
              storage: { ...prev.storage, [itemType]: (prev.storage[itemType] || 0) + count }
            }));
          }}
          onTransferToPlayer={(itemType, count) => {
            if (!itemType || !activeFurnace || (activeFurnace.storage[itemType] || 0) < count) return;

            setPlayer(prev => ({
              ...prev,
              inventory: addToInventory(prev.inventory, itemType, count)
            }));
            setActiveFurnace(prev => ({
              ...prev,
              storage: { ...prev.storage, [itemType]: prev.storage[itemType] - count }
            }));
          }}
          onStartSmelting={(ore) => {
            if (!activeFurnace || !SMELTING_RECIPES[ore]) return;
            const recipe = SMELTING_RECIPES[ore];
            
            // Check fuel and ore
            if ((activeFurnace.storage.wood || 0) < 1 || (activeFurnace.storage[ore] || 0) < 1) return;

            // Check if result slot can accept the item
            const resultItem = recipe.result;
            const resultCount = activeFurnace.storage[resultItem] || 0;
            
            // Result slot is full (max 64)
            if (resultCount >= 64) return;

            // Consume fuel and ore
            const newStorage = { ...activeFurnace.storage };
            newStorage.wood = (newStorage.wood || 0) - 1;
            newStorage[ore] = (newStorage[ore] || 0) - 1;

            setActiveFurnace(prev => ({
              ...prev,
              storage: newStorage,
              smelting: { item: ore, progress: 0, max: recipe.time }
            }));
          }}
        />

        <Crafting
          isOpen={craftingOpen}
          inventory={inventoryArrayToObject(player.inventory)}
          onCraft={handleCraft}
          onClose={() => setCraftingOpen(false)}
        />
      </div>
    </div>
  );
}
