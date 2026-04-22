import { CRAFT_RECIPES, ITEM_ICONS, ITEM_LABELS } from "../game/itemData";

export default function Crafting({ isOpen, onClose, inventory, onCraft }) {
  if (!isOpen) return null;

  function renderRequirement(type, count) {
    return (
      <span key={type} className="inline-flex items-center gap-1 text-xs bg-gray-100 rounded px-1">
        <img src={ITEM_ICONS[type]} alt={type} className="w-4 h-4" /> {ITEM_LABELS[type] || type} x{count}
      </span>
    );
  }

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full mx-4 max-h-[50vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Crafting</h2>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>

        <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[68vh] scrollbar-hide pr-2 pb-4">
          {Object.entries(CRAFT_RECIPES).map(([id, recipe]) => {
            const canMake = Object.entries(recipe.requires).every(
              ([type, count]) => (inventory[type] || 0) >= count
            );

            return (
              <div key={id} className="p-3 border rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={ITEM_ICONS[recipe.result]} alt={recipe.result} className="w-8 h-8" />
                    <div>
                      <div className="font-semibold">{recipe.label}</div>
                      <div className="text-xs text-slate-500">{ITEM_LABELS[recipe.result] || recipe.result}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onCraft(id)}
                    disabled={!canMake}
                    className={`px-3 py-1 rounded ${canMake ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700 cursor-not-allowed"}`}
                  >
                    Craft
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(recipe.requires).map(([type, count]) => renderRequirement(type, count))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
