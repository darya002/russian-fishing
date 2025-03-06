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
      :rods="ownedRods" 
      :baits="ownedBaits" 
      :inventory="inventory" 
      @update-inventory="updateInventory" 
      @change-screen="changeScreen"
    />
 
    <ShopScreen
  v-if="screen === 'shop'"
  :balance="balance"
  :inventory="inventory"
  :shopBaits="shopBaits"
  :shopRods="shopRods" 
  @sell-fish-one="sellFishOne"
  @sell-fish-all="sellFishAll"
  @buy-bait="buyBait"
  @buy-rod="buyRod" 
  @change-screen="changeScreen"
/>


     <div v-if="screen !== 'menu' && screen !== 'shop'" class="inventory-container">
      <button @click="toggleInventory" class="inventory-button">Инвентарь</button>
      <button @click="changeScreen('shop')" class="shop-button">Магазин</button>
      <p class="balance">Баланс: {{ balance }} монет</p>
    </div>

       <div v-if="showInventory" class="inventory-modal">
    <div class="modal-content">
      <h3>Ваш инвентарь</h3>
      <div class="inventory-items">
        <div class="inventory-section">
          <h4>Пойманная рыба</h4>
          <div
            v-for="(fish, index) in inventory.getFishes()"
            :key="'fish-'+index"
            class="fish-item"
          >
            <img
              v-if="fish.image"
              :src="fish.image"
              alt="Fish Image"
              class="fish-image"
            />
            <p>{{ fish.name }} x {{ fish.count }}</p>
          </div>
        </div>

        <div class="inventory-section">
          <h4>Наживки</h4>
          <div
            v-for="(bait, index) in ownedBaits"
            :key="'bait-'+index"
            class="fish-item"
          >
            <p>{{ bait.name }} x {{ bait.count }}</p>
          </div>
        </div>
      </div>
      <button @click="toggleInventory">Закрыть</button>
    </div>
  </div>

  </div>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
import FishingLocations from "./components/FishingLocations.vue";
import FishingScreen from "./components/FishingScreen.vue";
import ShopScreen from "./components/ShopScreen.vue";
import Inventory from "./models/inventory.js";

export default {
  name: "App",
  components: {
    MainMenu,
    FishingLocations,
    FishingScreen,
    ShopScreen
  },
  data() {
    return {
      screen: "menu",
      locations: [
        { id: 1, name: "Озеро", image: "/assets/lake.jpg" },
        { id: 2, name: "Река", image: "/assets/river.jpg" },
        { id: 3, name: "Пруд", image: "/assets/pond.jpg" }
      ], 
      ownedRods: [
        { id: 1, name: "Палка и леска", castTime: 4, catchChance: 0.5 }
      ], 
      shopRods: [
        { id: 2, name: "Удочка", castTime: 3, catchChance: 0.7, price: 200 },
        { id: 3, name: "Профессиональная удочка", castTime: 2, catchChance: 0.9, price: 500 }
      ],
      ownedBaits: [
      ],
      shopBaits: [
      { id: 1, name: "Червь", catchBonus: 0.2, price: 50 },
        { id: 2, name: "Кукуруза", catchBonus: 0.1, price: 30 },
        { id: 3, name: "Опарыш", catchBonus: 0.3, price: 40 },
        { id: 4, name: "Мотыль", catchBonus: 0.2, price: 50 }
      ],
      currentLocation: null,
      inventory: new Inventory(),
      showInventory: false,
      balance: 100 
    };
  },
  methods: {
    changeScreen(screen) {
      this.screen = screen;
      if (screen === "menu") {
        this.currentLocation = null;
      }
    },
    selectLocation(location) {
      this.currentLocation = location;
      this.changeScreen("fishing");
    },
    updateInventory(fish) {
      this.inventory.addFish(fish);
      this.$forceUpdate();
    },
    toggleInventory() {
      this.showInventory = !this.showInventory;
    },
    buyRod(rod) {
      if (this.balance < rod.price) {
        alert("Недостаточно средств!");
        return;
      }
      this.balance -= rod.price;
      this.ownedRods.push(rod);
      this.shopRods = this.shopRods.filter(r => r.id !== rod.id);
      alert(`Вы купили ${rod.name}!`);
    },
    sellFishOne(fish) {
  if (fish.count > 0) {
    const price = fish.price || 0; 
    this.balance += price;
    fish.count -= 1;
    if (fish.count === 0) {
      this.inventory.removeFish(fish.name);
    }
    alert(`Вы продали 1 ${fish.name} за ${price} монет.`);
  } else {
    alert("У вас нет этой рыбы!");
  }
},

sellFishAll() {
  const fishes = this.inventory.getFishes();
  let totalEarned = 0;

  fishes.forEach(fish => {
    const price = fish.price || 0;  
    totalEarned += price * fish.count;
    fish.count = 0;
  });

  this.balance += totalEarned;
  this.inventory.clearFishes();
  
  alert(`Вы продали всю рыбу и заработали ${totalEarned} монет!`);
},


    buyBait(bait) {
      if (this.balance < bait.price) {
        alert("Недостаточно средств!");
        return;
      }
      this.balance -= bait.price;
      const exists = this.ownedBaits.find(b => b.id === bait.id);
      if (exists) {
        exists.count += 1;
      } else {
        this.ownedBaits.push({ ...bait, count: 1 });
      }
      alert(`Вы купили ${bait.name}.`);
    }
  }
};
</script>

<style>
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

.inventory-container {
  position: fixed;
  top: 10px;
  right: 10px;
}

.inventory-button {
  background-color: #28a745;
  color: white;
}

.shop-button {
  background-color: #ffc107;
  color: white;
  margin-left: 10px;
}

.balance {
  font-size: 14px;
  margin-top: 10px;
}

.inventory-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
}

.inventory-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
}

.fish-item {
  background-color: #fff;
  color: #333;
  border-radius: 5px;
  padding: 10px;
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
.inventory-section {
  margin-bottom: 20px;
}

.inventory-section h4 {
  margin-bottom: 10px;
}

</style>