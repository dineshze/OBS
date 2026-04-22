import { ITEM_ICONS, ITEM_LABELS } from "../game/itemData";

const SLOT_SIZE = 48;
const SLOTS_PER_ROW = 8;

function Slot({ item, count, onDragStart, onDrop, onDragOver, isEmpty = false, source }) {
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
    const totalSlots = Math.max(itemEntries.length, 16); // Minimum 16 slots

    return (
      <div className="flex-1">
        <h3 className="font-semibold mb-2 text-center">{title}</h3>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${SLOTS_PER_ROW}, 1fr)` }}>
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
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Storage Chest</h2>
          <button onClick={onClose} className="text-2xl hover:text-gray-600">×</button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="flex gap-6">
            {renderInventoryGrid(chestStorage, "Chest", (type, count) => {
              // When dropping into chest, transfer from player to chest
              onTransferToChest(type, count);
            }, 'chest')}
            {renderInventoryGrid(playerInventory, "Inventory", (type, count) => {
              // When dropping into inventory, transfer from chest to player
              onTransferToPlayer(type, count);
            }, 'inventory')}
          </div>
        </div>
      </div>
    </div>
  );
}
