# OBSurvival

[![Play Demo](https://img.shields.io/badge/Play-Demo-success?style=for-the-badge&logo=vercel)](https://obs-eight-lemon.vercel.app/)

OBSurvival is a 2D web-based survival and crafting game built with React and Vite. It features interactive resource gathering, farming, crafting, and building mechanics, all managed within a dynamic grid-based environment.

## Features

### 🎒 Inventory & UI System
* **Inventory Management**: Features a 24-slot inventory system along with a quick-access Hotbar for seamless item management.
* **Status Tracking**: Actively monitors and displays player Health and Hunger levels.

### 🪓 Resource Gathering & Tools
* **Dynamic Harvesting**: Players can gather resources from specific tiles (trees, mines, grass) across the map.
* **Tool Progression**: Using upgraded tools significantly speeds up harvesting times (from 5 seconds to 3 seconds) and yields higher-tier rewards:
  * *Stone Axe*: Increases yield (e.g., wood, apples, stone, iron ore).
  * *Iron Axe*: Provides maximum yield, including rare materials like stihl ore.

### 🌾 Farming
* **Agriculture**: Equip a hoe to till grass tiles into arable soil.
* **Crop Lifecycle**: Plant seeds that automatically grow over time, eventually becoming harvestable for food and resources.

### 🛠️ Crafting & Smelting
* **Crafting System**: Utilize a dedicated crafting interface to combine raw materials into valuable tools, blocks, and items.
* **Furnaces**: Place and interact with furnaces to smelt raw ores using fuel (e.g., wood), complete with progress tracking and storage limits.

### 🏗️ Building & Storage
* **World Building**: Place crafted blocks and items directly onto the map grid to shape your environment.
* **Storage Systems**: Craft and place Chests to securely store excess inventory.

### 🌍 World Events
* **Entity Spawning**: Features an automatic background system that dynamically spawns entities across the map over time.

## Tech Stack

* **Framework**: [React 19](https://react.dev/)
* **Build Tool**: [Vite](https://vitejs.dev/) (`@vitejs/plugin-react`)
* **Styling**: [TailwindCSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
* **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
* **Linting**: ESLint

## Getting Started

1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Build for production: `npm run build`
