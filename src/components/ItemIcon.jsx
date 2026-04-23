import { useEffect, useState } from "react";
import { ITEM_ICONS } from "../game/itemData";

export default function ItemIcon({ type, count, className = "w-8 h-8", style = {} }) {
  const [animate, setAnimate] = useState(false);
  const [prevCount, setPrevCount] = useState(count);

  useEffect(() => {
    if (count !== prevCount) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 200);
      setPrevCount(count);
      return () => clearTimeout(timer);
    }
  }, [count, prevCount]);

  return (
    <img
      src={ITEM_ICONS[type]}
      alt={type}
      draggable="false"
      className={`${className} pointer-events-none select-none ${animate ? "animate-pickup" : "transition-transform duration-200"}`}
      style={{ ...style, ...(animate ? { animation: "pickup 0.2s ease-in-out" } : {}) }}
    />
  );
}
