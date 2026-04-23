import { ITEM_ICONS } from "../game/itemData";
import ItemIcon from "./ItemIcon";

export default function Inventory({ inventory, selectedSlot, setSelectedSlot, onUpdateInventory, isOpen, onClose }) {
  if (!isOpen) return null;

  const handleDragStart = (index) => (event) => {
    event.dataTransfer.setData("text/plain", index);
  };

  const handleDrop = (index) => (event) => {
    event.preventDefault();
    const draggedIndex = parseInt(event.dataTransfer.getData("text/plain"));
    if (draggedIndex !== index) {
      const newInventory = [...inventory];
      [newInventory[draggedIndex], newInventory[index]] = [newInventory[index], newInventory[draggedIndex]];
      onUpdateInventory(newInventory);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Inventory</h2>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 25 }, (_, index) => {
            const slot = inventory[index];
            return (
              <div
                key={index}
                draggable
                onDragStart={handleDragStart(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop(index)}
                onClick={() => index < 5 && setSelectedSlot(index)}
                className={`w-14 h-14 border rounded-lg flex items-center justify-center cursor-pointer relative
                  ${index < 5 ? (selectedSlot === index ? "bg-yellow-300 border-yellow-500" : "bg-gray-100 border-gray-300") : "bg-gray-50 border-gray-300"}`}
              >
                {slot ? <ItemIcon type={slot.type} count={slot.count} className="w-8 h-8" /> : null}
                {slot && slot.count > 1 && (
                  <span className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                    {slot.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
