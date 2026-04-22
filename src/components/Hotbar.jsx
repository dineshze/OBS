import { ITEM_ICONS } from "../game/itemData";

export default function Hotbar({ inventory, selected, setSelected, onMoveToInventory }) {
  const hotbar = inventory.slice(0, 5);
  return (
    <div className="flex justify-center gap-2 mt-4">
      {hotbar.map((slot, i) => (
        <div
          key={i}
          onClick={() => setSelected(i)}
          onContextMenu={(e) => {
            e.preventDefault();
            onMoveToInventory(i);
          }}
          className={`w-12 h-12 border flex items-center justify-center relative cursor-pointer
          ${selected === i ? "bg-yellow-300" : "bg-gray-100"}`}
        >
          {slot ? <img src={ITEM_ICONS[slot.type]} alt={slot.type} className="w-8 h-8" /> : null}
          {slot && slot.count > 1 && (
            <span className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
              {slot.count}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}