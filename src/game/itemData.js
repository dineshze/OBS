export const ITEM_ICONS = {
  chest: "/game-assets/chest.webp",
  tree: "/game-assets/tree.webp",
  mine: "/game-assets/mine.webp",
  hoi: "/game-assets/hoi.webp",
  stick: "/game-assets/stick.webp",
  grass: "/game-assets/grass.webp",
  stone: "/game-assets/srone.webp",
  wood: "/game-assets/wood.webp",
  charcoal: "/game-assets/charcoal.webp",
  apple: "/game-assets/apple.webp",
  seed: "/game-assets/seed.webp",
  wheat: "/game-assets/wheat.webp",
  iron: "/game-assets/iron.webp",
  sulfur: "/game-assets/sulfur.webp",
  gun_power: "/game-assets/gp.webp",
  stone_axe: "/game-assets/stone-axe.webp",
  furnace: "/game-assets/furnace.webp",
  tnt: "/game-assets/tnt.webp",
  boom: "/game-assets/boom.webp",
  iron_axe: "/game-assets/iron-axe.jpg",
  stihl_axe: "/game-assets/stihl-axe.webp",
  stihl: "/game-assets/stihle.webp",
  explosive: "/game-assets/exposive.webp",
  iron_ore: "/game-assets/iron-ore.webp",
  stihl_ore: "/game-assets/stihle-ore.webp",
  sulfur_ore: "/game-assets/sulfur-ore.webp"
};

export const ITEM_LABELS = {
  chest: "Chest",
  mine: "Mine Block",
  stick: "Stick",
  grass: "Grass",
  stone: "Stone",
  wood: "Wood",
  charcoal: "Charcoal",
  apple: "Apple",
  seed: "Seed",
  wheat: "Wheat",
  iron: "Iron",
  sulfur: "Sulfur",
  gun_power: "Gun Power",
  stone_axe: "Stone Axe",
  furnace: "Furnace",
  tnt: "TNT",
  boom: "Boom",
  iron_axe: "Iron Axe",
  stihl_axe: "Stihl Axe",
  stihl: "Stihl",
  explosive: "Explosive",
  iron_ore: "Iron Ore",
  stihl_ore: "Stihl Ore",
  sulfur_ore: "Sulfur Ore",
  hoi: "Hoi"
};

export const PLACEABLE_ITEMS = ["chest", "furnace", "seed","tnt","boom"];

export const DEFAULT_INVENTORY = {
  wood: 0,
  charcoal: 0,
  stick: 0,
  grass: 0,
  stone: 0,
  apple: 0,
  seed: 0,
  wheat: 0,
  iron: 0,
  sulfur: 0,
  gun_power: 0,
  stone_axe: 0,
  furnace: 0,
  chest: 0,
  tnt: 0,
  boom: 0,
  iron_axe: 0,
  stihl_axe: 0,
  stihl: 0,
  explosive: 0,
  iron_ore: 0,
  stihl_ore: 0,
  sulfur_ore: 0,
  hoi: 0
};

export const CRAFT_RECIPES = {
  stone_axe: {
    result: "stone_axe",
    requires: { stone: 3, stick: 2 },
    label: "Stone Axe"
  },
  hoi: {
    result: "hoi",
    requires: { stone: 2, stick: 2 },
    label: "Hoi"
  },
  furnace: {
    result: "furnace",
    requires: { stone: 9 },
    label: "Furnace"
  },
  chest: {
    result: "chest",
    requires: { wood: 10, iron: 2 },
    label: "Chest"
  },
  tnt: {
    result: "tnt",
    requires: { gun_power: 1, iron: 2 },
    label: "TNT"
  },
  boom: {
    result: "boom",
    requires: { explosive: 1, stihl: 2 },
    label: "Boom"
  },
  wood: {
    result: "wood",
    requires: { stick: 4 },
    label: "Wood"
  },
  stick: {
    result: "stick",
    requires: { wood: 1 },
    label: "Stick"
  },
  iron_axe: {
    result: "iron_axe",
    requires: { iron: 3, stick: 2 },
    label: "Iron Axe"
  },
  stihl_axe: {
    result: "stihl_axe",
    requires: { stihl: 3, stick: 2 },
    label: "Stihl Axe"
  },
  gun_power: {
    result: "gun_power",
    requires: { sulfur_ore: 1, charcoal: 1},
    label: "Gun Power"
  }
};

export const SMELTING_RECIPES = {
  wood: {
    result: "charcoal",
    fuel: "wood",
    time: 10000,
    label: "Charcoal"
  },
  iron_ore: {
    result: "iron",
    fuel: "wood",
    time: 10000,
    label: "Iron"
  },
  stihl_ore: {
    result: "stihl",
    fuel: "wood",
    time: 10000,
    label: "Stihl"
  },
  sulfur_ore: {
    result: "sulfur",
    fuel: "wood",
    time: 10000,
    label: "Sulfur"
  }
};

export const CRAFT_ITEMS = Object.entries(CRAFT_RECIPES).map(([key, value]) => ({
  id: key,
  ...value
}));
