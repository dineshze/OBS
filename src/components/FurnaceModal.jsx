import { useState, useEffect, useRef } from "react";
import { FaFire } from "react-icons/fa";
import { ITEM_ICONS, ITEM_LABELS, SMELTING_RECIPES } from "../game/itemData";
import ItemIcon from "./ItemIcon";

const SLOT_SIZE = 64;

function FurnaceSlot({ item, count, onDragStart, onDrop, onDragOver, isEmpty = false, source, label, onClick, overlay, ghostType, borderProgress, flashGreen }) {
  const timerRef = useRef(null);

  const handleDragStart = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
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
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    onDragOver?.();
  };

  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.button !== undefined) return;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      if (item && count > 0) {
        onClick?.(item, count, true);
        if (window.navigator?.vibrate) window.navigator.vibrate(50);
      }
    }, 1500); // 1.5s is standard for mobile hold
  };

  const handlePointerUp = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      if (item && count > 0) {
        onClick?.(item, count, e.shiftKey);
      }
    }
  };

  const handlePointerLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-bold text-gray-700">{label}</p>
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-lg flex items-center justify-center cursor-pointer relative transition-all ${
          isEmpty ? 'border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100' : 'border-gray-400 bg-gray-100 hover:bg-gray-200 shadow-inner'
        }`}
        draggable={!!item && count > 0}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onContextMenu={(e) => e.preventDefault()}
      >
        {item && count > 0 && (
          <>
            <ItemIcon type={item} count={count} className="w-10 h-10 sm:w-12 sm:h-12" style={{ transition: 'transform 0.1s', cursor: 'pointer' }} />
            {count > 1 && (
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1.5 rounded">
                {count}
              </span>
            )}
          </>
        )}
        {!item && ghostType && (
          <img src={ITEM_ICONS[ghostType]} alt={ghostType} className="w-10 h-10 sm:w-12 sm:h-12 opacity-20 grayscale pointer-events-none select-none" draggable="false" />
        )}
        {overlay}
        
        {/* Dynamic Rising Border */}
        {borderProgress > 0 && borderProgress < 100 && (
          <div 
            className="absolute bottom-0 w-full bg-orange-500/20 border-x-4 border-b-4 border-orange-500 rounded-lg transition-all duration-100 pointer-events-none"
            style={{ height: `${borderProgress}%` }}
          />
        )}
        {flashGreen && (
          <div className="absolute inset-0 border-4 border-green-500 rounded-lg animate-pulse pointer-events-none shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
        )}
      </div>
    </div>
  );
}

function InventorySlot({ item, count, onDragStart, onDrop, onDragOver, isEmpty = false, source, onClick }) {
  const timerRef = useRef(null);

  const handleDragStart = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
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
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    onDragOver?.();
  };

  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.button !== undefined) return;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      if (item && count > 0) {
        onClick?.(item, count, true);
        if (window.navigator?.vibrate) window.navigator.vibrate(50);
      }
    }, 1500);
  };

  const handlePointerUp = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      if (item && count > 0) {
        onClick?.(item, count, e.shiftKey);
      }
    }
  };

  const handlePointerLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div
      className={`w-12 h-12 border border-gray-300 rounded flex items-center justify-center cursor-pointer relative bg-gray-50 hover:bg-gray-100 transition-colors ${
        isEmpty ? 'border-dashed' : ''
      }`}
      draggable={!!item && count > 0}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onContextMenu={(e) => e.preventDefault()}
    >
      {item && count > 0 && (
        <>
          <ItemIcon type={item} count={count} className="w-8 h-8" style={{ transition: 'transform 0.1s', cursor: 'pointer' }} />
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
  const [flashGreen, setFlashGreen] = useState(false);
  const prevSmelting = useRef(smelting);

  useEffect(() => {
    if (smelting) {
      setFlashGreen(false);
    } else if (prevSmelting.current && !smelting && prevSmelting.current.progress > 0) {
      setFlashGreen(true);
      const timer = setTimeout(() => setFlashGreen(false), 800);
      return () => clearTimeout(timer);
    }
    prevSmelting.current = smelting;
  }, [smelting]);



  const currentOre = Object.keys(SMELTING_RECIPES).find(
    ore => ore !== 'wood' && (furnaceStorage[ore] || 0) > 0
  );
  
  const allPossibleResults = ['charcoal', 'iron', 'stihl', 'sulfur'];
  const currentResultItem = allPossibleResults.find(result => (furnaceStorage[result] || 0) > 0) || null;
  const resultCount = currentResultItem ? (furnaceStorage[currentResultItem] || 0) : 0;

  const smeltableItems = Object.keys(SMELTING_RECIPES).filter(
    item => item !== 'wood' && (playerInventory[item] || 0) > 0
  );

  const filteredInventory = Object.keys(playerInventory).reduce((acc, key) => {
    if (key === 'wood' || smeltableItems.includes(key)) {
      acc[key] = playerInventory[key];
    }
    return acc;
  }, {});

  const fuelCount = furnaceStorage.wood || 0;
  const oreCount = currentOre ? (furnaceStorage[currentOre] || 0) : 0;

  const canSmelt = fuelCount > 0 && oreCount > 0 && resultCount < 64;
  const maxPossible = Math.min(oreCount, fuelCount, 64 - resultCount);
  const borderProgress = smelting ? (smelting.progress / smelting.max) * 100 : 0;

  const [smeltAmount, setSmeltAmount] = useState(1);

  // Reset or cap smelt amount when maxPossible changes
  useEffect(() => {
    if (smeltAmount > maxPossible) {
      setSmeltAmount(Math.max(1, maxPossible));
    }
  }, [maxPossible, smeltAmount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Furnace</h2>
          <button onClick={onClose} className="text-2xl hover:text-gray-600">×</button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="mb-8 p-6 bg-gray-100 rounded-lg border-2 border-gray-400">
            <h3 className="text-lg font-bold mb-4">Furnace Slots</h3>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 relative px-2 sm:px-8">
              
              <div className="flex gap-4 sm:gap-8">
                <FurnaceSlot
                  item={furnaceStorage.wood ? 'wood' : null}
                  count={furnaceStorage.wood || 0}
                  source="furnace"
                  label="Fuel"
                  isEmpty={!furnaceStorage.wood}
                  ghostType="wood"
                  onDrop={(type, count) => {
                    if (type === 'wood') onTransferToFurnace(type, 1);
                  }}
                  onClick={(type, currentCount, isShift) => onTransferToPlayer(type, isShift ? currentCount : 1)}
                  overlay={smelting ? <FaFire className="absolute text-orange-500 animate-pulse text-2xl sm:text-3xl opacity-80" /> : null}
                />
                
                <FurnaceSlot
                  item={currentOre || null}
                  count={oreCount}
                  source="furnace"
                  label="Ore"
                  isEmpty={!currentOre}
                  ghostType="iron_ore"
                  onDrop={(type, count) => {
                    if (Object.keys(SMELTING_RECIPES).includes(type) && type !== 'wood') {
                      onTransferToFurnace(type, 1);
                    }
                  }}
                  onClick={(type, currentCount, isShift) => onTransferToPlayer(type, isShift ? currentCount : 1)}
                />
              </div>

              <div className="text-3xl sm:text-5xl text-gray-400 font-bold transform rotate-90 sm:rotate-0 my-4 sm:my-0">➔</div>

              <FurnaceSlot
                item={currentResultItem || null}
                count={resultCount}
                source="furnace"
                label="Result"
                isEmpty={!currentResultItem}
                onDrop={(type, count) => onTransferToPlayer(type, 1)}
                onClick={(type, currentCount, isShift) => onTransferToPlayer(type, isShift ? currentCount : 1)}
                borderProgress={borderProgress}
                flashGreen={flashGreen}
              />
            </div>

            {smelting ? (
              <div className="mt-4">
                <p className="text-center mb-2 font-semibold animate-pulse text-orange-600">
                  Smelting {ITEM_LABELS[smelting.item]}... {smelting.queued > 1 ? `(${smelting.queued} queued)` : ''}
                </p>
                <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden border border-gray-400">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-100"
                    style={{ width: `${borderProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center">
                {canSmelt ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3 bg-gray-200 px-3 py-1.5 rounded-lg border border-gray-300 shadow-inner">
                      <button 
                        onClick={() => setSmeltAmount(Math.max(1, smeltAmount - 1))} 
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow text-xl font-bold hover:bg-gray-100 active:scale-95 transition-transform"
                      >
                        -
                      </button>
                      <span className="text-lg font-bold w-8 text-center text-gray-800">{smeltAmount}</span>
                      <button 
                        onClick={() => setSmeltAmount(Math.min(maxPossible, smeltAmount + 1))} 
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow text-xl font-bold hover:bg-gray-100 active:scale-95 transition-transform"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => setSmeltAmount(maxPossible)} 
                        className="ml-2 px-2 py-1 text-xs font-bold text-gray-700 bg-gray-300 rounded hover:bg-gray-400 active:scale-95 transition-transform shadow-sm"
                      >
                        MAX
                      </button>
                    </div>
                    <button
                      onClick={() => currentOre && onStartSmelting(currentOre, smeltAmount)}
                      className="px-8 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 active:scale-95 transition-transform font-bold shadow-md shadow-green-500/40"
                    >
                      Start Smelting
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm font-medium">
                    {fuelCount === 0 ? '❌ Need fuel (wood)  ' : ''}
                    {oreCount === 0 ? '❌ Need ore to smelt  ' : ''}
                    {resultCount >= 64 ? '❌ Result slot full (take out items)  ' : ''}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Inventory <span className="text-xs text-gray-500 font-normal">(Shift-click to transfer all)</span></h3>
            <div className="grid gap-1.5 grid-cols-5 p-3 bg-gray-50 rounded-lg border border-gray-300 justify-items-center">
              {Object.entries(filteredInventory)
                .filter(([_, count]) => count > 0)
                .map(([type, count]) => (
                  <InventorySlot
                    key={type}
                    item={type}
                    count={count}
                    source="inventory"
                    onClick={(type, currentCount, isShift) => onTransferToFurnace(type, isShift ? currentCount : 1)}
                    onDrop={(droppedType, droppedCount) => onTransferToPlayer(droppedType, 1)}
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
                    onDrop={(droppedType, droppedCount) => onTransferToPlayer(droppedType, 1)}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}