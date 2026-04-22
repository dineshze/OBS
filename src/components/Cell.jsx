export default function Cell({ cell, isPlayer }) {
  return (
    <span className="text-[4vmin] sm:text-xl">
  {isPlayer && "🧍"}
  {cell.item?.type === "mine" && "⛏"}
  {cell.item?.type === "chest" && "📦"}
</span>
  );
}