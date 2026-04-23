import { useState, useEffect } from "react";
import ItemIcon from "./ItemIcon";
import { ITEM_LABELS } from "../game/itemData";

export default function Hotbar({ inventory, selected, setSelected, onMoveToInventory }) {
  const [showName, setShowName] = useState(false);
  const hotbar = inventory.slice(0, 5);

  useEffect(() => {
    setShowName(true);
    const timer = setTimeout(() => setShowName(false), 1500);
    return () => clearTimeout(timer);
  }, [selected]);

  const selectedItem = hotbar[selected];
  const itemName = selectedItem ? (ITEM_LABELS[selectedItem.type] || selectedItem.type) : "Empty Slot";

  return (
    <div className="relative flex flex-col items-center mt-4">
      <div 
        className={`absolute -top-8 bg-black/70 text-white px-3 py-1 rounded text-sm font-bold transition-opacity duration-500 pointer-events-none whitespace-nowrap z-10 ${showName ? "opacity-100" : "opacity-0"}`}
      >
        {itemName}
      </div>
      <div className="flex justify-center gap-2">
        {hotbar.map((slot, i) => (
          <div
            key={i}
            onClick={() => setSelected(i)}
            onContextMenu={(e) => {
              e.preventDefault();
              onMoveToInventory(i);
            }}
            className={`w-12 h-12 border flex items-center justify-center relative cursor-pointer transition-colors
            ${selected === i ? "bg-yellow-300 border-yellow-500 shadow-[0_0_8px_rgba(253,224,71,0.6)]" : "bg-gray-100 border-gray-300 hover:bg-gray-200"}`}
          >
            {slot ? <ItemIcon type={slot.type} count={slot.count} className="w-8 h-8" /> : null}
            {slot && slot.count > 1 && (
              <span className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                {slot.count}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}