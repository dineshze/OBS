import React from 'react';
import { ITEM_ICONS, ITEM_LABELS } from "../game/itemData";

const SLOT_SIZE = 48;
const SLOTS_PER_ROW = 8;

// Mobile responsive slot configuration
const getResponsiveConfig = () => {
  if (typeof window === 'undefined') return { slotSize: SLOT_SIZE, slotsPerRow: SLOTS_PER_ROW };
  
  const width = window.innerWidth;
  if (width < 480) {
    return { slotSize: 36, slotsPerRow: 5 }; // Extra small phones
  } else if (width < 768) {
    return { slotSize: 40, slotsPerRow: 6 }; // Small phones and tablets
  } else if (width < 1024) {
    return { slotSize: 44, slotsPerRow: 7 }; // Tablets
  }
  return { slotSize: SLOT_SIZE, slotsPerRow: SLOTS_PER_ROW }; // Desktop
};

function Slot({ item, count, onDragStart, onDrop, onDragOver, isEmpty = false, source, slotSize = SLOT_SIZE }) {
  const handleDragStart = (e) => {
    if (item && count > 0) {
      e.dataTransfer.setData("text/plain", JSON.stringify({ type: item, count, source }));
      onDragStart?.(item, count);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      // Only allow drops from different sources
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
      className={`border border-gray-300 rounded flex items-center justify-center cursor-pointer relative bg-gray-50 hover:bg-gray-100 ${
        isEmpty ? 'border-dashed' : ''
      }`}
      style={{
        width: `${slotSize}px`,
        height: `${slotSize}px`,
        minWidth: `${slotSize}px`,
        minHeight: `${slotSize}px`
      }}
      draggable={!!item && count > 0}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {item && count > 0 && (
        <>
          <img src={ITEM_ICONS[item]} alt={item} style={{ width: slotSize * 0.67, height: slotSize * 0.67 }} />
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

export default function ChestModal({
  isOpen,
  onClose,
  chestStorage,
  playerInventory,
  onTransferToChest,
  onTransferToPlayer
}) {
  const [config, setConfig] = React.useState(getResponsiveConfig());

  React.useEffect(() => {
    const handleResize = () => {
      setConfig(getResponsiveConfig());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  const renderInventoryGrid = (items, title, onItemDrop, source) => {
    const itemEntries = Object.entries(items).filter(([, count]) => count > 0);
    const totalSlots = Math.max(itemEntries.length, 16); // Minimum 16 slots

    return (
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold mb-2 text-center text-sm sm:text-base">{title}</h3>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${config.slotsPerRow}, 1fr)` }}>
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
                  slotSize={config.slotSize}
                  onDrop={(droppedType, droppedCount) => onItemDrop(droppedType, droppedCount)}
                />
              );
            } else {
              return (
                <Slot
                  key={`${title}-empty-${index}`}
                  isEmpty={true}
                  source={source}
                  slotSize={config.slotSize}
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
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-2 sm:p-4 border-b">
          <h2 className="text-lg sm:text-xl font-bold">Storage Chest</h2>
          <button onClick={onClose} className="text-xl sm:text-2xl hover:text-gray-600">×</button>
        </div>

        <div className="p-2 sm:p-4 overflow-y-auto flex-1">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
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
