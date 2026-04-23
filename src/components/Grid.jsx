import { ITEM_ICONS } from "../game/itemData";

export default function Grid({ map, onCellClick, mining }) {
    const getFarmingImage = (cell) => {
        if (!cell.farming) return null;
        const stage = cell.farming.stage;
        return `/game-assets/${stage}.webp`;
    };

    const getFarmingLabel = (cell) => {
        if (!cell.farming) return null;
        const labels = {
            c1: 'Tilled',
            c2: 'Sprout',
            c3: 'Growing',
            c4: 'Mature',
            c5: 'Ready'
        };
        return labels[cell.farming.stage] || '';
    };

    return (
        <div className="w-full max-w-[90vmin] mx-auto aspect-square grid grid-cols-8 bg-[url('/bg1.webp')] bg-cover bg-center h-full">
            {map.map((row, y) =>
                row.map((cell, x) => {
                    const isMining = mining && mining.x === x && mining.y === y;
                    const farmingImage = getFarmingImage(cell);
                    const farmingLabel = getFarmingLabel(cell);
                    return (
                        <div
                            key={x + "-" + y}
                            onClick={() => onCellClick(x, y)}
                            className="bg-transparent flex items-center justify-center overflow-hidden font-bold text-3xl text-blue-50 cursor-pointer relative"
                            style={{ aspectRatio: "1 / 1" }}
                        >
                            {cell.item ? (
                                <img src={ITEM_ICONS[cell.item.type]} alt={cell.item.type} className="w-full h-full object-cover" />
                            ) : farmingImage ? (
                                <img src={farmingImage} alt={cell.farming.stage} className="w-full h-full object-cover" />
                            ) : (
                                <></>
                            )}
                            {isMining && (
                                <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center z-10">
                                    <div className="w-16 h-2 bg-gray-300 rounded">
                                        <div
                                            className="h-full bg-green-500 rounded transition-all duration-100"
                                            style={{ width: `${(mining.progress / mining.maxProgress) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}