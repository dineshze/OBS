import { ITEM_ICONS, ITEM_LABELS, SMELTING_RECIPES } from "../game/itemData";

const SLOT_SIZE = 64;

function FurnaceSlot({ item, count, onDragStart, onDrop, onDragOver, isEmpty = false, source, label, onClick }) {
  const handleDragStart = (e) => {
    if (item && count > 0) {
      e.dataTransfer.setData("text/plain", JSON.stringify({ type: item, count: 1, source }));
      onDragStart?.(item, 1);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (data.source !== source) {
        onDrop?.(data.type, data.count);
      }
    } catch {
      // Invalid drop data
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    onDragOver?.();
  };

  const handleClick = () => {
    if (item && count > 0) {
      onClick?.(item, 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-semibold">{label}</p>
      <div
        className={`w-16 h-16 border-2 rounded flex items-center justify-center cursor-pointer relative bg-gray-100 hover:bg-gray-200 ${
          isEmpty ? 'border-dashed border-gray-400' : 'border-gray-400'
        }`}
        draggable={!!item && count > 0}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        {item && count > 0 && (
          <>
            <img src={ITEM_ICONS[item]} alt={item} className="w-12 h-12" />
            {count > 1 && (
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1.5 rounded">
                {count}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function InventorySlot({ item, count, onDragStart, onDrop, onDragOver, isEmpty = false, source }) {
  const handleDragStart = (e) => {
    if (item && count > 0) {
      e.dataTransfer.setData("text/plain", JSON.stringify({ type: item, count: 1, source }));
      onDragStart?.(item, 1);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (data.source !== source) {
        onDrop?.(data.type, data.count);
      }
    } catch {
      // Invalid drop data
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    onDragOver?.();
  };

  return (
    <div
      className={`w-12 h-12 border border-gray-300 rounded flex items-center justify-center cursor-pointer relative bg-gray-50 hover:bg-gray-100 ${
        isEmpty ? 'border-dashed' : ''
      }`}
      draggable={!!item && count > 0}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {item && count > 0 && (
        <>
          <img src={ITEM_ICONS[item]} alt={item} className="w-8 h-8" />
          {count > 1 && (
            <span className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
              {count}
            </span>
          )}
        </>
      )}
    </div>
  );
}

export default function FurnaceModal({
  isOpen,
  onClose,
  furnaceStorage,
  playerInventory,
  smelting,
  onTransferToFurnace,
  onTransferToPlayer,
  onStartSmelting
}) {
  if (!isOpen) return null;

  // Find current ore in furnace
  const currentOre = Object.keys(SMELTING_RECIPES).find(
    ore => ore !== 'wood' && (furnaceStorage[ore] || 0) > 0
  );
  
  // Find any result item in furnace storage (works even if ore was removed)
  const allPossibleResults = ['charcoal', 'iron', 'stihl', 'sulfur'];
  const currentResultItem = allPossibleResults.find(result => (furnaceStorage[result] || 0) > 0) || null;
  const resultCount = currentResultItem ? (furnaceStorage[currentResultItem] || 0) : 0;

  // Get smeltable items from player inventory
  const smeltableItems = Object.keys(SMELTING_RECIPES).filter(
    item => item !== 'wood' && (playerInventory[item] || 0) > 0
  );

  // Filter player inventory to only show smeltable items and fuel
  const filteredInventory = Object.keys(playerInventory).reduce((acc, key) => {
    if (key === 'wood' || smeltableItems.includes(key)) {
      acc[key] = playerInventory[key];
    }
    return acc;
  }, {});

  const fuelCount = furnaceStorage.wood || 0;
  const oreCount = currentOre ? (furnaceStorage[currentOre] || 0) : 0;

  // Check if smelting is possible
  const canSmelt = fuelCount > 0 && oreCount > 0 && resultCount < 64;

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Furnace</h2>
          <button onClick={onClose} className="text-2xl hover:text-gray-600">×</button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Minecraft-style 3-slot furnace */}
          <div className="mb-8 p-6 bg-gray-100 rounded-lg border-2 border-gray-400">
            <h3 className="text-lg font-bold mb-4">Furnace Slots</h3>
            <div className="flex justify-around items-end mb-4">
              {/* Fuel Slot */}
              <FurnaceSlot
                item={furnaceStorage.wood ? 'wood' : null}
                count={furnaceStorage.wood || 0}
                source="furnace"
                label="Fuel (Wood)"
                onDrop={(type, count) => {
                  if (type === 'wood') onTransferToFurnace(type, 1);
                }}
              />
              
              {/* Ore Input Slot */}
              <FurnaceSlot
                item={currentOre || null}
                count={oreCount}
                source="furnace"
                label="Ore Input"
                onDrop={(type, count) => {
                  if (Object.keys(SMELTING_RECIPES).includes(type) && type !== 'wood') {
                    onTransferToFurnace(type, 1);
                  }
                }}
              />
              
              {/* Result Output Slot */}
              <FurnaceSlot
                item={currentResultItem || null}
                count={resultCount}
                source="furnace"
                label="Result Output"
                onDrop={(type, count) => onTransferToPlayer(type, 1)}
                onClick={(type, count) => onTransferToPlayer(type, 1)}
              />
            </div>

            {/* Smelting progress and controls */}
            {smelting ? (
              <div className="mt-4">
                <p className="text-center mb-2">Smelting {ITEM_LABELS[smelting.item]}...</p>
                <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-orange-500 h-4 rounded-full transition-all duration-100"
                    style={{ width: `${(smelting.progress / smelting.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-center">
                {canSmelt ? (
                  <button
                    onClick={() => {
                      if (currentOre) onStartSmelting(currentOre);
                    }}
                    className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
                  >
                    Start Smelting
                  </button>
                ) : (
                  <p className="text-gray-500 text-sm">
                    {fuelCount === 0 ? '❌ Need fuel (wood)' : ''}
                    {oreCount === 0 ? '❌ Need ore to smelt' : ''}
                    {resultCount >= 64 ? '❌ Result slot full (take out items)' : ''}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Player inventory - only smeltable items */}
          <div>
            <h3 className="font-semibold mb-2">Inventory (Smeltable Items Only)</h3>
            <div className="grid gap-1 grid-cols-5 p-3 bg-gray-50 rounded border border-gray-300">
              {Object.entries(filteredInventory)
                .filter(([_, count]) => count > 0)
                .map(([type, count]) => (
                  <InventorySlot
                    key={type}
                    item={type}
                    count={count}
                    source="inventory"
                    onDrop={(droppedType, droppedCount) => onTransferToFurnace(droppedType, 1)}
                  />
                ))}
              {Object.entries(filteredInventory)
                .filter(([_, count]) => count === 0)
                .slice(0, 8)
                .map(([type, idx]) => (
                  <InventorySlot
                    key={`empty-${type}`}
                    isEmpty={true}
                    source="inventory"
                    onDrop={(droppedType, droppedCount) => onTransferToFurnace(droppedType, 1)}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}