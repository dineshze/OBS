export const MAX_HEALTH = 100;
export const MAX_HUNGER = 100;
export const HUNGER_DRAIN_MS = 10000;
export const HUNGER_DRAIN_AMOUNT = 1;
export const STARVATION_DAMAGE = 2;

export function drainHunger(player) {
  const nextHunger = Math.max(0, player.hunger - HUNGER_DRAIN_AMOUNT);
  const nextHealth = nextHunger === 0 ? Math.max(0, player.health - STARVATION_DAMAGE) : player.health;
  return {
    ...player,
    hunger: nextHunger,
    health: nextHealth
  };
}

export function eatFood(player, foodType) {
  const foodValues = {
    apple: 15
  };
  const hungerGain = foodValues[foodType] || 0;
  if (hungerGain === 0) return player;

  return {
    ...player,
    hunger: Math.min(MAX_HUNGER, player.hunger + hungerGain),
    inventory: {
      ...player.inventory,
      [foodType]: Math.max(0, (player.inventory[foodType] || 0) - 1)
    }
  };
}
