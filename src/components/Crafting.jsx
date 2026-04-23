import { useState, useEffect } from "react";
import { CRAFT_RECIPES, ITEM_ICONS, ITEM_LABELS } from "../game/itemData";

export default function Crafting({ isOpen, onClose, inventory, onCraft }) {
  const [floaters, setFloaters] = useState([]);
  const [sortedKeys, setSortedKeys] = useState(() => Object.keys(CRAFT_RECIPES));

  const inventoryStr = JSON.stringify(inventory);

  useEffect(() => {
    if (!isOpen) return;
    setSortedKeys(prevKeys => {
      const craftable = [];
      const uncraftable = [];
      
      prevKeys.forEach(id => {
        const recipe = CRAFT_RECIPES[id];
        const canMake = Object.entries(recipe.requires).every(
          ([type, count]) => (inventory[type] || 0) >= count
        );
        if (canMake) craftable.push(id);
        else uncraftable.push(id);
      });
      
      const newKeys = [...craftable, ...uncraftable];
      if (newKeys.join(',') !== prevKeys.join(',')) {
        return newKeys;
      }
      return prevKeys;
    });
  }, [inventoryStr, isOpen]);

  if (!isOpen) return null;

  const handleCraftClick = (id) => {
    onCraft(id);
    const floaterId = Date.now() + Math.random();
    setFloaters((prev) => [...prev, { id: floaterId, recipeId: id }]);
    setTimeout(() => {
      setFloaters((prev) => prev.filter((f) => f.id !== floaterId));
    }, 800);
  };

  function renderRequirement(type, count) {
    return (
      <span key={type} className="inline-flex items-center gap-1 text-xs bg-gray-100 rounded px-1">
        <img src={ITEM_ICONS[type]} alt={type} className="w-4 h-4 pointer-events-none select-none" draggable="false" /> {ITEM_LABELS[type] || type} x{count}
      </span>
    );
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full mx-4 max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="font-bold text-xl">Crafting</h2>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>

        <div className="grid grid-cols-1 gap-3 overflow-y-auto flex-1 scrollbar-hide pr-2 pb-4">
          {sortedKeys.map((id) => {
            const recipe = CRAFT_RECIPES[id];
            const canMake = Object.entries(recipe.requires).every(
              ([type, count]) => (inventory[type] || 0) >= count
            );

            return (
              <div key={id} className={`p-3 border-2 rounded-lg flex flex-col gap-2 transition-colors ${canMake ? "border-green-400 bg-green-50/20" : "border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={ITEM_ICONS[recipe.result]} alt={recipe.result} className="w-8 h-8 pointer-events-none select-none" draggable="false" />
                    <div>
                      <div className="font-semibold">{recipe.label}</div>
                      <div className="text-xs text-slate-500">{ITEM_LABELS[recipe.result] || recipe.result}</div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => handleCraftClick(id)}
                      disabled={!canMake}
                      className={`px-3 py-1 rounded transition-all ${canMake ? "bg-green-500 text-white hover:bg-green-600 active:scale-95 shadow-md shadow-green-500/30" : "bg-gray-300 text-gray-700 cursor-not-allowed"}`}
                    >
                      Craft
                    </button>
                    {floaters.filter(f => f.recipeId === id).map(f => (
                      <div key={f.id} className="absolute -top-6 right-3 text-green-600 font-bold text-sm animate-float-up pointer-events-none drop-shadow whitespace-nowrap">
                        +{recipe.yield || 1}
                      </div>
                    ))}
                  </div>
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
