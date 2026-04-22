export default function StatusBar({ health, hunger, onEat }) {
  return (
    <div className="mb-3 p-3 rounded-lg bg-white/80 border border-gray-200 shadow-sm text-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold">Health</div>
          <div className="h-3 bg-gray-200 rounded overflow-hidden mt-1">
            <div className="h-full bg-red-500" style={{ width: `${health}%` }} />
          </div>
        </div>
        <div>
          <div className="font-semibold">Hunger</div>
          <div className="h-3 bg-gray-200 rounded overflow-hidden mt-1">
            <div className="h-full bg-yellow-500" style={{ width: `${hunger}%` }} />
          </div>
        </div>
        <button
          onClick={onEat}
          className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600"
        >
          Eat
        </button>
      </div>
    </div>
  );
}
