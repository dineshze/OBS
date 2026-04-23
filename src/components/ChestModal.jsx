import React, { useRef } from 'react';
import { ITEM_ICONS, ITEM_LABELS } from "../game/itemData";
import ItemIcon from "./ItemIcon";

function Slot({ item, count, onDragStart, onDrop, onDragOver, isEmpty = false, source, onClick }) {
  const timerRef = useRef(null);

  const handleDragStart = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (item && count > 0) {
      e.dataTransfer.setData("text/plain", JSON.stringify({ type: item, count, source }));
      onDragStart?.(item, count);
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
      className={`w-11 h-11 sm:w-12 sm:h-12 border border-gray-300 rounded flex items-center justify-center cursor-pointer relative bg-gray-50 hover:bg-gray-100 shrink-0 transition-colors ${
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
          <ItemIcon type={item} count={count} className="w-7 h-7 sm:w-8 sm:h-8" style={{ transition: 'transform 0.1s', cursor: 'pointer' }} />
          {count > 1 && (
            <span className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white text-[10px] sm:text-xs px-1 rounded">
              {count}
            </span>
          )}
        </>
      )}
    </div>
  );
}

export default function ChestModal({
  isOpen,
  onClose,
  chestStorage,
  playerInventory,
  onTransferToChest,
  onTransferToPlayer
}) {
  if (!isOpen) return null;

  const renderInventoryGrid = (items, title, onItemDrop, source) => {
    const itemEntries = Object.entries(items).filter(([, count]) => count > 0);
    const totalSlots = Math.max(itemEntries.length, 25); // Minimum 16 slots

    return (
      <div className="flex-1 min-w-0 bg-gray-100 p-3 sm:p-4 rounded-lg">
        <h3 className="font-bold mb-3 text-center text-sm sm:text-base text-gray-700">{title}</h3>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {Array.from({ length: totalSlots }, (_, index) => {
            const itemEntry = itemEntries[index];
            if (itemEntry) {
              const [type, count] = itemEntry;
              return (
                <Slot
                  key={`${title}-${type}`}
                  item={type}
                  count={count}
                  source={source}
                  onDrop={(droppedType, droppedCount) => onItemDrop(droppedType, droppedCount)}
                  onClick={(clickedType, clickedCount, isShift) => onItemDrop(clickedType, isShift ? clickedCount : 1)}
                />
              );
            } else {
              return (
                <Slot
                  key={`${title}-empty-${index}`}
                  isEmpty={true}
                  source={source}
                  onDrop={(droppedType, droppedCount) => onItemDrop(droppedType, droppedCount)}
                />
              );
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-3 sm:p-4 border-b bg-gray-50 shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Storage Chest</h2>
          <button onClick={onClose} className="text-2xl hover:text-red-500 transition-colors leading-none">&times;</button>
        </div>

        <div className="p-3 sm:p-5 overflow-y-auto flex-1">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {renderInventoryGrid(chestStorage, "Chest", (type, count) => {
              onTransferToChest(type, count);
            }, 'chest')}
            {renderInventoryGrid(playerInventory, "Inventory", (type, count) => {
              onTransferToPlayer(type, count);
            }, 'inventory')}
          </div>
        </div>
      </div>
    </div>
  );
}
