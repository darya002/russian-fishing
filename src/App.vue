<template>
  <div id="app">
    <MainMenu v-if="screen === 'menu'" @change-screen="changeScreen" />
    <FishingLocations
      v-if="screen === 'locations'"
      :locations="locations"
      @change-screen="changeScreen"
      @select-location="selectLocation"
    />
    <FishingScreen 
      v-if="screen === 'fishing'"
      :currentLocation="currentLocation" 
      :rods="rods" 
      :baits="baits" 
      :inventory="inventory" 
      @update-inventory="updateInventory" 
      @catch-fish="catchFish"
    />
    
    <!-- Плашка с инвентарем после выбора локации -->
    <div v-if="currentLocation" class="inventory-bar">
      <h3>Ваш инвентарь</h3>
      <div class="inventory-items">
        <div v-for="(fish, index) in inventory.getFishes()" :key="index" class="fish-item">
          <img v-if="fish.image" :src="fish.image" alt="Fish Image" class="fish-image"/>
          <p>{{ fish.name }} x {{ fish.count }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
import FishingLocations from "./components/FishingLocations.vue";
import FishingScreen from "./components/FishingScreen.vue";
import Inventory from './models/inventory.js';
import Fish from './models/fish.js';

export default {
  name: "App",
  components: {
    MainMenu,
    FishingLocations,
    FishingScreen
  },
  data() {
    return {
      screen: "menu",
      locations: [
        { id: 1, name: "Озеро", image: "/assets/lake.jpg" },
        { id: 2, name: "Река", image: "/assets/river.jpg" },
        { id: 3, name: "Пруд", image: "/assets/pond.jpg" }
      ],
      rods: [
        { id: 1, name: "Обычная удочка", castTime: 3, catchChance: 0.3 },
        { id: 2, name: "Профессиональная удочка", castTime: 2, catchChance: 0.6 },
        { id: 3, name: "Элитная удочка", castTime: 1, catchChance: 0.9 }
      ],
      baits: [
        { id: 1, name: "Червь", catchBonus: 0.2 },
        { id: 2, name: "Кукуруза", catchBonus: 0.1 },
        { id: 3, name: "Опарыш", catchBonus: 0.3 }
      ],
      currentLocation: null,
      inventory: new Inventory() // создаем инвентарь
    };
  },
  methods: {
    changeScreen(screen) {
      this.screen = screen;
    },
    selectLocation(location) {
      this.currentLocation = location;
      this.changeScreen("fishing");
    },
    catchFish(fishName) {
      const fish = new Fish(fishName);
      this.inventory.addFish(fish); // добавляем рыбу в инвентарь
      this.updateInventory(); // обновляем инвентарь после ловли
    },
    updateInventory() {
      // Просто обновляем инвентарь
      this.$forceUpdate();  // Обновляем компонент с инвентарем
    }
  }
};
</script>

<style>
/* Глобальные стили */
body {
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: #f0f8ff;
}

button {
  padding: 10px;
  font-size: 16px;
  margin: 5px;
  cursor: pointer;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 5px;
}

button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

.location-image {
  width: 200px;
  cursor: pointer;
  display: block;
  margin: 10px auto;
  border-radius: 10px;
}

select {
  padding: 10px;
  font-size: 16px;
  margin: 10px 0;
  border-radius: 5px;
}

/* Визуализация воды */
.water {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 20px;
  background-size: cover;
  background-position: center;
}

/* Плашка с инвентарем */
.inventory-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #007BFF;
  color: white;
  padding: 15px;
  text-align: center;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.inventory-items {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.fish-item {
  background-color: #fff;
  color: #333;
  border-radius: 5px;
  padding: 10px;
  margin: 5px;
  min-width: 120px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.fish-item:hover {
  transform: scale(1.05);
}

.fish-image {
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
  border-radius: 50%;
}

/* Удочка */
.rod {
  position: absolute;
  bottom: -50px;
  left: 50%;
  width: 5px;
  height: 100px;
  background-color: #6B4F47;
  border-radius: 5px;
  transform-origin: top;
  transition: transform 0.5s ease-in-out;
}

/* Анимация заброса */
.rod.throwing {
  transform: translateX(-50%) rotate(-30deg);
}

.rod.cast {
  transform: translateX(-50%) rotate(90deg);
}

.rod.default {
  transform: translateX(-50%) rotate(0deg);
}

/* Наживка */
.bait {
  position: absolute;
  bottom: 20px;
  left: 50%;
  font-size: 24px;
  transition: all 0.8s ease-in-out;
}

/* Анимация полета наживки */
.bait.flying {
  transform: translateY(-50px);
}

/* Анимация поклевки */
.bait.biting {
  animation: bite 0.5s ease-in-out infinite;
}

@keyframes bite {
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
}
</style>
